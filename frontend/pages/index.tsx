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
    'subtask-in-progress-id': '1',
    'subtask-id': '1',
    'compiled-task-definition-url':
      'http://localhost:5000/public/task-definitions/772e06b0-dad1-49eb-955f-d8726238a61a',
    'problem-plugin-info': {
      'assembly-name': 'FactorialTask',
      namespace: 'FactorialTask',
      'class-name': 'FactorialSumPlugin',
    },
  };
  const distributedNodeId = '55301d87-cfc8-48c5-ad58-e188d7a39f38';

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
