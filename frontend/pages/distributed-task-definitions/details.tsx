import { Card, Pane } from 'evergreen-ui';
import { NextStatelessComponent } from 'next';
import React from 'react';

import { Layout, LayoutProps } from 'components/layout';
import { Link } from 'components/link';

import { AuthenticatedSidebar, Head } from 'product-specific';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

interface DetailsInitialProps {
  id: number;
}

const Details: NextStatelessComponent<DetailsInitialProps> = ({ id }) => (
  <>
    <Head />

    <Layout renderSidebar={renderSidebar}>
      <Pane display="flex" justifyContent="center" marginTop="2em">
        <Card padding={80} border="default" background="tint2">
          {id}

          <Link
            route="distributed-task-definition-details"
            params={{ id: id + 1 }}
          >
            <a>Next one</a>
          </Link>
        </Card>
      </Pane>
    </Layout>
  </>
);

Details.getInitialProps = ({ query }) => {
  console.log(query);
  return {
    id: parseInt(query.id as string, 10),
  };
};

export default Details;
