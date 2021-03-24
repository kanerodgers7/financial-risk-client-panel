import React, { useCallback } from 'react';
import './ApplicationCreditLimitStep.scss';
import { useDispatch, useSelector } from 'react-redux';
import RadioButton from '../../../../../common/RadioButton/RadioButton';
import Input from '../../../../../common/Input/Input';
import { updateEditApplicationField } from '../../../redux/ApplicationAction';

const ApplicationCreditLimitStep = () => {
  const dispatch = useDispatch();

  const {
    isExtendedPaymentTerms,
    extendedPaymentTermsDetails,
    isPassedOverdueAmount,
    passedOverdueDetails,
    creditLimit,
    errors,
  } = useSelector(({ application }) => application.editApplication.creditLimitStep);

  const updateSingleCompanyState = useCallback((name, value) => {
    dispatch(updateEditApplicationField('creditLimitStep', name, value));
  }, []);

  const handleInputChange = useCallback(
    e => {
      const { name, value } = e.target;
      updateSingleCompanyState(name, value);
    },
    [updateSingleCompanyState]
  );

  return (
    <>
      <div>
        <div className="f-14 font-primary mb-10">
          Any extended payment terms outside your policy standard terms? *
        </div>
        <RadioButton
          id="any-extended-pay-yes"
          name="isExtendedPaymentTerms"
          label="Yes"
          value="yes"
          checked={isExtendedPaymentTerms === 'yes'}
          onChange={handleInputChange}
        />
        <RadioButton
          id="any-extended-pay-no"
          name="isExtendedPaymentTerms"
          label="No"
          value="no"
          checked={isExtendedPaymentTerms === 'no'}
          onChange={handleInputChange}
        />
        {errors.isExtendedPaymentTerms && (
          <div className="ui-state-error">{errors.isExtendedPaymentTerms}</div>
        )}
      </div>
      <div className="if-yes-row">
        <span className="font-primary mr-15">If yes, please provide details</span>
        <Input
          type="text"
          placeholder="Details"
          name="extendedPaymentTermsDetails"
          value={extendedPaymentTermsDetails}
          onChange={handleInputChange}
        />
        {errors.extendedPaymentTermsDetails && (
          <div className="ui-state-error">{errors.extendedPaymentTermsDetails}</div>
        )}
      </div>

      <div>
        <div className="f-14 font-primary mb-10">
          Any overdue amounts passed your maximum extension period / Credit period? *
        </div>
        <RadioButton
          id="passed-max-period-yes"
          name="isPassedOverdueAmount"
          label="Yes"
          value="yes"
          checked={isPassedOverdueAmount === 'yes'}
          onChange={handleInputChange}
        />
        <RadioButton
          id="passed-max-period-no"
          name="isPassedOverdueAmount"
          label="No"
          value="no"
          checked={isPassedOverdueAmount === 'no'}
          onChange={handleInputChange}
        />
        {errors.isPassedOverdueAmount && (
          <div className="ui-state-error">{errors.isPassedOverdueAmount}</div>
        )}
      </div>

      <div className="if-yes-row">
        <span className="font-primary mr-15">If yes, please provide details</span>
        <Input
          type="text"
          placeholder="Details"
          name="passedOverdueDetails"
          value={passedOverdueDetails}
          onChange={handleInputChange}
        />
        {errors.passedOverdueDetails && (
          <div className="ui-state-error">{errors.passedOverdueDetails}</div>
        )}
      </div>

      <div className="f-14 font-secondary mb-10">
        Credit Limit Required covering 3 months of sales
      </div>

      <div className="credit-limit-amount">
        <span className="font-primary mr-15">Amount*</span>
        <Input
          type="text"
          name="creditLimit"
          placeholder="$00000"
          value={creditLimit}
          onChange={handleInputChange}
        />
      </div>
      {errors.creditLimit && <div className="ui-state-error">{errors.creditLimit}</div>}
    </>
  );
};

export default ApplicationCreditLimitStep;
