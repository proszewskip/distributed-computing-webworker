import { Card, Pane } from 'evergreen-ui';
import fetch from 'isomorphic-unfetch';
import { NextStatelessComponent } from 'next';
import React from 'react';

import { Layout, LayoutProps } from 'components/layout';

import {
  AuthenticatedSidebar,
  Head,
  UnauthenticatedSidebar,
} from 'product-specific';

import { isAuthenticated } from 'features/authentication';

const renderAuthenticatedSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

const renderUnauthenticatedSidebar: LayoutProps['renderSidebar'] = () => (
  <UnauthenticatedSidebar />
);

interface IndexPageProps {
  isAuthenticated: boolean;
}

const IndexPage: NextStatelessComponent<IndexPageProps> = (props) => {
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

IndexPage.getInitialProps = ({ req }) => {
  const headers: Record<string, string> = req
    ? { cookie: (req.headers.cookie as string) || '' }
    : {};

  return isAuthenticated(fetch, headers).then(
    (authenticated): IndexPageProps => ({
      isAuthenticated: authenticated,
    }),
  );
};

export default IndexPage;
