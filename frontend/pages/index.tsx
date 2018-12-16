import { Card, Pane } from 'evergreen-ui';
import React, { StatelessComponent } from 'react';

import { Layout, LayoutProps } from 'components/layout';

import { AssignNextResponse, DistributedNode } from 'features/worker-node';

import { AuthenticatedSidebar, Head } from 'product-specific';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

const Index: StatelessComponent = () => {
  const assignNextResponse: AssignNextResponse = {
    'subtask-in-progress-id': '8',
    'subtask-id': '10',
    'compiled-task-definition-url':
      'http://localhost:5000/public/task-definitions/8479081f-b799-424c-befe-68925793622d',
    'problem-plugin-info': {
      'assembly-name': 'FactorialTask',
      namespace: 'FactorialTask',
      'class-name': 'FactorialSumPlugin',
    },
  };
  const distributedNodeId = '605495c7-6c04-42ff-8107-0034ca29ba81';

  return (
    <>
      <Head />

      <Layout renderSidebar={renderSidebar}>
        <Pane display="flex" justifyContent="center" marginTop="2em">
          <Card padding={80} border="default" background="tint2">
            Info here
          </Card>

          <DistributedNode
            distributedNodeId={distributedNodeId}
            assignNextResponse={assignNextResponse}
          />
        </Pane>
      </Layout>
    </>
  );
};

export default Index;
