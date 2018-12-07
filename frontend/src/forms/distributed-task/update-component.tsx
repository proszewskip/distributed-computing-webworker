import { Alert } from 'evergreen-ui';
import Kitsu from 'kitsu';
import React, { PureComponent } from 'react';
import { ClipLoader } from 'react-spinners';

import { config } from 'config';

import UpdateDistributedTaskWithFormik, {
  UpdateDistributedTaskModel,
} from './update';

interface UpdateDistributedTaskProps {
  id: number;
}

interface UpdateDistributedTaskState {
  fetchFinished: boolean;
  fetchError: boolean;
  model: UpdateDistributedTaskModel;
}

const kitsu = new Kitsu<UpdateDistributedTaskModel>({
  baseURL: config.serverIp,
});

export class UpdateDistributedTask extends PureComponent<
  UpdateDistributedTaskProps,
  UpdateDistributedTaskState
> {
  constructor(props: UpdateDistributedTaskProps) {
    super(props);

    this.state = {
      model: {
        id: NaN,
        name: '',
        description: '',
        'trust-level-to-complete': NaN,
        priority: NaN,
      },
      fetchError: false,
      fetchFinished: false,
    };
  }

  public componentDidMount = () => {
    kitsu
      .get(`distributed-task/${this.props.id}`)
      .then((result) => result.data)
      .then((result) => this.setState({ model: result, fetchFinished: true }))
      .catch(() => {
        this.setState({ fetchError: true, fetchFinished: true });
      });
  };

  public render() {
    const { id, name, description, priority } = this.state.model;
    const { fetchFinished, fetchError } = this.state;

    return (
      (!fetchFinished && <ClipLoader loading={true} />) ||
      (fetchError && (
        <Alert intent="danger" title="Failed to fetch resources" />
      )) || (
        <UpdateDistributedTaskWithFormik
          id={id}
          name={name}
          description={description}
          priority={priority}
          trust-level-to-complete={this.state.model['trust-level-to-complete']}
        />
      )
    );
  }
}
