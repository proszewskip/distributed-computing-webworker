import { Map } from 'immutable';

import { WorkerThreadStatus } from 'features/worker/worker-thread';

import {
  AssignNextResponseBody,
  ComputationCancelRequestBody,
} from '../subtask-service';
import {
  createComputeSubtaskMessagePayload,
  SubtaskWorker,
  WorkerComputationResult,
  WorkerOptions,
} from '../worker';

import {
  DistributedNodeRunningState,
  DistributedNodeServiceDependencies,
  DistributedNodeState,
  DistributedNodeStateWithData,
  SubtaskWorkerInfo,
} from './types';
import { OnDistributedNodeStateUpdate } from './types/on-state-update';

/**
 * The number of milliseconds between starting a worker and asking for a new task.
 */
const START_NEW_TASK_INTERVAL = 200;

/**
 * The number of milliseconds after which the node is going to check if there are new tasks
 * if there have not been any tasks previously.
 */
const CHECK_FOR_TASKS_DELAY = 5000;

/**
 * A service that manages the lifecycle of a distributed node.
 *
 * Schedules registering the node, assigning new subtasks, orchestrates WebWorkers and sends the
 * results back to the server.
 */
export class DistributedNodeService {
  private readonly dependencies: DistributedNodeServiceDependencies;
  private readonly onStateUpdate: OnDistributedNodeStateUpdate;
  private threadsCount = 1;

  /**
   * The sequence number of the next worker.
   */
  private nextWorkerId = 1;

  // NOTE: possibly use ImmutableJS for state
  private state: DistributedNodeStateWithData = {
    state: DistributedNodeState.Pristine,
  };

  constructor(
    dependencies: DistributedNodeServiceDependencies,
    onStateUpdate: OnDistributedNodeStateUpdate,
  ) {
    this.dependencies = dependencies;
    this.onStateUpdate = onStateUpdate;
  }

  public getState() {
    return this.state;
  }

  /**
   * Registers the node
   */
  public init() {
    if (this.state.state !== DistributedNodeState.Pristine) {
      throw new Error('DistributedNode is already initialized');
    }

    this.registerNode();
  }

  /**
   * Stops all the services present on the node and kills all the workers.
   */
  public destroy() {
    if (this.state.state === DistributedNodeState.Pristine) {
      throw new Error('DistributedNode was not initialized');
    }

    if (this.dependencies.keepAliveService.isPolling) {
      this.dependencies.keepAliveService.stopPolling();
    }

    if (this.state.state === DistributedNodeState.Running) {
      this.stop();
    }
  }

  /**
   * Starts the node and queries for a next subtask.
   */
  public start() {
    if (this.state.state !== DistributedNodeState.Idle) {
      throw new Error('DistributedNode is not ready');
    }

    const { distributedNodeId } = this.state.data;

    this.setState({
      state: DistributedNodeState.Running,
      data: {
        runningState: DistributedNodeRunningState.AskingForNewTask,
        distributedNodeId,
        subtaskWorkers: Map(),
      },
    });

    this.assignNextSubtask();
  }

  /**
   * Stops the node and kills all the workers.
   *
   * The node remains registered and keep-alive messages are still sent.
   */
  public stop() {
    // TODO: allow the user to stop when Registering
    if (this.state.state !== DistributedNodeState.Running) {
      throw new Error('DistributedNode is not running');
    }

    if (
      this.state.data.runningState ===
      DistributedNodeRunningState.WaitingForTimeout
    ) {
      clearTimeout(this.state.data.data.timeoutId);
    }
    this.state.data.subtaskWorkers.forEach(({ worker }) =>
      cancelWorker(worker),
    );

    this.setState({
      state: DistributedNodeState.Idle,
      data: {
        distributedNodeId: this.state.data.distributedNodeId,
      },
    });
  }

  /**
   * Changes the threads count and possibly kills existing workers or schedules new subtasks if
   * empty workers are available.
   *
   * @param threadsCount
   */
  public setThreadsCount(threadsCount: number) {
    if (threadsCount < 1) {
      throw new Error('Cannot set threads count to less than 1');
    }

    this.threadsCount = threadsCount;
    this.onWorkersCountChanged();
  }

  private setState(newState: DistributedNodeStateWithData) {
    this.state = newState;

    this.onStateUpdate(newState);
  }

  private registerNode = async () => {
    this.setState({
      state: DistributedNodeState.Registering,
    });

    // TODO: add retrying if the request failed
    const distributedNodeId = await this.dependencies.registrationService.registerNode();
    /**
     * TODO: allow the user to click Stop and stop registering.
     * This should be also handled in the `stop` method
     */

    this.setState({
      state: DistributedNodeState.Idle,
      data: {
        distributedNodeId,
      },
    });
    this.dependencies.keepAliveService.startPolling(distributedNodeId);
  };

  private assignNextSubtask = async () => {
    if (this.state.state !== DistributedNodeState.Running) {
      throw new Error('DistributedNode is not running');
    }

    const { distributedNodeId } = this.state.data;

    this.setState({
      state: DistributedNodeState.Running,
      data: {
        runningState: DistributedNodeRunningState.AskingForNewTask,
        distributedNodeId,
        subtaskWorkers: this.state.data.subtaskWorkers,
      },
    });

    let assignNextSubtaskResponse: AssignNextResponseBody;
    try {
      assignNextSubtaskResponse = await this.dependencies.subtaskService.assignNextTask(
        distributedNodeId,
      );
    } catch (error) {
      this.startTimeout(
        distributedNodeId,
        this.state.data.subtaskWorkers,
        CHECK_FOR_TASKS_DELAY,
      );
      return;
    }

    if (this.state.state !== DistributedNodeState.Running) {
      // NOTE: DistributedNode was destroyed/stopped before the request finished
      return;
    }

    const subtaskMessagePayload = createComputeSubtaskMessagePayload(
      assignNextSubtaskResponse,
    );
    const subtaskWorkerId = this.nextWorkerId;
    this.nextWorkerId += 1;
    const subtaskWorker = this.dependencies.subtaskWorkerFactory(
      subtaskMessagePayload,
      {
        onWorkerUpdate: this.onWorkerUpdateFactory(subtaskWorkerId),
      },
    );
    subtaskWorker
      .start()
      .then(
        this.handleComputationResult(
          subtaskWorkerId,
          assignNextSubtaskResponse['subtask-in-progress-id'],
        ),
      )
      .catch(
        this.cancelWorkerComputation({
          'distributed-node-id': distributedNodeId,
          'subtask-in-progress-id':
            assignNextSubtaskResponse['subtask-in-progress-id'],
        }),
      );

    const updatedSubtaskWorkersMap = this.state.data.subtaskWorkers.set(
      subtaskWorkerId,
      {
        worker: subtaskWorker,
        state: {
          status: WorkerThreadStatus.WaitingForSubtaskInfo,
        },
      },
    );

    if (updatedSubtaskWorkersMap.size < this.threadsCount) {
      this.startTimeout(
        distributedNodeId,
        updatedSubtaskWorkersMap,
        START_NEW_TASK_INTERVAL,
      );
    } else {
      this.setState({
        state: DistributedNodeState.Running,
        data: {
          subtaskWorkers: updatedSubtaskWorkersMap,
          distributedNodeId,
          runningState: DistributedNodeRunningState.WaitingForEmptyThread,
        },
      });
    }
    this.onWorkersCountChanged();
  };

  private onWorkerUpdateFactory = (
    workerId: number,
  ): WorkerOptions['onWorkerUpdate'] => (newWorkerState) => {
    if (this.state.state !== DistributedNodeState.Running) {
      return;
    }

    const { subtaskWorkers } = this.state.data;
    const updatedSubtaskWorkers = subtaskWorkers.updateIn(
      [workerId],
      (workerInfo: SubtaskWorkerInfo): SubtaskWorkerInfo => ({
        state: newWorkerState,
        worker: workerInfo.worker,
      }),
    );

    this.setState({
      state: DistributedNodeState.Running,
      data: {
        ...this.state.data,
        subtaskWorkers: updatedSubtaskWorkers,
      },
    });
  };

  private startTimeout = (
    distributedNodeId: string,
    subtaskWorkers: Map<number, SubtaskWorkerInfo>,
    delay: number,
  ) => {
    this.setState({
      state: DistributedNodeState.Running,
      data: {
        subtaskWorkers,
        distributedNodeId,
        runningState: DistributedNodeRunningState.WaitingForTimeout,
        data: {
          timeoutId: (setTimeout as typeof window.setTimeout)(
            this.assignNextSubtask,
            delay,
          ),
        },
      },
    });
  };

  private handleComputationResult = (
    subtaskWorkerId: number,
    subtaskInProgressId: string,
  ) => async (result: WorkerComputationResult) => {
    if (this.state.state !== DistributedNodeState.Running) {
      return;
    }

    const { distributedNodeId } = this.state.data;

    /**
     * REFACTOR: extract the `switch` to a separate method
     * TODO: handle errors and retry
     */

    switch (result.status) {
      case WorkerThreadStatus.ComputationSuccess:
        await this.dependencies.subtaskService.sendComputationSuccess({
          distributedNodeId,
          subtaskInProgressId,
          subtaskResult: result.data,
        });
        break;

      case WorkerThreadStatus.UnknownError:
      case WorkerThreadStatus.ComputationError:
        await this.dependencies.subtaskService.sendComputationError({
          distributedNodeId,
          subtaskInProgressId,
          errors: result.data,
        });
        break;

      case WorkerThreadStatus.NetworkError:
        break;
    }

    if (this.state.state !== DistributedNodeState.Running) {
      return;
    }

    const updatedSubtaskWorkersMap = this.state.data.subtaskWorkers.delete(
      subtaskWorkerId,
    );

    this.setState({
      state: DistributedNodeState.Running,
      data: {
        ...this.state.data,
        subtaskWorkers: updatedSubtaskWorkersMap,
      },
    });
    this.onWorkersCountChanged();
  };

  private cancelWorkerComputation = (
    params: ComputationCancelRequestBody,
  ) => () => this.dependencies.subtaskService.sendComputationCancel(params);

  private onWorkersCountChanged = () => {
    if (this.state.state !== DistributedNodeState.Running) {
      return;
    }

    const runningStateData = this.state.data;

    const existingWorkersCount = runningStateData.subtaskWorkers.size;
    if (
      existingWorkersCount < this.threadsCount &&
      runningStateData.runningState ===
        DistributedNodeRunningState.WaitingForEmptyThread
    ) {
      this.assignNextSubtask();

      return;
    }

    // tslint:disable-next-line:early-exit
    if (existingWorkersCount >= this.threadsCount) {
      const workersLeft = runningStateData.subtaskWorkers.take(
        this.threadsCount,
      );
      const workersToCancel = runningStateData.subtaskWorkers.skip(
        this.threadsCount,
      );
      workersToCancel.forEach(({ worker }) => cancelWorker(worker));

      if (
        runningStateData.runningState ===
        DistributedNodeRunningState.WaitingForTimeout
      ) {
        clearTimeout(runningStateData.data.timeoutId);
      }
      this.setState({
        state: DistributedNodeState.Running,
        data: {
          distributedNodeId: runningStateData.distributedNodeId,
          runningState: DistributedNodeRunningState.WaitingForEmptyThread,
          subtaskWorkers: workersLeft,
        },
      });
    }
  };
}

const cancelWorker = (worker: SubtaskWorker) => worker.cancel();
