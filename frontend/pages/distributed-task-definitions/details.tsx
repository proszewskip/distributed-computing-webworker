import { Card, Pane } from 'evergreen-ui';
import { NextStatelessComponent } from 'next';
import React, { StatelessComponent } from 'react';

import {
  DependenciesExtractor,
  withDependencies,
} from 'components/dependency-injection/with-dependencies';
import { Layout, LayoutProps } from 'components/layout';
import { Link } from 'components/link';

import {
  AuthenticatedSidebar,
  BaseDependencies,
  BaseDependenciesProvider,
  Head,
  kitsuFactory,
} from 'product-specific';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

interface DetailsInitialProps {
  id: number;
}

interface DependencyUserDependencies {
  kitsu: BaseDependencies['kitsu'];
}

const DependencyUser: StatelessComponent<DependencyUserDependencies> = ({
  kitsu,
}) => {
  console.log('I have access to', kitsu);

  return <div>I have access!</div>;
};

const dependencyUserDependenciesExtractor: DependenciesExtractor<
  BaseDependencies,
  DependencyUserDependencies
> = ({ kitsu }) => ({ kitsu });

const EnhancedDependencyUser = withDependencies(
  dependencyUserDependenciesExtractor,
)(DependencyUser);

const Details: NextStatelessComponent<DetailsInitialProps> = ({ id }) => (
  <>
    <Head />

    <BaseDependenciesProvider>
      <Layout renderSidebar={renderSidebar}>
        <Pane display="flex" justifyContent="center" marginTop="2em">
          <Card padding={80} border="default" background="tint2">
            {id}

            <EnhancedDependencyUser />

            <Link
              route="distributed-task-definition-details"
              params={{ id: id + 1 }}
            >
              <a>Next one</a>
            </Link>
          </Card>
        </Pane>
      </Layout>
    </BaseDependenciesProvider>
  </>
);

Details.getInitialProps = async ({ query }) => {
  /**
   * There is no access to the dependenciesHere, so in `getInitialProps`, `kitsuFactory` has to be
   * called explicitly.
   */

  const id = parseInt(query.id as string, 10);

  const kitsu = kitsuFactory();
  try {
    const result = await kitsu.get(`distributed-task-definition/${id}`);
    console.log(result);
  } catch (error) {
    console.log('Error', error);
  }

  console.log(query);
  return {
    id,
  };
};

export default Details;
