import { Map } from 'immutable';

import { AssignNextResponseBody } from '../subtask-service';
import {
  createComputeSubtaskMessagePayload,
  SubtaskWorker,
  WorkerComputationResult,
} from '../worker';
import { WorkerThreadStatus } from '../worker-thread';

import {
  DistributedNodeRunningState,
  DistributedNodeServiceDependencies,
  DistributedNodeState,
  DistributedNodeStateWithData,
} from './types';

/**
 * The timeout between assigning next subtask
 */
const SUBTASK_GRACE_PERIOD_TIMEOUT = 1000;

export class DistributedNodeService {
  private readonly dependencies: DistributedNodeServiceDependencies;
  private threadsCount = 1;

  /**
   * The sequence number of the next worker.
   */
  private nextWorkerId = 1;

  // NOTE: possibly use ImmutableJS for state
  private state: DistributedNodeStateWithData = {
    state: DistributedNodeState.Pristine,
  };

  constructor(dependencies: DistributedNodeServiceDependencies) {
    this.dependencies = dependencies;
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

  public destroy() {
    if (this.state.state === DistributedNodeState.Pristine) {
      throw new Error('DistributedNode was not initialized');
    }

    this.dependencies.keepAliveService.stopPolling();
    this.stop();
  }

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

    this.dependencies.keepAliveService.startPolling(distributedNodeId);
    this.assignNextSubtask();
  }

  public stop() {
    if (this.state.state !== DistributedNodeState.Running) {
      throw new Error('DistributedNode is not running');
    }

    if (
      this.state.data.runningState ===
      DistributedNodeRunningState.WaitingForTimeout
    ) {
      clearTimeout(this.state.data.data.timeoutId);
    }
    this.state.data.subtaskWorkers.forEach(cancelWorker);

    this.setState({
      state: DistributedNodeState.Idle,
      data: {
        distributedNodeId: this.state.data.distributedNodeId,
      },
    });
  }

  public setThreadsCount(threadsCount: number) {
    if (threadsCount < 1) {
      throw new Error('Cannot set threads count to less than 1');
    }

    this.threadsCount = threadsCount;
    this.onWorkersCountChanged();
  }

  private setState(newState: DistributedNodeStateWithData) {
    this.state = newState;

    // TODO: emit and event to notify the consumers of `DistributedNode`
  }

  private registerNode = async () => {
    this.setState({
      state: DistributedNodeState.Registering,
    });

    // TODO: add retrying if the request failed
    const distributedNodeId = await this.dependencies.registrationService.registerNode();

    this.setState({
      state: DistributedNodeState.Idle,
      data: {
        distributedNodeId,
      },
    });
  };

  private assignNextSubtask = async () => {
    if (this.state.state !== DistributedNodeState.Running) {
      throw new Error('DistributedNode is not running');
    }

    const { distributedNodeId } = this.state.data;

    // TODO: detect if there are no subtasks and go to Timeout state
    let assignNextSubtaskResponse: AssignNextResponseBody;
    try {
      assignNextSubtaskResponse = await this.dependencies.subtaskService.assignNextTask(
        distributedNodeId,
      );
    } catch (error) {
      this.startTimeout(distributedNodeId, this.state.data.subtaskWorkers);
      return;
    }

    if (this.state.state !== DistributedNodeState.Running) {
      // NOTE: DistributedNode was destroyed/stopped before the request finished
      return;
    }

    const subtaskMessagePayload = createComputeSubtaskMessagePayload(
      assignNextSubtaskResponse,
    );
    const subtaskWorker = this.dependencies.subtaskWorkerFactory(
      subtaskMessagePayload,
    );
    const subtaskWorkerId = this.nextWorkerId;
    this.nextWorkerId += 1;
    subtaskWorker
      .start()
      .then(
        this.handleComputationResult(
          subtaskWorkerId,
          assignNextSubtaskResponse['subtask-in-progress-id'],
        ),
      );

    const updatedSubtaskWorkersMap = this.state.data.subtaskWorkers.set(
      subtaskWorkerId,
      subtaskWorker,
    );

    if (updatedSubtaskWorkersMap.size < this.threadsCount) {
      this.startTimeout(distributedNodeId, updatedSubtaskWorkersMap);
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

  private startTimeout = (
    distributedNodeId: string,
    subtaskWorkers: Map<number, SubtaskWorker>,
  ) => {
    this.setState({
      state: DistributedNodeState.Running,
      data: {
        subtaskWorkers,
        distributedNodeId,
        runningState: DistributedNodeRunningState.WaitingForTimeout,
        data: {
          timeoutId: window.setTimeout(
            this.assignNextSubtask,
            SUBTASK_GRACE_PERIOD_TIMEOUT,
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
      this.setState({
        state: DistributedNodeState.Running,
        data: {
          ...runningStateData,
          runningState: DistributedNodeRunningState.AskingForNewTask,
        },
      });
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
      workersToCancel.forEach(cancelWorker);

      if (
        runningStateData.runningState ===
        DistributedNodeRunningState.WaitingForTimeout
      ) {
        clearTimeout(runningStateData.data.timeoutId);
      }
      this.setState({
        state: DistributedNodeState.Running,
        data: {
          ...runningStateData,
          runningState: DistributedNodeRunningState.WaitingForEmptyThread,
          subtaskWorkers: workersLeft,
        },
      });
    }
  };
}

const cancelWorker = (worker: SubtaskWorker) => worker.cancel();
