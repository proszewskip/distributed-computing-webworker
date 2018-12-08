import { Card, Pane } from 'evergreen-ui';
import React from 'react';

import 'styles.css';

import { Head } from 'components/head';
import { Layout, LayoutProps } from 'components/layout';
import { AuthenticatedSidebar } from 'product-specific';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

const Index = () => (
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

export default Index;
