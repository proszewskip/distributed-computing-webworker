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

const kitsu = new Kitsu<UpdateDistributedTaskModel>({
  baseURL: config.serverIp,
});

export default class UpdateDistributedTask extends PureComponent<
  UpdateDistributedTaskProps,
  UpdateDistributedTaskModel
> {
  constructor(props: UpdateDistributedTaskProps) {
    super(props);

    this.state = {
      id: -1,
      name: '',
      description: '',
      'trust-level-to-complete': NaN,
      priority: NaN,
    };
  }

  public componentDidMount = () => {
    kitsu
      .get(`distributed-task/${this.props.id}`)
      .then((result) => result.data)
      .then((result) => this.setState(result));
  };

  public render() {
    return (
      (this.state.id === -1 && <ClipLoader loading={true} />) || (
        <UpdateDistributedTaskWithFormik
          id={this.state.id}
          name={this.state.name}
          description={this.state.description}
          priority={this.state.priority}
          trust-level-to-complete={this.state['trust-level-to-complete']}
        />
      )
    );
  }
}
