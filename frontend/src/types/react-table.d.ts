import { TableProps } from 'react-table';
import {} from 'react-table/lib/hoc/selectTable';

declare module 'react-table' {
  interface TableProps {
    resolveData(data: any): any[];
  }
}
