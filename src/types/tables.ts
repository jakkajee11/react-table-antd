import {
  Column,
  TableState,
  UseTableOptions,
  Meta,
  TableInstance,
} from 'react-table';
import { TimeMode } from './timeMode';

declare module 'react-table' {
  // take this file as-is, or comment out the sections that don't apply to your plugin configuration

  interface TableOptions<D extends object>
    extends UseExpandedOptions<D>,
      UseFiltersOptions<D>,
      UseGlobalFiltersOptions<D>,
      UseGroupByOptions<D>,
      UsePaginationOptions<D>,
      UseResizeColumnsOptions<D>,
      UseRowSelectOptions<D>,
      UseRowStateOptions<D>,
      UseSortByOptions<D> {
    // updateMyData: (rowIndex: number, columnId: string, value: any) => void;
  }

  interface TableInstance<D extends object = {}>
    extends UseColumnOrderInstanceProps<D>,
      UseExpandedInstanceProps<D>,
      UseFiltersInstanceProps<D>,
      UseGlobalFiltersInstanceProps<D>,
      UseGroupByInstanceProps<D>,
      UsePaginationInstanceProps<D>,
      UseRowSelectInstanceProps<D>,
      UseRowStateInstanceProps<D>,
      UseSortByInstanceProps<D> {
    editable: boolean;
  }

  interface TableState<D extends object = {}>
    extends UseColumnOrderState<D>,
      UseExpandedState<D>,
      UseFiltersState<D>,
      UseGlobalFiltersState<D>,
      UseGroupByState<D>,
      UsePaginationState<D>,
      UseResizeColumnsState<D>,
      UseRowSelectState<D>,
      UseRowStateState<D>,
      UseSortByState<D> {}

  interface ColumnInterface<D extends object = {}>
    extends UseFiltersColumnOptions<D>,
      UseGlobalFiltersColumnOptions<D>,
      UseGroupByColumnOptions<D>,
      // UseResizeColumnsColumnOptions<D>,
      UseSortByColumnOptions<D> {
    Footer?: Renderer<CellProps<D>>;
    style?: React.CSSProperties;
    footerStyle?: React.CSSProperties;
    draggable?: boolean;
  }

  interface ColumnInstance<D extends object = {}>
    extends UseFiltersColumnProps<D>,
      UseGroupByColumnProps<D>,
      UseResizeColumnsColumnProps<D>,
      UseSortByColumnProps<D> {}

  interface Cell<D extends object = {}>
    extends UseGroupByCellProps<D>,
      UseRowStateCellProps<D> {}

  interface Row<D extends object = {}>
    extends UseExpandedRowProps<D>,
      UseGroupByRowProps<D>,
      UseRowSelectRowProps<D>,
      UseRowStateRowProps<D> {
    groupByID: IdType<D>; // BUG: ReactTable is not compatible with @types/react-table
  }
}

export interface DataTable<T> {
  rows: Array<T>;
  totalRows: number;
  lastUpdated: string;
}

export interface UseTableInstance<T extends object = {}> {
  serverSide: boolean;
  data: Array<T>;
  loading: boolean;
  columns: Array<Column<T>>;
  params?: object;
  controlledState?: Partial<TableState<T>>;
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  setColumns: React.Dispatch<React.SetStateAction<Column<T>[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setParams: React.Dispatch<React.SetStateAction<object | undefined>>;
  fetchData: (params: any) => void;
  initialState?: object;
}

export type BaseObject = {};

export interface UseStandardTableProps<T extends object = BaseObject> {
  columns: Array<Column<T>>;
  params?: object;
  initialState?: Partial<TableState<T>>;
  serverSide?: boolean;
  shouldFetch?: boolean;
  disableSort?: boolean;
  defaultColumn?: Partial<Column<T>>;
  accessKey?: string;
  groupBy?: string[];

  // Actions
  fetchAsync: (params: any) => Promise<any>;
  resolveData?: (response: any) => DataTable<T>;
  renderRowSubComponent?: ({ row }: any) => JSX.Element;
  useControlledState?: (state: TableState<T>, meta: Meta<T>) => TableState<T>;
}

export interface UseStandardTableInstanceProps {
  instance: TableInstance<any>;
  totalRows: number;
  loading: boolean;
  serverSide?: boolean;
  params?: object;
  lastUpdated?: string;
  // Actions
  fetchData: (params: any) => Promise<any>;
}

export interface UseStandardTableInstance<T extends object> {
  instance: TableInstance<T>;
  totalRows: number;
  loading: boolean;
  serverSide?: boolean;
  params?: object;
  lastUpdated?: string;
  showFooter: boolean;
  accessKey?: string;
  timeMode: TimeMode;
  // Actions
  setTimeMode: React.Dispatch<React.SetStateAction<TimeMode>>;
  fetchData: (params: any) => Promise<any>;
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TableProps<D extends object = {}> extends UseTableOptions<D> {
  columns: Array<Column<D>>;
  data: Array<D>;
  loading: boolean;
  pageCount?: number;
  serverSide?: boolean;
  totalRows?: number;
  initialState?: Partial<TableState<object>>;
  controlledState?: Partial<TableState<D>>;
  // Actions
  fetchData: (params?: any) => void;
  renderRowSubComponent?: ({ row }: any) => JSX.Element;
  renderHeaderAction?: () => JSX.Element;
  onColumnOrderChange?: (columns: string[]) => void;
}

export interface StandardTableExtraProps {
  showColumToggler?: boolean;
  showSearchBar?: boolean;
  showArchived?: boolean;
  showTimeMode?: boolean;
  showRightAction?: boolean;
  reportType?: number;
  exportFilter?: any;
  exportable?: boolean;
  accessKey?: string;
  timeMode: TimeMode;
  //timeMode?: string;
  showAction?: boolean;
  showPagination?: boolean;
  showQuickJumper?: boolean;
  showSizeChanger?: boolean;
  showFooter: boolean;
  height?: string;
  // Actions
  renderRowSubComponent?: ({ row }: any) => JSX.Element;
  renderHeaderAction?: () => JSX.Element | null;
  onColumnOrderChange?: (columns: string[]) => void;
  setTimeMode: React.Dispatch<React.SetStateAction<TimeMode>>;
}
