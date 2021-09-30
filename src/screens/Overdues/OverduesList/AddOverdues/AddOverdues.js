import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Prompt, useHistory, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import Input from '../../../../common/Input/Input';
import Modal from '../../../../common/Modal/Modal';
import Button from '../../../../common/Button/Button';
import {
  getEntityDetails,
  getOverdueFilterDropDownDataBySearch,
  getOverdueListByDate,
  handleOverdueFieldChange,
  resetOverdueFormData,
  saveOverdueList,
} from '../../redux/OverduesAction';
import { addOverdueValidations } from './AddOverdueValidations';
import AddOverdueTable from './AddOverdueTable';
import { NumberCommaSeparator } from '../../../../helpers/NumberCommaSeparator';
import Loader from '../../../../common/Loader/Loader';
import { OVERDUE_REDUX_CONSTANTS } from '../../redux/OverduesReduxConstants';
import { DECIMAL_REGEX, usdConverter } from '../../../../constants/RegexConstants';
import Select from '../../../../common/Select/Select';

const AddOverdues = () => {
  const history = useHistory();
  const { period } = useParams();
  const dispatch = useDispatch();
  const [overdueFormModal, setOverdueFormModal] = useState(false);
  const [isAmendOverdueModal, setIsAmendOverdueModal] = useState(false);
  const [showSaveAlertModal, setShowSaveAlertModal] = useState(false);
  const [alertOnLeftModal, setAlertOnLeftModal] = useState(false);
  const [selectedDebtor, setSelectedDebtor] = useState(null);
  const [isPrompt, setIsPrompt] = useState(false);
  const toggleAlertOnLeftModal = useCallback(
    value => setAlertOnLeftModal(value !== undefined ? value : e => !e),
    [setAlertOnLeftModal]
  );

  const { addOverduePageLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  const toggleOverdueFormModal = useCallback(() => {
    setOverdueFormModal(e => !e);
  }, []);

  const { overdueDetails, entityList, overdueListByDate, overdueListByDateCopy } = useSelector(
    ({ overdue }) => overdue ?? {}
  );

  const { docs } = useMemo(() => overdueListByDate ?? [], [overdueListByDate]);

  const callbackOnFormAddORAmend = useCallback(() => {
    toggleOverdueFormModal();
    if (isAmendOverdueModal) setIsAmendOverdueModal(false);
  }, [isAmendOverdueModal, toggleOverdueFormModal]);

  const overdueFormModalButtons = useMemo(
    () => [
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: () => {
          toggleOverdueFormModal();
          setIsAmendOverdueModal(false);
          dispatch(resetOverdueFormData());
        },
      },
      {
        title: isAmendOverdueModal ? 'Amend' : 'Add',
        buttonType: 'primary',
        onClick: async () => {
          await addOverdueValidations(
            dispatch,
            overdueDetails,
            isAmendOverdueModal,
            callbackOnFormAddORAmend,
            docs,
            period
          );
        },
      },
    ],
    [
      overdueDetails,
      toggleOverdueFormModal,
      isAmendOverdueModal,
      callbackOnFormAddORAmend,
      setIsAmendOverdueModal,
      period,
    ]
  );

  const { saveOverdueToBackEndPageLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );
  const selectedDate = useMemo(() => moment(period, 'MMM/YYYY'), [period]);
  const month = useMemo(() => selectedDate.format('M'), [selectedDate]);
  const year = useMemo(() => selectedDate.format('YYYY'), [selectedDate]);
  const getOverdueList = useCallback(async () => {
    const data = { month, year };
    await dispatch(getOverdueListByDate(data));
  }, [month, year]);

  const changeOverdueFields = useCallback((name, value) => {
    dispatch(handleOverdueFieldChange(name, value));
  }, []);

  const handleTextInputChange = useCallback(e => {
    const { name, value } = e?.target;
    changeOverdueFields(name, value);
  }, []);

  const handleDebtorChange = useCallback(
    (e, isAcnChanged = false) => {
      console.log('here');
      changeOverdueFields('debtorId', e);

      setSelectedDebtor(e);

      if (!isAcnChanged) {
        handleTextInputChange(
          {
            target: {
              name: 'acn',
              value: entityList?.debtorId?.find(debtor => debtor?.value === e.value)?.acn,
            },
          },
          true
        );
      }
    },
    [handleTextInputChange, changeOverdueFields, entityList, selectedDebtor]
  );
  const onBlurACN = useCallback(
    e => {
      const selectedRecordAcn = entityList?.debtorId?.find(
        record => record?.value === selectedDebtor?.value
      )?.acn;

      const existingDebtor = entityList?.debtorId?.find(debtor => debtor.acn === e?.target.value);

      if (existingDebtor) {
        handleDebtorChange(existingDebtor, true);
      } else if (selectedRecordAcn && !existingDebtor) {
        handleDebtorChange([], true);
      }
    },
    [entityList, handleDebtorChange, selectedDebtor]
  );

  const handleOnSelectSearchInputChange = useCallback((searchEntity, text) => {
    const options = {
      searchString: text,
      entityType: searchEntity,
      requestFrom: 'overdue',
      isForRisk: false,
    };
    dispatch(getOverdueFilterDropDownDataBySearch(options));
  }, []);

  const addModalInputs = useMemo(
    () => [
      {
        title: 'Debtor Name*',
        name: 'debtorId',
        type: 'select',
        placeholder: 'Select Debtor',
        data: entityList?.debtorId,
        value: overdueDetails?.debtorId ?? [],
        isOr: true,
        onInputChange: text => handleOnSelectSearchInputChange('debtors', text),
      },
      {
        title: 'Month/ Year',
        name: 'monthString',
        type: 'date',
        placeholder: 'Select Month/Year',
        data: '',
        value: moment(period, 'MMMM-YYYY').format('MMMM-YYYY'),
      },
      {
        title: 'ACN*',
        name: 'acn',
        type: 'text',
        placeholder: 'Enter ACN ',
        value: overdueDetails?.acn ?? '',
        onBlur: onBlurACN,
      },
      {},
      {
        title: 'Date of Invoice*',
        name: 'dateOfInvoice',
        type: 'date',
        placeholder: 'Select Date Of Invoice',
        value: (overdueDetails?.dateOfInvoice && new Date(overdueDetails?.dateOfInvoice)) || null,
      },
      {},
      {
        title: 'Overdue Type*',
        name: 'overdueType',
        type: 'select',
        placeholder: 'Select Overdue Type',
        data: entityList?.overdueType,
        value: overdueDetails?.overdueType ?? [],
      },
      {},
      {
        title: 'Insurer Name*',
        name: 'insurerId',
        type: 'select',
        placeholder: 'Select Insurer',
        data: entityList?.insurerId,
        value: overdueDetails?.insurerId ?? [],
      },
      {},
      {
        title: 'Amount',
        type: 'main-title',
      },
      {},
      {
        title: 'Current',
        name: 'currentAmount',
        type: 'amount',
        value: overdueDetails?.currentAmount ?? '',
      },
      {
        title: 'Client Comment',
        name: 'clientComment',
        type: 'textarea',
        value: overdueDetails?.clientComment ?? '',
      },
      {
        title: '30 days',
        name: 'thirtyDaysAmount',
        type: 'amount',
        value: overdueDetails?.thirtyDaysAmount ?? '',
      },

      {
        title: '60 days',
        name: 'sixtyDaysAmount',
        type: 'amount',
        value: overdueDetails?.sixtyDaysAmount ?? '',
      },

      {
        title: '90 days',
        name: 'ninetyDaysAmount',
        type: 'amount',
        value: overdueDetails?.ninetyDaysAmount ?? '',
      },

      {
        title: '90+ days',
        name: 'ninetyPlusDaysAmount',
        type: 'amount',
        value: overdueDetails?.ninetyPlusDaysAmount ?? '',
      },

      {
        title: 'Outstanding Amounts*',
        name: 'outstandingAmount',
        type: 'total-amount',
        value: overdueDetails?.outstandingAmount ?? '',
      },
    ],
    [overdueDetails, entityList, period, handleOnSelectSearchInputChange]
  );

  const toggleSaveAlertModal = useCallback(
    value => {
      setShowSaveAlertModal(value !== undefined ? value : e => !e);
      if (isPrompt && alertOnLeftModal) toggleAlertOnLeftModal();
    },
    [setShowSaveAlertModal, isPrompt, alertOnLeftModal, toggleAlertOnLeftModal]
  );

  const handleAmountInputChange = useCallback(
    e => {
      const { name, value } = e?.target;
      const updatedVal = value?.toString()?.replaceAll(',', '');
      if (DECIMAL_REGEX.test(updatedVal)) changeOverdueFields(name, updatedVal);
    },
    [DECIMAL_REGEX]
  );

  const handleSelectInputChange = useCallback(e => {
    changeOverdueFields(e?.name, e);
  }, []);

  const handleDateInputChange = useCallback((name, e) => {
    changeOverdueFields(name, e);
  }, []);

  const getComponentFromType = useCallback(
    input => {
      let component = null;
      switch (input.type) {
        case 'text':
          component = (
            <Input
              type="text"
              name={input.name}
              onBlur={input?.onBlur}
              placeholder={input.placeholder}
              value={input?.value}
              onChange={handleTextInputChange}
            />
          );
          break;
        case 'select':
          component = (
            <>
              <Select
                name={input.name}
                placeholder={input.placeholder}
                options={input?.data}
                value={input?.value}
                onChange={
                  input?.name === 'debtorId'
                    ? e => handleDebtorChange(e, false)
                    : handleSelectInputChange
                }
                onInputChange={input?.onInputChange}
              />
              {input?.isOr && <div className="or-text">OR</div>}
            </>
          );
          break;
        case 'date':
          component =
            input.name === 'monthString' ? (
              <span className="add-overdue-month-picker font-field f-14">{input?.value}</span>
            ) : (
              <div className="date-picker-container">
                <DatePicker
                  name={input.name}
                  placeholderText={input.placeholder}
                  selected={input?.value}
                  showMonthDropdown
                  showYearDropdown
                  scrollableYearDropdown
                  onChange={e => handleDateInputChange(input?.name, e)}
                />
                <span className="material-icons-round">event</span>
              </div>
            );
          break;
        case 'main-title':
          component = <div className="add-modal-full-width-row">{input.title}</div>;
          break;
        case 'amount':
          component = (
            <Input
              name={input.name}
              value={input?.value ? NumberCommaSeparator(input?.value) : ''}
              className="add-overdue-amount-input"
              type="text"
              placeholder="0"
              onChange={handleAmountInputChange}
            />
          );
          break;
        case 'textarea':
          component = (
            <textarea
              name={input.name}
              value={input?.value}
              rows={5}
              placeholder={input.placeholder}
              onChange={handleTextInputChange}
            />
          );
          break;
        case 'total-amount':
          component = (
            <div className="add-overdue-total-amount">
              {input?.value && input.value !== 'NaN' ? usdConverter(input?.value) : 0}
            </div>
          );
          break;
        default:
          component = (
            <>
              <div />
            </>
          );
      }
      const finalComponent = (
        <>
          {component}
          {overdueDetails && overdueDetails ? (
            <div className="ui-state-error">
              {overdueDetails && overdueDetails?.errors ? overdueDetails.errors?.[input?.name] : ''}
            </div>
          ) : (
            ''
          )}
        </>
      );
      return (
        <div
          className={`add-overdue-field-container ${
            input.type === 'textarea' && 'add-overdue-textarea'
          }`}
        >
          {input.name && (
            <div
              className={`add-overdue-title ${
                input.title === 'Outstanding Amounts' && 'add-overdue-total-amount-title'
              }`}
            >
              {input.title}
            </div>
          )}
          <div>{finalComponent}</div>
        </div>
      );
    },
    [overdueDetails, handleDateInputChange, handleSelectInputChange, handleTextInputChange, period]
  );

  const backToOverduesList = () => {
    history.replace('/over-dues');
  };

  const getMonthYearSeparated = period.split('-');
  const selectedMonth = getMonthYearSeparated[0];
  const selectedYear = getMonthYearSeparated[1];

  useEffect(() => {
    dispatch(getEntityDetails());
    return () => dispatch(resetOverdueFormData());
  }, []);

  useEffect(async () => {
    await getOverdueList();
  }, [period]);

  useEffect(() => {
    const currentAmount =
      overdueDetails?.currentAmount?.toString()?.trim()?.length > 0 &&
      (parseInt(overdueDetails?.currentAmount, 10) ?? 0);
    const thirtyDaysAmount =
      overdueDetails?.thirtyDaysAmount?.toString()?.trim()?.length > 0 &&
      (parseInt(overdueDetails?.thirtyDaysAmount, 10) ?? 0);
    const ninetyPlusDaysAmount =
      overdueDetails?.ninetyPlusDaysAmount?.toString()?.trim()?.length > 0 &&
      (parseInt(overdueDetails?.ninetyPlusDaysAmount, 10) ?? 0);
    const ninetyDaysAmount =
      overdueDetails?.ninetyDaysAmount?.toString()?.trim()?.length > 0 &&
      (parseInt(overdueDetails?.ninetyDaysAmount, 10) ?? 0);
    const sixtyDaysAmount =
      overdueDetails?.sixtyDaysAmount?.toString()?.trim()?.length > 0 &&
      (parseInt(overdueDetails?.sixtyDaysAmount, 10) ?? 0);

    const total =
      sixtyDaysAmount + ninetyDaysAmount + ninetyPlusDaysAmount + thirtyDaysAmount + currentAmount;
    changeOverdueFields('outstandingAmount', total.toString() ?? 0);
  }, [
    overdueDetails?.currentAmount,
    overdueDetails?.thirtyDaysAmount,
    overdueDetails?.sixtyDaysAmount,
    overdueDetails?.ninetyDaysAmount,
    overdueDetails?.ninetyPlusDaysAmount,
  ]);

  const overdueSaveAlertModalButtons = useMemo(
    () => [
      {
        title: 'Ok',
        buttonType: 'primary',
        onClick: () => toggleSaveAlertModal(),
      },
    ],
    [toggleSaveAlertModal]
  );
  const onCLickOverdueSave = useCallback(async () => {
    let validated = true;
    docs?.forEach(doc => {
      if (doc?.isExistingData) {
        if (!['AMEND', 'MARK_AS_PAID', 'UNCHANGED']?.includes(doc?.overdueAction)) {
          validated = false;
        }
      }
    });
    if (!validated) {
      toggleSaveAlertModal();
    } else {
      const finalData = docs?.map(doc => {
        const data = {};
        if (doc?.isExistingData) data._id = doc?._id;
        data.isExistingData = doc?.isExistingData ? doc?.isExistingData : false;
        data.debtorId = doc?.debtorId?.value;
        data.insurerId = doc?.insurerId?.value;
        data.overdueType = doc?.overdueType?.value;
        data.acn = doc?.acn;
        data.month = doc?.month;
        data.year = doc?.year;
        data.status = doc?.status?.value;
        data.dateOfInvoice = doc?.dateOfInvoice;
        data.outstandingAmount = doc?.outstandingAmount;
        data.ninetyPlusDaysAmount = doc?.ninetyPlusDaysAmount;
        data.ninetyDaysAmount = doc?.ninetyDaysAmount;
        data.sixtyDaysAmount = doc?.sixtyDaysAmount;
        data.thirtyDaysAmount = doc?.thirtyDaysAmount;
        data.currentAmount = doc?.currentAmount;
        if (doc?.overdueAction) data.overdueAction = doc?.overdueAction;
        if (doc?.clientComment) data.clientComment = doc?.clientComment;
        return data;
      });
      try {
        await dispatch(saveOverdueList({ list: finalData }));
        if (isPrompt) setIsPrompt(false);
        history.replace('/over-dues');
      } catch (e) {
        /**/
      }
    }
  }, [toggleSaveAlertModal, docs, isPrompt, setIsPrompt]);

  const alertOnLeftModalButtons = useMemo(
    () => [
      {
        title: 'Back To List',
        buttonType: 'primary-1',
        onClick: async () => {
          if (isPrompt) {
            await dispatch({
              type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.GET_OVERDUE_LIST_BY_DATE,
              data: overdueListByDateCopy,
            });
            setIsPrompt(false);
            history.replace('/over-dues');
          } else {
            history.replace('/over-dues');
          }
        },
      },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onCLickOverdueSave,
      },
    ],
    [onCLickOverdueSave, overdueListByDateCopy, isPrompt, setIsPrompt]
  );

  const handleBlockedRoute = useCallback(() => {
    toggleAlertOnLeftModal();
    setIsPrompt(true);
    return false;
  }, [toggleAlertOnLeftModal, setIsPrompt]);

  return (
    <>
      <Prompt
        when={!_.isEqual(overdueListByDate, overdueListByDateCopy)}
        message={handleBlockedRoute}
      />
      {!addOverduePageLoaderAction ? (
        <>
          <div className="breadcrumb-button-row mt-15">
            <div className="breadcrumb">
              <span onClick={backToOverduesList}>List of Overdues</span>
              <span className="material-icons-round">navigate_next</span>
              <span>
                {selectedMonth} {selectedYear}
              </span>
            </div>
          </div>
          <div className="common-white-container add-overdues-container">
            <div className="client-entry-details">
              <span>{overdueListByDate?.client ?? '-'}</span>
              <span>
                {overdueListByDate?.previousEntries &&
                  `Previous Entries : ${overdueListByDate?.previousEntries}`}
              </span>
              <Button buttonType="success" title="Add New" onClick={toggleOverdueFormModal} />
            </div>
            <AddOverdueTable
              setIsAmendOverdueModal={setIsAmendOverdueModal}
              toggleOverdueFormModal={toggleOverdueFormModal}
            />
          </div>
          <div className="add-overdues-save-button">
            <Button
              buttonType="primary"
              title="Save"
              onClick={overdueListByDate?.docs?.length > 0 && onCLickOverdueSave}
              isLoading={saveOverdueToBackEndPageLoaderAction}
            />
          </div>
          {overdueFormModal && (
            <Modal
              header={`${isAmendOverdueModal ? 'Amend Overdue' : 'Add Overdue'}`}
              className="add-overdue-modal"
              buttons={overdueFormModalButtons}
            >
              <div className="add-overdue-content">{addModalInputs?.map(getComponentFromType)}</div>
            </Modal>
          )}
        </>
      ) : (
        <Loader />
      )}
      {showSaveAlertModal && (
        <Modal header="Overdue Action" buttons={overdueSaveAlertModalButtons}>
          <span className="confirmation-message">
            Please take necessary actions on existing overdue.
          </span>
        </Modal>
      )}
      {alertOnLeftModal && (
        <Modal header="Save Overdue" buttons={alertOnLeftModalButtons}>
          <span className="confirmation-message">
            Please save overdue, otherwise you may lose your changes.
          </span>
        </Modal>
      )}
    </>
  );
};

export default AddOverdues;
