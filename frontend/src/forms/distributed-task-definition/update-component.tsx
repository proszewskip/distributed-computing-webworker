import Kitsu from 'kitsu';
import React, { PureComponent } from 'react';
import { ClipLoader } from 'react-spinners';

import { config } from 'config';

import UpdateDistributedTaskDefinitionWithFormik, {
  UpdateDistributedTaskDefinitionModel,
} from './update';

interface UpdateDistributedTaskDefinitionComponentProps {
  id: number;
}

const kitsu = new Kitsu<UpdateDistributedTaskDefinitionModel>({
  baseURL: config.serverIp,
});

export class UpdateDistributedTaskDefinition extends PureComponent<
  UpdateDistributedTaskDefinitionComponentProps,
  UpdateDistributedTaskDefinitionModel
> {
  constructor(props: UpdateDistributedTaskDefinitionComponentProps) {
    super(props);

    this.state = {
      id: -1,
      name: '',
      description: '',
    };
  }

  public componentDidMount = () => {
    kitsu
      .get(`distributed-task-definitions/${this.props.id}`)
      .then((result) => result.data)
      .then((result) => this.setState(result));
  };

  public render() {
    const { id, name, description } = this.state;

    return (
      (id === -1 && <ClipLoader loading={true} />) || (
        <UpdateDistributedTaskDefinitionWithFormik
          id={this.props.id}
          name={name}
          description={description}
        />
      )
    );
  }
}
