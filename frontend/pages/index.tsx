import { Card, Code, Heading, majorScale, Pane, Paragraph } from 'evergreen-ui';
import { NextStatelessComponent } from 'next';
import React from 'react';

import { Layout, LayoutProps } from 'components/layout';
import { Link } from 'components/link';

import {
  AppContext,
  AuthenticatedSidebar,
  config,
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
        <Pane margin={majorScale(1)} maxWidth={600}>
          <Heading size={700} marginBottom={majorScale(1)}>
            Distributed Computing in the browser
          </Heading>

          <Card
            padding={majorScale(2)}
            background="tint1"
            border="default"
            textAlign="justify"
          >
            <Paragraph>
              This web application allows you to share your computing power with
              the world by becoming a node in a distributed network that
              computes tasks using{' '}
              <Link route="https://webassembly.org/">
                <a target="_blank" rel="noopener noreferrer">
                  WebAssembly
                </a>
              </Link>
              .
            </Paragraph>

            <Paragraph marginTop="default">
              Become a worker node by clicking the{' '}
              <Link route="/worker">
                <a>Worker</a>
              </Link>{' '}
              in the sidebar.
            </Paragraph>

            {!props.isAuthenticated && (
              <Paragraph marginTop="default">
                If you are an administrator, click{' '}
                <Link route={config.loginPageUrl}>
                  <a>Login</a>
                </Link>{' '}
                in the sidebar to manage the system.
              </Paragraph>
            )}

            <Heading marginTop="default">
              How are tasks added to the system?
            </Heading>
            <Paragraph marginTop="default">
              Only the administrators are allowed to add tasks to the system.
            </Paragraph>
            <Paragraph marginTop="default">
              They do it by first creating a C# project and creating a class
              that implements <Code>IProblemPlugin</Code> - an interface that
              defines distributed problems. Its methods will be invoked either
              by our server or the distributed nodes.
            </Paragraph>
            <Paragraph marginTop="default">
              They then upload the built DLL files to the server. This
              constitutes a <Code>DistributedTaskDefinition</Code>.
            </Paragraph>
            <Paragraph marginTop="default">
              Afterwards, they need to create a <Code>DistributedTask</Code> by
              selecting a distributed task definition and uploading the input
              data for a given problem.
            </Paragraph>
            <Paragraph marginTop="default">
              The server divides the task into possibly multiple{' '}
              <Code>Subtask</Code>s which will be then assigned to workers -{' '}
              <Code>DistributedNode</Code>
              s.
            </Paragraph>
            <Paragraph marginTop="default">
              After computing the subtasks, workers send the results back to the
              server which joins the results and allows the administrator to see
              the results of a given <Code>DistributedTask</Code>.
            </Paragraph>
            <Paragraph marginTop="default">
              Should any errors occur, they are also presented to the
              administrator.
            </Paragraph>

            <Heading marginTop="default">Authors</Heading>
            <Paragraph marginTop="default">
              The authors of the project are Przemysław Proszewski and Grzegorz
              Rozdzialik.
            </Paragraph>
            <Paragraph marginTop="default">
              The project has been created as a part of a BSc Thesis.
            </Paragraph>
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
