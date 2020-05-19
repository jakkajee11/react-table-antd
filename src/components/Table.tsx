import React, { useEffect, useState } from 'react';
import { Column, TableState, UseTableOptions, Cell } from 'react-table';
import styled, { css } from 'styled-components';
// @ts-ignore
import ReactExport from 'react-data-export';
import { Pagination, Row, Col, Dropdown, Radio, Menu } from 'antd';
import { Spinner } from './Spinner';
import { HeaderGroupCell as HeaderGroup } from './common';
import AppIcon from './AppIcon';

import {
  faCaretRight,
  faCaretDown,
  faCog,
  faRedoAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Row as RowProps } from 'react-table';
//import DropdownSelect, { SelectItemOption } from '../DropdownSelect';
//import { createOption, GridHandler } from '../utils';
import { DateTime } from '../utils/format';
//import { useStores } from '../../../hooks/useStore';
import useTimeMode from '../hooks/useTimeMode';
import { TimeMode } from '../types/timeMode';
import {
  StandardTableExtraProps,
  UseStandardTableInstanceProps,
} from '../types/tables';

// const ExcelDataExport = React.lazy(() =>
//   import('../../../utils/ExcelDataExport')
// );

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const pageSizeOptions = ['20', '50', '100'];
// const specialColumns = ['Created Date', 'Updated Date'];

const getItemStyle = (
  { isDragging, isDropAnimating }: any,
  draggableStyle: any
) => ({
  ...draggableStyle,
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  ...(!isDragging && { transform: 'translate(0,0)' }),
  ...(isDropAnimating && { transitionDuration: '0.001s' }),

  // styles we need to apply on draggables
});

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: any) {
  return (
    <span>
      {/* Search:{' '} */}
      <input
        value={globalFilter || ''}
        onChange={(e) => {
          //console.log(['onchange', e]);
          setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`Search...`}
        style={{
          fontSize: '1.1rem',
          border: '0',
        }}
      />
    </span>
  );
}

const Styles = styled.div<{ bordered?: boolean; height?: string }>`
  /* margin-bottom: 10px; */
  max-width: 100%;

  table {
    width: 100%;
    text-align: left;
    border-radius: 2px 2px 0 0;
    border-collapse: separate;
    border-spacing: 0;

    thead > tr:not(:last-child) > th[colspan] {
      border-bottom: 0;
    }

    thead > tr:first-child th:first-child {
      border-top-left-radius: 2px;
    }

    tfoot > tr > th,
    thead > tr > th {
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      text-align: left;
      background: #fafafa;
      border-bottom: 1px solid #f0f0f0;
      transition: background 0.3s ease;
    }

    thead > tr > th,
    tbody > tr > td,
    tfoot > tr > th {
      position: relative;
      padding: 5px;
      overflow-wrap: break-word;
    }

    tbody > tr > td {
      border-bottom: 1px solid #f0f0f0;
      -webkit-transition: background 0.3s;
      transition: background 0.3s;
    }

    tr:nth-child(even) {
      background: #fafafa;
    }
    tr:hover {
      background: #fafaaf;
    }

    .header-action-container {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      margin: 5px;
      padding: 5px;
    }

    .header-action-headerbar-th-container {
      padding-bottom: 25px;
      position: inherit;
    }

    .header-action-headerbar-container {
      position: absolute;
      min-width: 100% !important;
    }

    .column-row-container {
      position: sticky;
      top: 0;
      z-index: 2;
    }

    .subcomponnet-tr-container {
      display: flex;
    }
    .subcomponnet-td-container {
      display: contents;
    }
  }

  .scrollable-table {
    overflow: auto;
    max-height: '65vh';
    ${(props) =>
      props.height &&
      css`
        height: ${props.height};
      `}
  }
`;

const LastUpdateContainer = styled.div`
  text-align: right;
  margin-right: 5;
  padding: 5;
`;

export const Table: React.FC<
  UseStandardTableInstanceProps & StandardTableExtraProps
> = ({
  instance,
  totalRows,
  loading,
  serverSide,
  showSearchBar = true,
  showArchived = false,
  showColumToggler = true,
  showTimeMode = false,
  showRightAction = true,
  showAction = true,
  showPagination = true,
  showQuickJumper = true,
  showSizeChanger = true,
  showFooter,
  reportType,
  exportFilter,
  exportable = true,
  accessKey,
  timeMode,
  lastUpdated = DateTime.timeFromNow(),
  fetchData,
  renderRowSubComponent,
  renderHeaderAction,
  onColumnOrderChange,
  height,
  setTimeMode,
}) => {
  const refresh = () => {
    if (serverSide)
      fetchData({ pageIndex, pageSize, words: globalFilter, filters, sortBy });
    else fetchData({});
  };

  const {
    getTableBodyProps,
    getTableProps,
    allColumns,
    visibleColumns,
    headerGroups,
    footerGroups,
    rows,
    data,
    state: {
      pageIndex,
      pageSize,
      sortBy,
      globalFilter,
      groupBy,
      expanded,
      filters,
      selectedRowIds,
    },
    initialState,
    page,
    pageOptions,
    preGlobalFilteredRows,
    gotoPage,
    setPageSize,
    setColumnOrder,
    setGlobalFilter,
    setHiddenColumns,
    toggleHideColumn,
    prepareRow,
    setRowState,
  } = instance;

  // const store = useStores();
  const [showColumnToggleMenu, setShowColumnToggleMenu] = useState(false);
  const [realtimeUpdate, setRealtimeUpdate] = useState(false);
  //const { timeMode, setTimeMode } = useTimeMode();

  // function ColumnToggler({
  //   allColumns,
  //   visibleColumns,
  //   setHiddenColumns,
  //   setShowColumnToggleMenu,
  // }: any) {
  //   const setColumnVisibility = (
  //     columns: SelectItemOption[],
  //     showMenu: boolean = true,
  //     realtimeUpdate: boolean = false
  //   ) => {
  //     //setHiddenColumns(columns);
  //     columns.forEach((c: SelectItemOption) => {
  //       toggleHideColumn(c.value.toString(), c.isSelected);
  //     });
  //     setShowColumnToggleMenu(showMenu);
  //     setRealtimeUpdate(realtimeUpdate);
  //   };
  //   return (
  //     <DropdownSelect
  //       options={createOption(allColumns, 'id', 'Header').map((c: any) => ({
  //         ...c,
  //         isSelected: visibleColumns.map((v: Column) => v.id).includes(c.value),
  //       }))}
  //       showArchived={showArchived}
  //       showMenu={showColumnToggleMenu}
  //       realtimeUpdate={realtimeUpdate}
  //       onChange={setColumnVisibility}
  //       store={store}
  //     />
  //   );
  // }

  useEffect(() => {
    if (!serverSide) fetchData({});
  }, [serverSide, fetchData]);

  // useEffect(() => {
  //   setTimeMode(GridHandler.userTimeMode(accessKey, store, 'utc') as TimeMode);
  // }, [accessKey]);

  useEffect(() => {
    if (serverSide)
      fetchData({
        page: pageIndex + 1,
        size: pageSize,
        sort: sortBy,
        words: globalFilter,
      });
  }, [
    serverSide,
    fetchData,
    pageIndex,
    pageSize,
    globalFilter,
    filters,
    sortBy,
    groupBy,
  ]);

  // const menu = (
  //   <Menu>
  //     <Menu.Item key='export'>
  //       <React.Suspense fallback={<div>Loading...</div>}>
  //         <ExcelDataExport
  //           columns={visibleColumns}
  //           data={data}
  //           serverSide={serverSide}
  //           filter={exportFilter}
  //           reportType={reportType}
  //           timeMode={timeMode}
  //         />
  //       </React.Suspense>
  //     </Menu.Item>
  //   </Menu>
  // );

  return (
    <Spinner spinning={loading}>
      <Styles height={height}>
        <table {...getTableProps}>
          <thead>
            {(showSearchBar || renderHeaderAction) && (
              <tr>
                <th
                  colSpan={visibleColumns.length}
                  style={{
                    textAlign: 'left',
                  }}
                >
                  <div style={{ float: 'left' }}>
                    {/* {showSearchBar && (
                      <span className='header-action-container'>
                        {showColumToggler && (
                          <ColumnToggler
                            allColumns={allColumns}
                            visibleColumns={visibleColumns}
                            setHiddenColumns={setHiddenColumns}
                            setShowColumnToggleMenu={setShowColumnToggleMenu}
                          />
                        )}
                        <GlobalFilter
                          preGlobalFilteredRows={preGlobalFilteredRows}
                          globalFilter={globalFilter}
                          setGlobalFilter={setGlobalFilter}
                        />
                      </span>
                    )} */}
                  </div>
                  <div style={{ float: 'right' }}>
                    {renderHeaderAction && renderHeaderAction()}
                  </div>
                </th>
              </tr>
            )}

            {showAction && (
              <tr>
                <th
                  colSpan={visibleColumns.length}
                  className='header-action-headerbar-th-container'
                >
                  <Row
                    justify='start'
                    align='middle'
                    className='header-action-headerbar-container'
                    gutter={{ xs: 8, sm: 16, md: 24 }}
                  >
                    <Col xs={7} sm={7} md={7} lg={7}>
                      {/* {showTimeMode && (
                        <div style={{ textAlign: 'left' }}>
                          <span style={{ paddingRight: 5 }}>Time :</span>
                          <Radio.Group
                            defaultValue={timeMode}
                            value={timeMode}
                            buttonStyle='solid'
                            size={'small'}
                            onChange={(e: any) => {
                              if (setTimeMode)
                                setTimeMode(e.target.value as TimeMode);
                              //if (setTimeMode) setTimeMode(e.target.value);

                              if (accessKey)
                                store.uiStore.setTimeMode(
                                  accessKey,
                                  e.target.value
                                );
                            }}
                          >
                            <Radio.Button value='utc'>UTC</Radio.Button>
                            <Radio.Button value='local'>Local</Radio.Button>
                          </Radio.Group>
                        </div>
                      )} */}
                    </Col>
                    <Col xs={10} sm={10} md={10} lg={10}></Col>
                    <Col xs={7} sm={7} md={7} lg={7}>
                      {showRightAction && (
                        <LastUpdateContainer>
                          <span className='table-header-left'>
                            Last updated:{' '}
                            <span id='table_header_last_modified'>
                              {DateTime.toTimeFromNow(lastUpdated)}
                            </span>
                          </span>{' '}
                          <AppIcon
                            icon={faRedoAlt}
                            style={{ marginRight: 5 }}
                            onClick={refresh}
                          />
                          {/* {exportable && (
                            <Dropdown overlay={menu}>
                              <span>
                                <AppIcon icon={faCog} />
                              </span>
                            </Dropdown>
                          )} */}
                        </LastUpdateContainer>
                      )}
                    </Col>
                  </Row>
                </th>
              </tr>
            )}
          </thead>
        </table>
        <div className='scrollable-table'>
          <table {...getTableProps()}>
            {/* <div className='column-row-container'> */}
            <thead className='column-row-container'>
              {headerGroups.map((headerGroup: any, index: number) => (
                <HeaderGroup
                  key={index}
                  headerGroup={headerGroup}
                  visibleColumns={visibleColumns}
                  setColumnOrder={setColumnOrder}
                  onColumnOrderChange={onColumnOrderChange}
                />
              ))}
            </thead>
            {/* </div> */}
            <tbody {...getTableBodyProps}>
              {page.map((row: RowProps) => {
                prepareRow(row);
                return (
                  <React.Fragment key={`${row.id}-${row.index}`}>
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell: Cell) => {
                        return (
                          <td
                            {...cell.getCellProps([
                              { style: cell.column.style },
                            ])}
                          >
                            {cell.isGrouped ? (
                              // If it's a grouped cell, add an expander and row count
                              <>
                                <span {...row.getToggleRowExpandedProps()}>
                                  {row.isExpanded ? (
                                    <AppIcon icon={faCaretDown} size='lg' />
                                  ) : (
                                    <AppIcon icon={faCaretRight} size='lg' />
                                  )}
                                </span>{' '}
                                {cell.render('Cell')}
                              </>
                            ) : cell.isAggregated ? (
                              // If the cell is aggregated, use the Aggregated
                              // renderer for cell
                              cell.render('Aggregated')
                            ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                              // Otherwise, just render the regular cell
                              cell.render('Cell')
                            )}
                          </td>
                        );
                      })}
                    </tr>
                    {row.isExpanded && renderRowSubComponent ? (
                      <tr className='subcomponnet-tr-container'>
                        <td
                          colSpan={visibleColumns.length}
                          className='subcomponnet-td-container'
                        >
                          {/*                         
                        Inside it, call our renderRowSubComponent function. In reality,
                        you could pass whatever you want as props to
                        a component like this, including the entire
                        table instance. But for this example, we'll just
                        pass the row
                      */}
                          <div style={{ width: '80%' }}>
                            {renderRowSubComponent({ row })}
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </tbody>
            {showFooter && (
              <tfoot>
                {footerGroups.map((footerGroup: any) => (
                  <tr {...footerGroup.getFooterGroupProps()}>
                    {footerGroup.headers.map((column: any) => (
                      <th
                        // Maybe bug of react-table getFooterProps does not work
                        {...column.getHeaderProps([
                          { style: column.footerStyle },
                        ])}
                      >
                        {column.render('Footer')}
                      </th>
                    ))}
                  </tr>
                ))}
              </tfoot>
            )}
          </table>
        </div>
      </Styles>
      {showPagination && (
        <Pagination
          current={pageIndex + 1}
          pageSize={pageSize}
          total={!serverSide ? rows.length : totalRows}
          onChange={(page) => {
            //console.log(page);
            gotoPage(page - 1);
          }}
          onShowSizeChange={(_current, size) => {
            //console.log(size);
            setPageSize(size);
            //save pageSize to localStore
            // if (accessKey) store.uiStore.setPageSize(accessKey, size);
          }}
          pageSizeOptions={pageSizeOptions}
          showSizeChanger={showSizeChanger}
          showQuickJumper={showQuickJumper}
          responsive={true}
          showTotal={(total, range) => (
            <span>
              {pageIndex * pageSize + 1} - {pageSize * (pageIndex + 1)} /{' '}
              {total}
            </span>
          )}
          style={{ textAlign: 'left' }}
        />
      )}
    </Spinner>
  );
};
