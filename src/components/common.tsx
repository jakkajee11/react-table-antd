import React from 'react';
import {
  HeaderGroup,
  Column,
  FilterProps,
  CellProps,
  ColumnInstance,
} from 'react-table';
import {
  Droppable,
  Draggable,
  DragDropContext,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import {
  faSort,
  faSortUp,
  faSortDown,
} from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from 'styled-components';

import AppIcon from './AppIcon';
import { DateTime } from '../utils/format';
import { Dayjs } from 'dayjs';

interface HeaderGroupProps<D extends object = {}> {
  headerGroup: HeaderGroup<D>;
  visibleColumns: Column<D>[];
  onColumnOrderChange?: (columns: string[]) => void;
  setColumnOrder: (
    updater: string[] | ((columnOrder: string[]) => string[])
  ) => void;
}

interface ColumnProps<D extends object = {}> {
  column: ColumnInstance<D>;
  provided?: DraggableProvided;
  snapshot?: DraggableStateSnapshot;
  placeholder?: React.ReactElement<HTMLElement> | null;
}

const getItemStyle = (
  { isDragging, isDropAnimating }: any,
  draggableStyle: any
) => ({
  ...draggableStyle,
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // change background colour if dragging
  // background: isDragging ? 'lightsteelblue' : '',

  ...(!isDragging && { transform: 'translate(0,0)' }),
  ...(isDropAnimating && { transitionDuration: '0.001s' }),

  // styles we need to apply on draggables
});

// const createColumnTitle = <D extends object>(column: ColumnInstance<D>) => {
//   let title = 'Drag for ordering';
//   if (column.canSort) title += ' or toggle for sorting';
//   title += ' this column';
//   return title;
// };

const ColumnCell = <D extends object>({
  column,
  provided,
  snapshot,
  placeholder,
}: ColumnProps<D>) => {
  //const { primary } = React.useContext(ThemeContext);
  const primary = '';
  return (
    <th {...column.getHeaderProps()}>
      <span
        {...column.getSortByToggleProps()}
        {...(provided && {
          ...provided.draggableProps,
          ...provided.dragHandleProps,
          ref: provided.innerRef,
          style: {
            ...getItemStyle(snapshot, provided.draggableProps.style),
          },
        })}
      >
        {column.render('Header')}
        {column.isSorted ? (
          <span>
            {' '}
            {column.isSortedDesc ? (
              <AppIcon icon={faSortDown} color={primary} />
            ) : (
              <AppIcon icon={faSortUp} color={primary} />
            )}
          </span>
        ) : (
          column.canSort && (
            <>
              {' '}
              <AppIcon icon={faSort} color='gray' />
            </>
          )
        )}
        {placeholder}
      </span>
    </th>
  );
};

export const HeaderGroupCell = <D extends object>({
  headerGroup,
  visibleColumns,
  setColumnOrder,
  onColumnOrderChange,
}: HeaderGroupProps<D>) => {
  const currentColOrder = React.useRef<string[]>([]);
  return (
    <DragDropContext
      onDragEnd={() => {}}
      onDragStart={() => {
        currentColOrder.current = visibleColumns.map((o) => o.id ?? '');
      }}
      onDragUpdate={(dragUpdateObj, b) => {
        const colOrder = [...currentColOrder.current];
        const sIndex = dragUpdateObj.source.index;
        const dIndex =
          dragUpdateObj.destination && dragUpdateObj.destination.index;

        if (typeof sIndex === 'number' && typeof dIndex === 'number') {
          colOrder.splice(sIndex, 1);
          colOrder.splice(dIndex, 0, dragUpdateObj.draggableId);
          setColumnOrder(colOrder);
          if (onColumnOrderChange) onColumnOrderChange(colOrder);
        }
      }}
    >
      <Droppable droppableId='droppable-columns' direction='horizontal'>
        {(droppableProvided, _snapshot) => (
          <tr
            {...headerGroup.getHeaderGroupProps()}
            ref={droppableProvided.innerRef}
          >
            {headerGroup.headers.map((column, index) =>
              column.draggable ? (
                <Draggable
                  key={column.id}
                  draggableId={column.id}
                  index={index}
                  isDragDisabled={!column.id}
                >
                  {(provided, snapshot) => (
                    <ColumnCell
                      column={column}
                      provided={provided}
                      snapshot={snapshot}
                      placeholder={droppableProvided.placeholder}
                    />
                  )}
                </Draggable>
              ) : (
                <ColumnCell key={column.id} column={column} />
              )
            )}
          </tr>
        )}
      </Droppable>
    </DragDropContext>
  );
};

// Define a default UI for filtering
export function DefaultColumnFilter<D extends object>({
  column: { filterValue, setFilter },
}: FilterProps<D>) {
  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
    />
  );
}

export const StandardDatetimeCell = <D extends object>({
  value,
}: CellProps<D>): Dayjs | string | number | Date =>
  DateTime.toStrandardDate(value);
