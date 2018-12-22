import React, { Component } from 'react';

import { config } from 'product-specific';

class LoginPage extends Component {
  public componentDidMount() {
    setTimeout(async () => {
      await fetch(`${config.serverUrl}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'admin', password: 'D1stributed$' }),
      });

      console.log('Logged in');
    }, 2000);
  }

  public render() {
    return <div>Login</div>;
  }
}

export default LoginPage;
