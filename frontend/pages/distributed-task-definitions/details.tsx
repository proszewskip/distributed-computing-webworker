import {
  Card,
  Heading,
  majorScale,
  minorScale,
  Pane,
  Text,
} from 'evergreen-ui';
import { NextComponentClass } from 'next';
import React, { PureComponent, ReactNode } from 'react';

import { ErrorPage, RequestErrorInfo } from 'components/errors';
import { Layout, LayoutProps } from 'components/layout';
import { Link } from 'components/link';

import { RequestError, transformRequestError } from 'error-handling';

import { DistributedTaskDefinition } from 'models';

import {
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  Head,
  kitsuFactory,
} from 'product-specific';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

interface DetailsInitialProps {
  id: number;
  data?: DistributedTaskDefinition;
  error?: RequestError;
}

class DetailsPage extends PureComponent<DetailsInitialProps> {
  public static getInitialProps: NextComponentClass<
    DetailsInitialProps
  >['getInitialProps'] = ({ query }) => {
    const id = parseInt(query.id as string, 10);

    const kitsu = kitsuFactory();

    return kitsu
      .get<DistributedTaskDefinition>(`distributed-task-definition/${id}`)
      .then((result) => ({
        id,
        data: result.data,
      }))
      .catch(
        (error): DetailsInitialProps => ({
          id,
          error: transformRequestError(error),
        }),
      );
  };

  public render() {
    return (
      <>
        <Head />

        <BaseDependenciesProvider>
          <Layout renderSidebar={renderSidebar}>
            <Pane margin={majorScale(1)}>
              <Heading size={700} marginBottom={majorScale(1)}>
                Distributed Task Definition details
              </Heading>

              {this.renderErrors()}
              {this.renderDetails()}
            </Pane>
          </Layout>
        </BaseDependenciesProvider>
      </>
    );
  }

  private renderDetails = (): ReactNode => {
    const { data } = this.props;

    if (!data) {
      return null;
    }

    const problemPluginInfo = data['problem-plugin-info'];

    return (
      <>
        <Card
          background="tint2"
          display="grid"
          gridTemplateColumns="minmax(min-content, max-content) 1fr"
          gridGap={minorScale(4)}
          padding={minorScale(2)}
          maxWidth={600}
          overflow="auto"
          marginBottom={majorScale(2)}
        >
          <Pane>
            <Text>ID</Text>
          </Pane>
          <Pane>
            <Text>{data.id}</Text>
          </Pane>

          <Pane>
            <Text>Name</Text>
          </Pane>
          <Pane>
            <Text>{data.name}</Text>
          </Pane>

          <Pane>
            <Text>Description</Text>
          </Pane>
          <Pane>{data.description}</Pane>

          <Pane>
            <Text>Main DLL name</Text>
          </Pane>
          <Pane>
            <Text>{data['main-dll-name']}</Text>
          </Pane>

          <Pane>
            <Text>Class path</Text>
          </Pane>
          <Pane>
            <Text>
              {problemPluginInfo['assembly-name']}.{problemPluginInfo.namespace}
              .{problemPluginInfo['class-name']}
            </Text>
          </Pane>
        </Card>

        <Heading>Distributed Tasks</Heading>
        <Text>In progress...</Text>
      </>
    );
  };

  private renderErrors = (): ReactNode => {
    const { error } = this.props;

    if (!error) {
      return null;
    }

    return (
      <ErrorPage>
        <RequestErrorInfo error={error} />

        <Link route="/distributed-task-definitions">
          <a>Go back to the list of distributed task definitions</a>
        </Link>
      </ErrorPage>
    );
  };
}

export default DetailsPage;
