import React, {useCallback, useEffect, useMemo} from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Stepper from '../../../common/Stepper/Stepper';
import ApplicationCompanyStep from './component/ApplicationCompanyStep/ApplicationCompanyStep';
import ApplicationPersonStep from './component/ApplicationPersonStep/ApplicationPersonStep';
import ApplicationCreditLimitStep from './component/ApplicationCreditLimitStep/ApplicationCreditLimitStep';
import ApplicationDocumentStep from './component/ApplicationDocumentsStep/ApplicationDocumentStep';
import ApplicationConfirmationStep from './component/ApplicationConfirmationStep/ApplicationConfirmationStep';
import { applicationCompanyStepValidations } from './component/ApplicationCompanyStep/validations/ApplicationCompanyStepValidations';
import {
  addPersonDetail,
  changeEditApplicationFieldValue,
  resetEditApplicationFieldValue
} from '../redux/ApplicationAction';
// import { applicationCreditStepValidations } from './component/ApplicationCreditLimitStep/validations/ApplicationCreditStepValidations';
import {useQueryParams} from "../../../hooks/GetQueryParamHook";
import {applicationCreditStepValidations} from "./component/ApplicationCreditLimitStep/validations/ApplicationCreditStepValidations";
import {applicationPersonStepValidation} from "./component/ApplicationPersonStep/validations/ApplicationPersonStepValidations";
import {applicationDocumentsStepValidations} from "./component/ApplicationDocumentsStep/validations/ApplicationDocumentStepValidations";
import {applicationConfirmationStepValidations} from "./component/ApplicationConfirmationStep/validations/ApplicationConfirmationStepValidation";

const STEP_COMPONENT = [
  <ApplicationCompanyStep />,
  <ApplicationPersonStep />,
  <ApplicationCreditLimitStep />,
  <ApplicationDocumentStep />,
  <ApplicationConfirmationStep />,
];

const steps = [
  {
    icon: 'local_police',
    text: 'Company',
    name: 'company',
  },
  {
    icon: 'admin_panel_settings',
    text: 'Person',
    name: 'partners',
  },
  {
    icon: 'request_quote',
    text: 'Credit Limit',
    name: 'creditLimit',
  },
  {
    icon: 'description',
    text: 'Documents',
    name: 'documents',
  },
  {
    icon: 'list_alt',
    text: 'Confirmation',
    name: 'confirmationStep',
  },
];

const GenerateApplication = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { applicationStage, ...editApplicationData } = useSelector(
    ({ application }) => application?.editApplication ?? {}
  );
  const { applicationId } = useQueryParams();

  // for stepper components
  const FILTERED_STEP_COMPONENT = useMemo(() => {
    let finalSteps = STEP_COMPONENT;
    if (
            editApplicationData?.company?.entityType?.[0]?.value !== 'PARTNERSHIP' &&
            editApplicationData?.company?.entityType?.[0]?.value !== 'TRUST'
    ) {
      finalSteps = finalSteps.filter(step => step?.type?.name !== 'ApplicationPersonStep');
    }
    return finalSteps;
  }, [editApplicationData?.company?.entityType, STEP_COMPONENT]);

  // for stepper headings

  const FILTERED_STEPS = useMemo(() => {
    let finalSteps = [...steps];
    const entityType = editApplicationData?.company?.entityType?.[0]?.value ?? '';

    if (!['PARTNERSHIP', 'TRUST'].includes(entityType)) {
      finalSteps = finalSteps.filter(step => step?.text !== 'Person');
    } else {
      finalSteps = finalSteps.map(step => {
        if (step.text === 'Person')
          return {
            ...step,
            text: editApplicationData?.company?.entityType?.[0]?.label ?? '',
          };
        return step;
      });
    }

    return finalSteps;
  }, [editApplicationData?.company?.entityType, steps]);

  useEffect(() => {
    return () => {
      dispatch(resetEditApplicationFieldValue);
    };
  }, []);

  useEffect(() => {
    if (editApplicationData && editApplicationData._id) {
      const params = {
        applicationId: editApplicationData._id,
      };
      const url = Object.entries(params)
              .filter(arr => arr[1] !== undefined)
              .map(([k, v]) => `${k}=${v}`)
              .join('&');

      history.replace(`${history.location.pathname}?${url}`);
    }
  }, [editApplicationData._id, history]);

  const backToApplication = useCallback(() => {
    history.replace('/applications');
  }, [history]);

  const onChangeIndex = useCallback(newIndex => {
    dispatch(changeEditApplicationFieldValue('applicationStage', newIndex));
  }, []);

  const addStepClick = useCallback(() => {
    dispatch(addPersonDetail('individual'));
  }, []);

  const onNextClick = useCallback(() => {
    const data = editApplicationData[FILTERED_STEPS[applicationStage].name];
    switch (FILTERED_STEPS[applicationStage].name) {
      case 'company':
        return applicationCompanyStepValidations(dispatch, data, editApplicationData);
      case 'partners':
        return applicationPersonStepValidation(dispatch, data, editApplicationData);
      case 'creditLimit':
        return applicationCreditStepValidations(dispatch, data, editApplicationData);
      case 'documents':
        return applicationDocumentsStepValidations(dispatch, data, editApplicationData);
      case 'confirmationStep':
        return applicationConfirmationStepValidations(dispatch, data, editApplicationData, history);
      default:
        return false;
    }
  }, [editApplicationData, applicationStage, FILTERED_STEPS]);

  return (
    <>
      <div className="breadcrumb-button-row">
        <div className="breadcrumb">
          <span onClick={backToApplication}>Application List</span>
          <span className="material-icons-round">navigate_next</span>
          <span>Generate Application</span>
        </div>
      </div>
      <Stepper
        className="mt-10"
        steps={FILTERED_STEPS}
        stepIndex={applicationStage}
        onChangeIndex={onChangeIndex}
        canGoNext
        nextClick={onNextClick}
        addStepClick={addStepClick}
      >
        {FILTERED_STEP_COMPONENT[applicationStage]}
      </Stepper>
    </>
  );
};

export default GenerateApplication;

