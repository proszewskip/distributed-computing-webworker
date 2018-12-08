import { Card, Pane } from 'evergreen-ui';
import React from 'react';

import { Layout, LayoutProps } from 'components/layout';

import { AuthenticatedSidebar, Head } from 'product-specific';

import { routes } from '../../routes';

const { Link } = routes;

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

export default () => (
  <>
    <Head />

    <Layout renderSidebar={renderSidebar}>
      <Pane display="flex" justifyContent="center" marginTop="2em">
        <Card padding={80} border="default" background="tint2">
          Distributed task definitions
          <Link route="/distributed-task-definitions/1">
            <a>See details</a>
          </Link>
        </Card>
      </Pane>
    </Layout>
  </>
);
