import moment from 'moment';
import { NUMBER_REGEX } from '../../../../constants/RegexConstants';
import {
  addNewOverdueDetails,
  amendOverdue,
  handleOverdueFieldChange,
} from '../../redux/OverduesAction';

export const addOverdueValidations = async (
  dispatch,
  data,
  isAmendOverdueModal,
  callbackOnFormAddORAmend,
  docs,
  period
) => {
  let validated = true;
  const errors = {};
  let preparedData = {};

  if (
    data?.acn &&
    (!NUMBER_REGEX.test(data?.acn) || data?.acn?.trim()?.length < 5 || data?.acn?.trim().length > 9)
  ) {
    validated = false;
    errors.acn = 'Please enter valid ACN number';
  }

  if (data?.debtorId?.length <= 0 && !data?.acn && data?.acn?.trim()?.length <= 0) {
    validated = false;
    errors.acn = 'You have to provide at least one - either a debtor or ACN number';
  }

  if (data?.debtorId && !isAmendOverdueModal) {
    const isExist = docs?.filter(doc => doc?.debtorId?.value === data?.debtorId?.value);
    if (isExist?.length > 0) {
      validated = false;
      errors.debtorId = 'Overdue for selected debtor is already exist, you can amend that.';
    }
  }

  if (data?.debtorId && isAmendOverdueModal) {
    const isExist = docs?.filter(
      doc =>
        doc?.debtorId?.value === data?.debtorId?.value && doc?.month === moment(period).format('MM')
    );
    const isSameOverdue = isExist?.length > 0 && isExist?.[0]?._id === data?._id;
    if (isExist?.length > 0 && !isSameOverdue) {
      validated = false;
      errors.debtorId = 'Overdue for selected debtor is already exist, you can amend that.';
    }
  }

  if (!data?.dateOfInvoice || data?.dateOfInvoice?.length <= 0) {
    validated = false;
    errors.dateOfInvoice = 'Please select date of invoice before continue';
  }

  if (!data?.overdueType || data?.overdueType?.length <= 0) {
    validated = false;
    errors.overdueType = 'Please select overdue type before continue';
  }

  if (!data?.insurerId || data?.insurerId?.length <= 0) {
    validated = false;
    errors.insurerId = 'Please select insurer before continue';
  }

  if (data?.outstandingAmount <= 0) {
    validated = false;
    errors.outstandingAmount = 'Outstanding amount cannot be zero';
  }

  const {
    _id,
    debtorId,
    acn,
    dateOfInvoice,
    overdueType,
    insurerId,
    clientComment,
    currentAmount,
    thirtyDaysAmount,
    sixtyDaysAmount,
    ninetyDaysAmount,
    ninetyPlusDaysAmount,
    outstandingAmount,
    status,
  } = data;
  preparedData = {
    debtorId,
    acn,
    dateOfInvoice,
    overdueType,
    insurerId,
    month: moment(period, 'MMMM-YYYY').format('MM'),
    year: moment(period, 'MMMM-YYYY').format('YYYY'),
    clientComment: clientComment?.toString()?.trim()?.length > 0 ? clientComment : '',
    currentAmount: currentAmount ? parseInt(currentAmount, 10) : 0,
    thirtyDaysAmount: thirtyDaysAmount ? parseInt(thirtyDaysAmount, 10) : 0,
    sixtyDaysAmount: sixtyDaysAmount ? parseInt(sixtyDaysAmount, 10) : 0,
    ninetyDaysAmount: ninetyDaysAmount ? parseInt(ninetyDaysAmount, 10) : 0,
    ninetyPlusDaysAmount: ninetyPlusDaysAmount ? parseInt(ninetyPlusDaysAmount, 10) : 0,
    outstandingAmount: outstandingAmount || 0,
    overdueAction: isAmendOverdueModal && 'AMEND',
    status: !isAmendOverdueModal ? { label: 'Submitted', value: 'SUBMITTED' } : status,
    _id: !isAmendOverdueModal ? Math?.random().toString() : _id,
  };
  dispatch(handleOverdueFieldChange('errors', errors));

  if (validated) {
    const finalData = { ...preparedData };
    try {
      validated = true;
      if (isAmendOverdueModal) {
        await dispatch(amendOverdue(data?._id, finalData));
      } else {
        await dispatch(addNewOverdueDetails(finalData));
      }
      callbackOnFormAddORAmend();
    } catch {
      /**/
    }
  }

  return validated;
};
