import { Card, Pane } from 'evergreen-ui';
import { NextStatelessComponent } from 'next';
import React from 'react';

import { Layout, LayoutProps } from 'components/layout';

import { AuthenticatedSidebar, Head } from 'product-specific';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

interface DetailsInitialProps {
  id: string;
}

const Details: NextStatelessComponent<DetailsInitialProps> = ({ id }) => (
  <>
    <Head />

    <Layout renderSidebar={renderSidebar}>
      <Pane display="flex" justifyContent="center" marginTop="2em">
        <Card padding={80} border="default" background="tint2">
          {id}
        </Card>
      </Pane>
    </Layout>
  </>
);

Details.getInitialProps = ({ query }) => {
  return {
    id: query.id as string,
  };
};

export default Details;
