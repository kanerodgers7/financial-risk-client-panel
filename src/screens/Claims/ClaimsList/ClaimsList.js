import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import {
  changeClaimsColumnList,
  getClaimsColumnsList,
  getClaimsDefaultColumnsList,
  getClaimsListByFilter,
  saveClaimsColumnsList,
} from '../redux/ClaimsAction';
import Loader from '../../../common/Loader/Loader';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import { errorNotification } from '../../../common/Toast';
import { CLAIMS_REDUX_CONSTANTS } from '../redux/ClaimsReduxConstants';

const ClaimsList = () => {
  const dispatch = useDispatch();
  const [customFieldModal, setCustomFieldModal] = useState(false);
  const claimsList = useSelector(({ claims }) => claims?.claimsList ?? {});
  const claimsColumnList = useSelector(({ claims }) => claims?.claimsColumnList ?? {});
  const claimsDefaultColumnList = useSelector(
    ({ claims }) => claims?.claimsDefaultColumnList ?? {}
  );
  const { claimsListColumnSaveButtonLoaderAction, claimsListColumnResetButtonLoaderAction } =
    useSelector(({ loaderButtonReducer }) => loaderButtonReducer ?? false);
  const { total, pages, page, limit, docs, headers, isLoading } = useMemo(
    () => claimsList,
    [claimsList]
  );

  const { defaultFields, customFields } = useMemo(
    () =>
      claimsColumnList || {
        defaultFields: [],
        customFields: [],
      },
    [claimsColumnList]
  );

  const { page: paramPage, limit: paramLimit } = useQueryParams();

  const getClaimsByFilter = useCallback(
    (initialParams = { page: 1, limit: 15 }) => {
      const params = {
        page: page ?? 1,
        limit: limit ?? 15,
        ...initialParams,
      };
      dispatch(getClaimsListByFilter(params));
    },
    [page, limit]
  );

  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveClaimsColumnsList({ isReset: true }));
    dispatch(getClaimsColumnsList());
    getClaimsByFilter();
    toggleCustomField();
  }, [toggleCustomField, getClaimsByFilter]);

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: CLAIMS_REDUX_CONSTANTS.GET_CLAIMS_COLUMNS_LIST,
      data: claimsDefaultColumnList,
    });
    toggleCustomField();
  }, [toggleCustomField, claimsDefaultColumnList]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(claimsColumnList, claimsDefaultColumnList);
      if (!isBothEqual) {
        await dispatch(saveClaimsColumnsList({ claimsColumnList }));
        getClaimsByFilter();
      } else {
        errorNotification('Please select different columns to apply changes.');
        throw Error();
      }
      toggleCustomField();
    } catch (e) {
      /**/
    }
  }, [toggleCustomField, getClaimsByFilter, claimsColumnList, claimsDefaultColumnList]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: claimsListColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: claimsListColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      claimsListColumnSaveButtonLoaderAction,
      claimsListColumnResetButtonLoaderAction,
    ]
  );

  const onChangeSelectedColumn = useCallback((type, name, value) => {
    const data = { type, name, value };
    dispatch(changeClaimsColumnList(data));
  }, []);

  useEffect(() => {
    const data = { page: paramPage ?? page ?? 1, limit: paramLimit ?? limit ?? 15 };
    getClaimsByFilter(data);
    dispatch(getClaimsColumnsList());
    dispatch(getClaimsDefaultColumnsList());
  }, []);

  return (
    <>
      <div className="page-header">
        <div className="page-header-name">Claims List</div>
        <div className="page-header-button-container">
          <IconButton
            buttonType="secondary"
            title="filter_list"
            className="mr-10"
            buttonTitle="Click to apply filters on claim list"
          />
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            className="mr-10"
            buttonTitle="Click to select custom fields"
            onClick={() => toggleCustomField()}
          />
          <Button title="Add" buttonType="success" />
        </div>
      </div>

      {!isLoading && docs ? (
        (() =>
          docs?.length > 0 ? (
            <>
              <div className="common-list-container">
                <Table
                  align="left"
                  valign="center"
                  data={docs}
                  headers={headers}
                  tableClass="main-list-table"
                  rowClass="cursor-pointer"
                />
              </div>
              <Pagination className="common-list-pagination" total={total} pages={pages} />
            </>
          ) : (
            <div className="no-record-found">No record found</div>
          ))()
      ) : (
        <Loader />
      )}

      {customFieldModal && (
        <CustomFieldModal
          defaultFields={defaultFields}
          customFields={customFields}
          buttons={customFieldsModalButtons}
          onChangeSelectedColumn={onChangeSelectedColumn}
          toggleCustomField={toggleCustomField}
        />
      )}
    </>
  );
};

export default ClaimsList;
