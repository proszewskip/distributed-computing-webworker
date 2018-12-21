import { Card, Pane } from 'evergreen-ui';
import fetch from 'isomorphic-unfetch';
import { NextStatelessComponent } from 'next';
import React from 'react';

import { Layout, LayoutProps } from 'components/layout';

import { AuthenticatedSidebar, Head } from 'product-specific';

import { isAuthenticated } from 'features/authentication';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

const Index: NextStatelessComponent = () => {
  return (
    <>
      <Head />

      <Layout renderSidebar={renderSidebar}>
        <Pane display="flex" justifyContent="center" marginTop="2em">
          <Card padding={80} border="default" background="tint2">
            Info here
          </Card>
        </Pane>
      </Layout>
    </>
  );
};

Index.getInitialProps = async () => {
  await isAuthenticated(fetch);
};

export default Index;
