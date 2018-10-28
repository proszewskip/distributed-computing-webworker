import { ComponentClass, ReactNode, StatelessComponent } from 'react';
import { ReactTableDefaults } from 'react-table';

const OriginalTableComponent = ReactTableDefaults.TableComponent as ComponentClass;

export interface TableWithSummaryProps {
  renderSummary(): ReactNode;
}

export const TableWithSummary: StatelessComponent<TableWithSummaryProps> = ({
  renderSummary,
  ...rest
}) => {
  return (
    <>
      <OriginalTableComponent {...rest} />
      {renderSummary()}
    </>
  );
};
