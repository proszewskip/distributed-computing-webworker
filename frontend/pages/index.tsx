import { Card, Pane } from 'evergreen-ui';
import { NextStatelessComponent } from 'next';
import React from 'react';

import { Layout, LayoutProps } from 'components/layout';

import {
  AppContext,
  AuthenticatedSidebar,
  Head,
  isAuthenticated,
  UnauthenticatedSidebar,
} from 'product-specific';

const renderAuthenticatedSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

const renderUnauthenticatedSidebar: LayoutProps['renderSidebar'] = () => (
  <UnauthenticatedSidebar />
);

interface IndexPageProps {
  isAuthenticated: boolean;
}

const IndexPage: NextStatelessComponent<
  IndexPageProps,
  IndexPageProps,
  AppContext
> = (props) => {
  const renderSidebar = props.isAuthenticated
    ? renderAuthenticatedSidebar
    : renderUnauthenticatedSidebar;

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

IndexPage.getInitialProps = ({ fetch }) => {
  return isAuthenticated(fetch).then(
    (authenticated): IndexPageProps => ({
      isAuthenticated: authenticated,
    }),
  );
};

export default IndexPage;
