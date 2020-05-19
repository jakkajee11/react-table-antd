import React from 'react';
import logo from './logo.svg';
import './App.css';

import { useStandardTable as useTable } from './hooks/useStandardTable';
import { Table } from './components/Table';
import makeData from './utils/makeData';

// This is a custom aggregator that
// takes in an array of leaf values and
// returns the rounded median
function roundedMedian(leafValues: any) {
  let min = leafValues[0] || 0;
  let max = leafValues[0] || 0;

  leafValues.forEach((value: number) => {
    min = Math.min(min, value);
    max = Math.max(max, value);
  });

  return Math.round((min + max) / 2);
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName',
            // Use a two-stage aggregator here to first
            // count the total rows being aggregated,
            // then sum any of those counts if they are
            // aggregated further
            aggregate: 'count',
            Aggregated: ({ value }: any) => `${value} Names`,
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
            // Use another two-stage aggregator here to
            // first count the UNIQUE values from the rows
            // being aggregated, then sum those counts if
            // they are aggregated further
            aggregate: 'uniqueCount',
            Aggregated: ({ value }: any) => `${value} Unique Names`,
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age',
            // Aggregate the average age of visitors
            aggregate: 'average',
            Aggregated: ({ value }: any) =>
              `${Math.round(value * 100) / 100} (avg)`,
          },
          {
            Header: 'Visits',
            accessor: 'visits',
            // Aggregate the sum of all visits
            aggregate: 'sum',
            Aggregated: ({ value }: any) => `${value} (total)`,
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress',
            // Use our custom roundedMedian aggregator
            aggregate: roundedMedian,
            Aggregated: ({ value }: any) => `${value} (med)`,
          },
        ],
      },
    ],
    []
  );

  const fetchAsync = async () => {
    const totalRows = 1000;
    return {
      status: 200,
      data: {
        rows: makeData(totalRows),
        totalRows: totalRows,
        lastUpdated: new Date(),
      },
    };
  };

  const table = useTable({
    columns,
    accessKey: 'props.accessKey',
    fetchAsync: fetchAsync,
    params: {},
    serverSide: false,
  });

  return (
    <div className='App'>
      <h1>React-Table</h1>

      <Table {...table} />
    </div>
  );
}

export default App;
