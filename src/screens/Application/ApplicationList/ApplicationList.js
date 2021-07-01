import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactSelect from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Loader from '../../../common/Loader/Loader';
import Pagination from '../../../common/Pagination/Pagination';
import {
  applicationDownloadAction,
  changeApplicationColumnNameList,
  getApplicationColumnNameList,
  getApplicationFilter,
  getApplicationsListByFilter,
  resetApplicationListData,
  resetApplicationListPaginationData,
  saveApplicationColumnNameList,
  updateEditApplicationField,
} from '../redux/ApplicationAction';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import Modal from '../../../common/Modal/Modal';
import Input from '../../../common/Input/Input';
import { errorNotification } from '../../../common/Toast';
import { APPLICATION_COLUMN_LIST_REDUX_CONSTANTS } from '../redux/ApplicationReduxConstants';
import { downloadAll } from '../../../helpers/DownloadHelper';
import { filterReducer, LIST_FILTER_REDUCER_ACTIONS } from '../../../common/ListFilters/filter';
import { useUrlParamsUpdate } from '../../../hooks/useUrlParamsUpdate';

const ApplicationList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const applicationListWithPageData = useSelector(
    ({ application }) => application?.applicationList ?? {}
  );
  const applicationColumnNameList = useSelector(
    ({ application }) => application?.applicationColumnNameList ?? {}
  );
  const applicationDefaultColumnNameList = useSelector(
    ({ application }) => application?.applicationDefaultColumnNameList ?? {}
  );
  const { total, pages, page, limit, docs, headers } = useMemo(
    () => applicationListWithPageData,
    [applicationListWithPageData]
  );
  const { dropdownData } = useSelector(
    ({ application }) => application?.applicationFilterList ?? {}
  );
  const [filter, dispatchFilter] = useReducer(filterReducer, {
    tempFilter: {},
    finalFilter: {},
  });
  const {
    applicationListColumnSaveButtonLoaderAction,
    applicationListColumnResetButtonLoaderAction,
    applicationListPageLoader,
    applicationDownloadButtonLoaderAction,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const { tempFilter, finalFilter } = useMemo(() => filter ?? {}, [filter]);

  const appliedFilters = useMemo(() => {
    return {
      entityType:
        tempFilter?.entityType?.toString()?.trim()?.length > 0 ? tempFilter?.entityType : undefined,
      debtorId:
        tempFilter?.debtorId?.toString()?.trim()?.length > 0 ? tempFilter?.debtorId : undefined,
      status: tempFilter?.status?.toString()?.trim()?.length > 0 ? tempFilter?.status : undefined,
      minCreditLimit:
        tempFilter?.minCreditLimit?.toString()?.trim()?.length > 0
          ? tempFilter?.minCreditLimit
          : undefined,
      maxCreditLimit:
        tempFilter?.maxCreditLimit?.toString()?.trim()?.length > 0
          ? tempFilter?.maxCreditLimit
          : undefined,
      startDate: tempFilter?.startDate || undefined,
      endDate: tempFilter?.endDate || undefined,
    };
  }, [{ ...tempFilter }]);

  const handleStartDateChange = useCallback(date => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'startDate',
      value: new Date(date).toISOString(),
    });
  }, []);

  const handleEndDateChange = useCallback(date => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'endDate',
      value: new Date(date).toISOString(),
    });
  }, []);

  const resetFilterDates = useCallback(() => {
    handleStartDateChange(null);
    handleEndDateChange(null);
  }, [handleStartDateChange, handleEndDateChange]);

  const handleEntityTypeFilterChange = useCallback(event => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'entityType',
      value: event?.value,
    });
  }, []);

  const handleDebtorIdFilterChange = useCallback(event => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'debtorId',
      value: event?.value,
    });
  }, []);
  const handleApplicationStatusFilterChange = useCallback(event => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'status',
      value: event?.value,
    });
  }, []);
  const handleMinLimitChange = useCallback(event => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'minCreditLimit',
      value: event?.target?.value,
    });
  }, []);
  const handleMaxLimitChange = useCallback(
    event => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'maxCreditLimit',
        value: event?.target?.value,
      });
    },
    [dispatchFilter]
  );

  const getApplicationsByFilter = useCallback(
    async (params = {}, cb) => {
      if (moment(tempFilter?.startDate)?.isAfter(tempFilter?.endDate)) {
        errorNotification('From date should be greater than to date');
        resetFilterDates();
      } else if (moment(tempFilter?.endDate)?.isBefore(tempFilter?.startDate)) {
        errorNotification('To Date should be smaller than from date');
        resetFilterDates();
      } else {
        const data = {
          page: page || 1,
          limit: limit || 10,
          ...appliedFilters,
          ...params,
        };
        await dispatch(getApplicationsListByFilter(data));
        dispatchFilter({
          type: LIST_FILTER_REDUCER_ACTIONS.APPLY_DATA,
        });
        if (cb && typeof cb === 'function') {
          cb();
        }
      }
    },
    [page, limit, appliedFilters]
  );

  // on record limit changed
  const onSelectLimit = useCallback(
    newLimit => {
      getApplicationsByFilter({ page: 1, limit: newLimit });
    },
    [getApplicationsByFilter]
  );
  // on pagination changed
  const pageActionClick = useCallback(
    newPage => {
      getApplicationsByFilter({ page: newPage, limit });
    },
    [getApplicationsByFilter, limit]
  );

  const [filterModal, setFilterModal] = React.useState(false);
  const toggleFilterModal = useCallback(
    value => setFilterModal(value !== undefined ? value : e => !e),
    [setFilterModal]
  );
  const onClickApplyFilter = useCallback(() => {
    getApplicationsByFilter({ page: 1 }, toggleFilterModal);
  }, [getApplicationsByFilter]);

  const onClickResetFilter = useCallback(() => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.RESET_STATE,
    });
    onClickApplyFilter();
  }, []);

  const filterModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetFilter,
      },
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: () => {
          dispatchFilter({
            type: LIST_FILTER_REDUCER_ACTIONS.CLOSE_FILTER,
          });
          toggleFilterModal();
        },
      },
      { title: 'Apply', buttonType: 'primary', onClick: onClickApplyFilter },
    ],
    [toggleFilterModal, onClickApplyFilter]
  );
  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );
  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(applicationColumnNameList, applicationDefaultColumnNameList);
      if (!isBothEqual) {
        await dispatch(saveApplicationColumnNameList({ applicationColumnNameList }));
        getApplicationsByFilter();
      } else {
        errorNotification('Please select different columns to apply changes.');
        throw Error();
      }
      toggleCustomField();
    } catch (e) {
      /**/
    }
  }, [
    toggleCustomField,
    applicationColumnNameList,
    getApplicationsByFilter,
    applicationDefaultColumnNameList,
  ]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveApplicationColumnNameList({ isReset: true }));
    dispatch(getApplicationColumnNameList());
    getApplicationsByFilter();
    toggleCustomField();
  }, [toggleCustomField, getApplicationsByFilter]);

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.APPLICATION_COLUMN_LIST_ACTION,
      data: applicationDefaultColumnNameList,
    });
    toggleCustomField();
  }, [toggleCustomField, applicationDefaultColumnNameList]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: applicationListColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: applicationListColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      applicationListColumnResetButtonLoaderAction,
      applicationListColumnSaveButtonLoaderAction,
    ]
  );

  const { defaultFields, customFields } = useMemo(
    () => applicationColumnNameList ?? { defaultFields: [], customFields: [] },
    [applicationColumnNameList]
  );

  const onChangeSelectedColumn = useCallback((type, name, value) => {
    const data = { type, name, value };
    dispatch(changeApplicationColumnNameList(data));
  }, []);

  const {
    page: paramPage,
    limit: paramLimit,
    entityType: paramEntityType,
    debtorId: paramDebtorId,
    status: paramStatus,
    minCreditLimit: paramMinCreditLimit,
    maxCreditLimit: paramMaxCreditLimit,
    startDate: paramStartDate,
    endDate: paramEndDate,
  } = useQueryParams();

  useEffect(() => {
    const params = {
      page: paramPage ?? page ?? 1,
      limit: paramLimit ?? limit ?? 15,
    };
    const filters = {
      entityType: (paramEntityType?.trim()?.length ?? -1) > 0 ? paramEntityType : undefined,
      debtorId: (paramDebtorId?.trim()?.length ?? -1) > 0 ? paramDebtorId : undefined,
      status: (paramStatus?.trim()?.length ?? -1) > 0 ? paramStatus : undefined,
      minCreditLimit:
        (paramMinCreditLimit?.trim()?.length ?? -1) > 0 ? paramMinCreditLimit : undefined,
      maxCreditLimit:
        (paramMaxCreditLimit?.trim()?.length ?? -1) > 0 ? paramMaxCreditLimit : undefined,
      startDate: paramStartDate || undefined,
      endDate: paramEndDate || undefined,
    };
    Object.entries(filters).forEach(([name, value]) => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });
    getApplicationsByFilter({ ...params, ...filters });
    dispatch(getApplicationColumnNameList());
  }, []);

  const generateApplicationClick = useCallback(() => {
    dispatch(
      updateEditApplicationField('company', 'country', {
        label: 'Australia',
        name: 'country',
        value: 'AUS',
      })
    );
    history.push(`/applications/application/generate/`);
  }, []);
  useEffect(() => {
    dispatch(getApplicationFilter());
  }, []);

  // for params in url
  useUrlParamsUpdate(
    {
      page: page ?? 1,
      limit: limit ?? 15,
      entityType:
        finalFilter?.entityType?.toString()?.trim()?.length > 0
          ? finalFilter?.entityType
          : undefined,
      debtorId:
        finalFilter?.debtorId?.toString()?.trim()?.length > 0 ? finalFilter?.debtorId : undefined,
      status: finalFilter?.status?.toString()?.trim()?.length > 0 ? finalFilter?.status : undefined,
      minCreditLimit:
        finalFilter?.minCreditLimit?.toString()?.trim()?.length > 0
          ? finalFilter?.minCreditLimit
          : undefined,
      maxCreditLimit:
        finalFilter?.maxCreditLimit?.toString()?.trim()?.length > 0
          ? finalFilter?.maxCreditLimit
          : undefined,
      startDate: finalFilter?.startDate || undefined,
      endDate: finalFilter?.endDate || undefined,
    },
    [page, limit, { ...finalFilter }]
  );

  const entityTypeSelectedValue = useMemo(() => {
    const foundValue = dropdownData?.entityType?.find(e => {
      return (e?.value ?? '') === tempFilter?.entityType;
    });
    return foundValue ? [foundValue] : [];
  }, [tempFilter?.entityType, dropdownData]);

  const debtorIdSelectedValue = useMemo(() => {
    const foundValue = dropdownData?.debtors?.find(e => {
      return (e?.value ?? '') === tempFilter?.debtorId;
    });
    return foundValue ? [foundValue] : [];
  }, [tempFilter?.debtorId, dropdownData]);

  const applicationStatusSelectedValue = useMemo(() => {
    const foundValue = dropdownData?.applicationStatus?.find(e => {
      return (e?.value ?? '') === tempFilter?.status;
    });
    return foundValue ? [foundValue] : [];
  }, [tempFilter?.status, dropdownData]);

  const viewApplicationOnSelectRecord = useCallback(
    (id, data) => {
      if (data?.status === 'Draft') {
        history.push(`/applications/application/generate/?applicationId=${id}`);
      } else {
        history.push(`/applications/detail/view/${id}`);
      }
    },
    [history]
  );

  const downloadApplication = useCallback(async () => {
    if (docs?.length > 0) {
      try {
        const response = await applicationDownloadAction(appliedFilters);
        if (response) downloadAll(response);
      } catch (e) {
        /**/
      }
    } else {
      errorNotification('No records to download');
    }
  }, [docs?.length, appliedFilters]);

  useEffect(() => {
    return () => {
      dispatch(resetApplicationListPaginationData(page, pages, total, limit));
      dispatch(resetApplicationListData());
    };
  }, []);

  return (
    <>
      {!applicationListPageLoader ? (
        <>
          <div className="page-header">
            <div className="page-header-name">Application List</div>
            <div className="page-header-button-container">
              <IconButton
                buttonType="primary"
                title="cloud_download"
                className="mr-10"
                buttonTitle="Click to download applications"
                onClick={downloadApplication}
                isLoading={applicationDownloadButtonLoaderAction}
              />
              <IconButton
                buttonType="secondary"
                title="filter_list"
                className="mr-10"
                buttonTitle="Click to apply filters on application list"
                onClick={() => toggleFilterModal()}
              />
              <IconButton
                buttonType="primary"
                title="format_line_spacing"
                className="mr-10"
                buttonTitle="Click to select custom fields"
                onClick={() => toggleCustomField()}
              />
              <Button title="Generate" buttonType="success" onClick={generateApplicationClick} />
            </div>
          </div>
          {docs?.length > 0 ? (
            <>
              <div className="common-list-container">
                <Table
                  align="left"
                  valign="center"
                  tableClass="main-list-table"
                  data={docs}
                  headers={headers}
                  recordSelected={viewApplicationOnSelectRecord}
                  rowClass="cursor-pointer"
                />
              </div>
              <Pagination
                className="common-list-pagination"
                total={total}
                pages={pages}
                page={page}
                limit={limit}
                pageActionClick={pageActionClick}
                onSelectLimit={onSelectLimit}
              />
            </>
          ) : (
            <div className="no-record-found">No record found</div>
          )}
          {filterModal && (
            <Modal
              headerIcon="filter_list"
              header="filter"
              buttons={filterModalButtons}
              className="filter-modal application-filter-modal"
            >
              <div className="filter-modal-row">
                <div className="form-title">Entity Type</div>
                <ReactSelect
                  className="filter-select react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select Entity Type"
                  name="role"
                  options={dropdownData?.entityType}
                  value={entityTypeSelectedValue}
                  onChange={handleEntityTypeFilterChange}
                  isSearchble
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title">Debtor Name</div>
                <ReactSelect
                  className="filter-select react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select Debtor"
                  name="role"
                  options={dropdownData?.debtors}
                  value={debtorIdSelectedValue}
                  onChange={handleDebtorIdFilterChange}
                  isSearchble
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title">Application Status</div>
                <ReactSelect
                  className="filter-select react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select Status"
                  name="role"
                  options={dropdownData?.applicationStatus}
                  value={applicationStatusSelectedValue}
                  onChange={handleApplicationStatusFilterChange}
                  isSearchble
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title"> Minimum Credit Limit</div>
                <Input
                  type="text"
                  name="min-limit"
                  value={tempFilter?.minCreditLimit}
                  placeholder="3000"
                  onChange={handleMinLimitChange}
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title">Maximum Credit Limit</div>
                <Input
                  type="text"
                  name="max-limit"
                  value={tempFilter?.maxCreditLimit}
                  placeholder="100000"
                  onChange={handleMaxLimitChange}
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title">Date</div>
                <div className="date-picker-container filter-date-picker-container mr-15">
                  <DatePicker
                    className="filter-date-picker"
                    selected={tempFilter?.startDate ? new Date(tempFilter?.startDate) : null}
                    onChange={handleStartDateChange}
                    placeholderText="From Date"
                    popperProps={{ positionFixed: true }}
                  />
                  <span className="material-icons-round">event_available</span>
                </div>
                <div className="date-picker-container filter-date-picker-container">
                  <DatePicker
                    className="filter-date-picker"
                    selected={tempFilter?.endDate ? new Date(tempFilter?.endDate) : null}
                    onChange={handleEndDateChange}
                    placeholderText="To Date"
                    popperProps={{ positionFixed: true }}
                  />
                  <span className="material-icons-round">event_available</span>
                </div>
              </div>
            </Modal>
          )}
          {customFieldModal && (
            <CustomFieldModal
              defaultFields={defaultFields}
              customFields={customFields}
              onChangeSelectedColumn={onChangeSelectedColumn}
              buttons={customFieldsModalButtons}
              toggleCustomField={toggleCustomField}
            />
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ApplicationList;
