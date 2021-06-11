import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import Drawer from '../Drawer/Drawer';
import { processTableDataByType } from '../../helpers/TableDataProcessHelper';
import TableApiService from './TableApiService';
import Checkbox from '../Checkbox/Checkbox';
import DropdownMenu from '../DropdownMenu/DropdownMenu';
import { successNotification } from '../Toast';
import ExpandedTableHelper from '../../screens/Overdues/Components/ExpandedTableHelper';

export const TABLE_ROW_ACTIONS = {
  EDIT_ROW: 'EDIT_ROW',
  DELETE_ROW: 'DELETE_ROW',
};

export const DRAWER_ACTIONS = {
  SHOW_DRAWER: 'SHOW_DRAWER',
  HIDE_DRAWER: 'HIDE_DRAWER',
};

const drawerInitialState = {
  visible: false,
  data: [],
};

const drawerReducer = (state, action) => {
  switch (action.type) {
    case DRAWER_ACTIONS.SHOW_DRAWER:
      return {
        visible: true,
        data: action.data,
      };
    case DRAWER_ACTIONS.HIDE_DRAWER:
      return { ...drawerInitialState };

    default:
      return state;
  }
};

const Table = props => {
  const {
    tableClass,
    align,
    valign,
    headers,
    extraColumns,
    tableButtonActions,
    headerClass,
    data,
    rowClass,
    recordSelected,
    isExpandable,
    recordActionClick,
    refreshData,
    haveActions,
    showCheckbox,
    onChangeRowSelection,
  } = props;
  const tableClassName = `table-class ${tableClass}`;
  const [drawerState, dispatchDrawerState] = useReducer(drawerReducer, drawerInitialState);
  const [selectedRowData, setSelectedRowData] = React.useState([]);
  const [expandedRowId, setExpandedRow] = useState(-1);

  const handleDrawerState = useCallback(async (header, currentData, row) => {
    try {
      const response = await TableApiService.tableActions({
        url: header?.request?.url ?? header?.request[currentData?.type],
        method: header?.request?.method,
        id: currentData.id ?? currentData._id ?? row._id,
      });

      dispatchDrawerState({
        type: DRAWER_ACTIONS.SHOW_DRAWER,
        data: response?.data?.data,
      });
    } catch (e) {
      /**/
    }
  }, []);

  const handleCheckBoxState = useCallback(
    async (value, header, currentData, row) => {
      try {
        const response = await TableApiService.tableActions({
          url: header.request.url,
          method: header.request.method,
          id: currentData.id ?? row._id,
          data: {
            [`${header.name}`]: value,
          },
        });
        if (response.data.status === 'SUCCESS') {
          successNotification(response?.data?.message ?? 'Success');
          refreshData();
        }
      } catch (e) {
        /**/
      }
    },
    [refreshData]
  );

  const handleViewDocument = useCallback(async (header, row) => {
    try {
      const response = await TableApiService.viewDocument({
        url: header.request.url,
        method: header.request.method,
        id: row._id,
      });
      if (response.data.status === 'SUCCESS') {
        const url = response.data.data;
        window.open(url);
      }
    } catch (e) {
      /**/
    }
  }, []);

  const closeDrawer = useCallback(() => {
    dispatchDrawerState({
      type: DRAWER_ACTIONS.HIDE_DRAWER,
    });
  }, []);

  const tableData = useMemo(() => {
    const actions = {
      handleDrawerState,
      handleCheckBoxState,
      handleViewDocument,
    };

    return data.map((e, index) => {
      const finalObj = {
        id: e._id ?? index,
      };
      headers.forEach(f => {
        finalObj[`${f.name}`] = processTableDataByType({ header: f, row: e, actions });
      });

      finalObj.dataToExpand = isExpandable ? e?.debtors : undefined;
      return finalObj;
    });
  }, [data, handleDrawerState, isExpandable, handleCheckBoxState, handleViewDocument]);

  const onRowSelectedDataChange = useCallback(
    current => {
      setSelectedRowData(prev => {
        const finalData = [...prev];
        const find = finalData.findIndex(e => e.id === current.id);

        if (find > -1) {
          finalData.splice(find, 1);
        } else {
          finalData.push(current);
        }

        return finalData;
      });
    },
    [setSelectedRowData, selectedRowData]
  );

  const onSelectAllRow = useCallback(() => {
    if (tableData.length !== 0) {
      if (selectedRowData.length === tableData.length) {
        setSelectedRowData([]);
      } else {
        setSelectedRowData(tableData);
      }
    }
  }, [setSelectedRowData, selectedRowData, tableData]);

  const handleRowExpansion = useCallback(
    id => {
      if (expandedRowId === id) {
        setExpandedRow(-1);
      } else {
        setExpandedRow(id);
      }

      recordSelected(id);
    },
    [expandedRowId]
  );

  useEffect(() => {
    onChangeRowSelection(selectedRowData);
  }, [selectedRowData, onChangeRowSelection]);

  return (
    <>
      <TableLinkDrawer drawerState={drawerState} closeDrawer={closeDrawer} />
      <table className={tableClassName}>
        <thead>
          <tr>
            {showCheckbox && (
              <th width={10} align={align} valign={valign}>
                <Checkbox
                  className="crm-checkbox-list"
                  checked={tableData.length !== 0 && selectedRowData.length === tableData.length}
                  onChange={onSelectAllRow}
                />
              </th>
            )}
            {isExpandable && <th align="center" />}
            {headers.length > 0 &&
              headers.map(heading => (
                <th
                  key={heading.label}
                  align={
                    data?.isCompleted?.props?.className === 'table-checkbox' ? 'center' : align
                  }
                  valign={valign}
                  className={`${headerClass} ${
                    heading.type === 'boolean' ? 'table-checkbox-header' : ''
                  }  `}
                >
                  {heading.label}
                </th>
              ))}
            {(haveActions || extraColumns.length > 0) && (
              <th style={{ position: 'sticky', right: 0 }} />
            )}
            {tableButtonActions.length > 0 && <th align={align}>Credit Limit Actions</th>}
          </tr>
        </thead>
        <tbody className="main-table">
          {tableData.map((e, index) => (
            <Row
              key={index.toString()}
              data={e}
              dataIndex={index}
              align={align}
              valign={valign}
              extraColumns={extraColumns}
              tableButtonActions={tableButtonActions}
              rowClass={rowClass}
              recordSelected={recordSelected}
              recordActionClick={recordActionClick}
              haveActions={haveActions}
              isExpandable={isExpandable}
              isRowExpanded={expandedRowId === e?.id}
              handleRowExpansion={handleRowExpansion}
              showCheckbox={showCheckbox}
              isSelected={selectedRowData.some(f => f.id === e.id)}
              onRowSelectedDataChange={onRowSelectedDataChange}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};

Table.propTypes = {
  tableClass: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  valign: PropTypes.oneOf(['top', 'center', 'bottom']),
  headers: PropTypes.array,
  extraColumns: PropTypes.arrayOf(PropTypes.element),
  tableButtonActions: PropTypes.arrayOf(PropTypes.element),
  headerClass: PropTypes.string,
  data: PropTypes.array,
  rowClass: PropTypes.string,
  recordSelected: PropTypes.func,
  isExpandable: PropTypes.bool,
  recordActionClick: PropTypes.func,
  refreshData: PropTypes.func,
  haveActions: PropTypes.bool,
  showCheckbox: PropTypes.bool,
  onChangeRowSelection: PropTypes.func,
};

Table.defaultProps = {
  tableClass: '',
  align: 'left',
  valign: 'center',
  headers: [],
  headerClass: '',
  data: [],
  extraColumns: [],
  tableButtonActions: [],
  rowClass: '',
  haveActions: false,
  isExpandable: false,
  showCheckbox: false,
  recordSelected: () => {},
  recordActionClick: () => {},
  refreshData: () => {},
  onChangeRowSelection: () => {},
};

export default Table;

function Row(props) {
  const {
    align,
    valign,
    data,
    dataIndex,
    rowClass,
    recordSelected,
    isExpandable,
    handleRowExpansion,
    isRowExpanded,
    haveActions,
    extraColumns,
    tableButtonActions,
    recordActionClick,
    showCheckbox,
    isSelected,
    onRowSelectedDataChange,
  } = props;

  const [showActionMenu, setShowActionMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const onClickActionToggleButton = useCallback(
    e => {
      e.persist();
      e.stopPropagation();
      const menuTop = e.clientY + 10;
      const menuLeft = e.clientX - 90;
      setShowActionMenu(prev => !prev);
      setMenuPosition({ top: menuTop, left: menuLeft });
      //    const remainingBottomDistance = window.outerHeight - e.screenY;
      //    const remainingRightDistance = window.outerWidth - e.screenX;
    },
    [setShowActionMenu, setMenuPosition]
  );
  const onClickAction = useCallback(
    (e, type) => {
      e.stopPropagation();
      recordActionClick(type, data.id, data);
      setShowActionMenu(false);
    },
    [recordActionClick, data, showActionMenu]
  );

  const onRowSelected = useCallback(() => {
    onRowSelectedDataChange(data);
  }, [onRowSelectedDataChange, data]);

  return (
    <>
      <tr
        onClick={() =>
          isExpandable ? handleRowExpansion(data?.id) : recordSelected(data.id, data)
        }
        className={`
          main-table-row
          ${
            data?.isCompleted?.props?.children?.props?.checked
              ? `completedTask ${rowClass}`
              : rowClass
          } 
          ${dataIndex % 2 === 0 ? 'bg-white' : 'bg-background-color'}
        `}
      >
        {showCheckbox && (
          <td width={10} align={align} valign={valign} className={rowClass}>
            <Checkbox className="crm-checkbox-list" checked={isSelected} onChange={onRowSelected} />
          </td>
        )}
        {isExpandable && (
          <td align="center" className="expandable-arrow">
            <span
              className={`material-icons-round ${isRowExpanded ? 'rotate-expandable-arrow' : ''}`}
            >
              keyboard_arrow_right
            </span>
          </td>
        )}
        {Object.entries(data).map(([key, value], index) => {
          switch (key) {
            case 'id':
              return null;
            case 'priority':
              return (
                <td key={index.toString()} align={align}>
                  <span className={`task-priority-${value}`}>{value ?? '-'}</span>
                </td>
              );
            case 'isCompleted':
              return (
                <td key={index.toString()} align={align}>
                  {value ?? '-'}
                </td>
              );
            case 'dataToExpand':
              return null;
            default:
              return (
                <td key={index.toString()} align={align}>
                  {value?.length > 50 ? (
                    <Tooltip
                      mouseEnterDelay={0.5}
                      overlayClassName="tooltip-top-class"
                      overlay={<span>{value ?? 'No value'}</span>}
                      placement="topLeft"
                    >
                      {value ?? '-'}
                    </Tooltip>
                  ) : (
                    value ?? '-'
                  )}
                </td>
              );
          }
        })}
        {haveActions && (
          <td
            align="right"
            valign={valign}
            className={`fixed-action-menu ${showActionMenu ? 'fixed-action-menu-clicked' : ''}  ${
              dataIndex % 2 === 0 ? 'bg-white' : 'bg-background-color'
            }`}
          >
            <span
              className="material-icons-round cursor-pointer table-action"
              onClick={onClickActionToggleButton}
            >
              more_vert
            </span>
          </td>
        )}
        {extraColumns.map((element, index) => (
          <td
            key={index.toString()}
            width={10}
            align={align}
            valign={valign}
            className={`${
              data?.isCompleted?.props?.children?.props?.checked
                ? `completedTask ${rowClass}`
                : rowClass
            } 
            fixed-action-menu`}
          >
            {element(data)}
          </td>
        ))}
        {tableButtonActions?.map((element, index) => (
          <td key={index.toString()} width={10} align={align} valign={valign} className={rowClass}>
            {element(data)}
          </td>
        ))}
      </tr>
      <ExpandedTableHelper docs={data?.dataToExpand} isRowExpanded={isRowExpanded} />
      {showActionMenu && (
        <DropdownMenu style={menuPosition} toggleMenu={setShowActionMenu}>
          <div className="menu-name" onClick={e => onClickAction(e, TABLE_ROW_ACTIONS.EDIT_ROW)}>
            <span className="material-icons-round">edit</span> Edit
          </div>
          <div className="menu-name" onClick={e => onClickAction(e, TABLE_ROW_ACTIONS.DELETE_ROW)}>
            <span className="material-icons-round">delete_outline</span> Delete
          </div>
        </DropdownMenu>
      )}
    </>
  );
}

Row.propTypes = {
  align: PropTypes.oneOf(['left', 'center', 'right']),
  valign: PropTypes.oneOf(['top', 'center', 'bottom']),
  data: PropTypes.object,
  extraColumns: PropTypes.arrayOf(PropTypes.func),
  tableButtonActions: PropTypes.arrayOf(PropTypes.func),
  rowClass: PropTypes.string,
  dataIndex: PropTypes.number.isRequired,
  recordSelected: PropTypes.func,
  isExpandable: PropTypes.bool,
  isRowExpanded: PropTypes.bool.isRequired,
  handleRowExpansion: PropTypes.func.isRequired,
  haveActions: PropTypes.bool,
  isSelected: PropTypes.bool,
  recordActionClick: PropTypes.func,
  onRowSelectedDataChange: PropTypes.func,
  showCheckbox: PropTypes.bool,
};

Row.defaultProps = {
  align: 'left',
  valign: 'left',
  data: {},
  extraColumns: [],
  tableButtonActions: [],
  rowClass: '',
  recordSelected: () => {},
  haveActions: false,
  showCheckbox: false,
  isExpandable: false,
  isSelected: false,
  recordActionClick: () => {},
  onRowSelectedDataChange: () => {},
};

function TableLinkDrawer(props) {
  const { drawerState, closeDrawer } = props;
  const checkValue = row => {
    switch (row.type) {
      case 'dollar':
        return row?.value ? `$ ${row?.value}` : '-';
      case 'percent':
        return row?.value ? `${row?.value} %` : '-';
      case 'date':
        return row?.value ? moment(row?.value)?.format('DD-MMM-YYYY') : '-';
      default:
        return row?.value ?? '-';
    }
  };

  return (
    <Drawer header="Contact Details" drawerState={drawerState?.visible} closeDrawer={closeDrawer}>
      <div className="contacts-grid">
        {drawerState?.data?.map(row => (
          <>
            <div className="title">{row?.label}</div>
            <div>{checkValue(row)}</div>
          </>
        ))}
      </div>
    </Drawer>
  );
}

TableLinkDrawer.propTypes = {
  drawerState: PropTypes.shape({
    visible: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
  }).isRequired,
  closeDrawer: PropTypes.func.isRequired,
};

TableLinkDrawer.defaultProps = {};
