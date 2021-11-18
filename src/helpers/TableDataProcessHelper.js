import moment from 'moment';
import React from 'react';
import Checkbox from '../common/Checkbox/Checkbox';
import { NumberCommaSeparator } from './NumberCommaSeparator';

export const processTableDataByType = ({ header, row, actions }) => {
  const { type } = header;
  const currentData = row[`${header.name}`];
  const { handleDrawerState, handleCheckBoxState, handleViewDocument } = actions;

  switch (type) {
    case 'date':
      return currentData ? moment(currentData).format('DD-MMM-YYYY') : '-';
    case 'modal':
      if (currentData?.value && currentData?.value.toString().trim().length > 0) {
        return (
          <div
            className="link"
            onClick={e => {
              e.stopPropagation();
              handleDrawerState(header, currentData, row);
            }}
          >
            {currentData?.value}
          </div>
        );
      }
      return '-';

    case 'boolean':
      return (
        <div className="table-checkbox">
          <Checkbox
            title={null}
            checked={currentData?.value ?? currentData}
            onChange={e => handleCheckBoxState(e.target.checked, header, currentData, row)}
          />
        </div>
      );
    case 'booleanString':
      return currentData ? 'Yes' : 'No';
    case 'link':
      return (
        currentData && currentData.toString().trim().length > 0 ? <div className="link" onClick={() => handleViewDocument(header, row)}>
          {currentData}
        </div> : '-'
      );

    case 'amount':
      return currentData.toString().trim().length > 0 ? NumberCommaSeparator(currentData) : '-';

    default:
      return currentData && currentData.toString().trim().length > 0 ? currentData : '-';
  }
};
