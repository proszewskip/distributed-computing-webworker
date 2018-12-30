import { Code, minorScale, Paragraph } from 'evergreen-ui';
import React, { StatelessComponent } from 'react';

interface DistributedNodeIdInfoProps {
  id: string;
}

export const DistributedNodeIdInfo: StatelessComponent<
  DistributedNodeIdInfoProps
> = ({ id }) => (
  <>
    <Paragraph marginBottom={minorScale(1)}>Distributed Node ID:</Paragraph>

    <Code>{id}</Code>
  </>
);
