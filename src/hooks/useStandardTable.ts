import React from 'react';
import {
  useTable,
  usePagination,
  useSortBy,
  useGlobalFilter,
  useColumnOrder,
  useExpanded,
  useGroupBy,
  useBlockLayout,
  useRowSelect,
} from 'react-table';
// import { GridHandler } from '../../../utils';
// import { useStores } from '../../../hooks/useStore';
// import useTimeMode from '../../../hooks/useTimeMode';

import {
  BaseObject,
  UseStandardTableInstance,
  UseStandardTableProps,
} from '../types/tables';
import useTimeMode from './useTimeMode';

export function useStandardTable<T extends object = BaseObject>({
  columns,
  fetchAsync,
  resolveData: overridedResolveData,
  params,
  accessKey,
  initialState,
  serverSide = false,
  shouldFetch = true,
  disableSort = false,
  defaultColumn,
  groupBy,
  useControlledState,
}: UseStandardTableProps<T>): UseStandardTableInstance<T> {
  // const store = useStores();
  const [data, setData] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [totalRows, setTotalRows] = React.useState(0);
  const [lastUpdated, setLastUpdated] = React.useState<any>();
  const { timeMode, setTimeMode } = useTimeMode();
  // const [timeMode, setTimeMode] = React.useState<string>(
  //   GridHandler.userTimeMode(accessKey, store, 'utc')
  // );

  const showFooter =
    columns.findIndex((column) => column.Footer !== undefined) > -1 ||
    Boolean(defaultColumn && defaultColumn.Footer !== undefined); // Get rid of the empty footer

  const resolveData = React.useCallback(
    (response) => {
      if (overridedResolveData) return overridedResolveData(response);
      return response.data;
    },
    [overridedResolveData]
  );

  const instance = useTable<T>(
    {
      data,
      columns,
      initialState: { pageSize: 20, ...initialState },
      manualGlobalFilter: serverSide,
      manualSortBy: serverSide,
      manualPagination: serverSide,
      manualGroupBy: serverSide,
      defaultColumn,
      // useControlledState,
      useControlledState: (state) =>
        React.useMemo(
          () => ({
            ...state,
            timeMode: timeMode,
            ...(groupBy && { groupBy }),
          }),
          [state, timeMode, groupBy]
        ),

      paginateExpandedRows: false,
      disableSortBy: disableSort,
    },
    useGlobalFilter,
    useGroupBy,
    useSortBy,
    useColumnOrder,
    useExpanded,
    usePagination,
    useBlockLayout,
    useRowSelect
  );

  const fetchData = React.useCallback(
    async ({ page: pageIndex, size: pageSize, sort: sortBy, words }) => {
      if (shouldFetch) {
        setLoading(true);
        const res = await fetchAsync({
          ...params,
          page: pageIndex,
          size: pageSize,
          ...(sortBy &&
            sortBy.length > 0 && {
              sort: sortBy[0].desc ? `-${sortBy[0].id}` : `${sortBy[0].id}`,
            }),
          //fq: fields || '',
          q: words || '',
        });

        // Prevent error
        if (res?.status === 200) {
          const { rows, totalRows } = resolveData(res);
          setData(rows);
          setTotalRows(totalRows);
          setLastUpdated(res?.data.lastUpdated);
        }

        setLoading(false);
      }
    },
    []
  );

  return {
    instance,
    totalRows,
    loading,
    serverSide,
    params,
    lastUpdated,
    showFooter,
    accessKey,
    timeMode,
    fetchData,
    setData,
    setTimeMode,
    setLoading,
  };
}
