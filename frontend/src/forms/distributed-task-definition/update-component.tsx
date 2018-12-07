import { Alert } from 'evergreen-ui';
import Kitsu from 'kitsu';
import React, { PureComponent } from 'react';
import { ClipLoader } from 'react-spinners';

import { config } from 'config';

import UpdateDistributedTaskDefinitionWithFormik, {
  UpdateDistributedTaskDefinitionModel,
} from './update';

interface UpdateDistributedTaskDefinitionProps {
  id: number;
}

interface UpdateDistributedTaskDefinitionState {
  fetchFinished: boolean;
  fetchError: boolean;
  model: UpdateDistributedTaskDefinitionModel;
}
const kitsu = new Kitsu<UpdateDistributedTaskDefinitionModel>({
  baseURL: config.serverIp,
});

export class UpdateDistributedTaskDefinition extends PureComponent<
  UpdateDistributedTaskDefinitionProps,
  UpdateDistributedTaskDefinitionState
> {
  constructor(props: UpdateDistributedTaskDefinitionProps) {
    super(props);

    this.state = {
      model: {
        id: NaN,
        name: '',
        description: '',
      },
      fetchFinished: false,
      fetchError: false,
    };
  }

  public componentDidMount = () => {
    kitsu
      .get(`distributed-task-definitions/${this.props.id}`)
      .then((result) => result.data)
      .then((result) => this.setState({ model: result, fetchFinished: true }))
      .catch(() => {
        this.setState({ fetchError: true, fetchFinished: true });
      });
  };

  public render() {
    const { id, name, description } = this.state.model;
    const { fetchFinished, fetchError } = this.state;

    return (
      (!fetchFinished && <ClipLoader loading={true} />) ||
      (fetchError && (
        <Alert intent="danger" title="Failed to fetch resources" />
      )) || (
        <UpdateDistributedTaskDefinitionWithFormik
          id={id}
          name={name}
          description={description}
        />
      )
    );
  }
}
