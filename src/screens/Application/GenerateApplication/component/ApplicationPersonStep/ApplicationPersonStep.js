import React, { useCallback, useEffect, useMemo } from 'react';
import './ApplicationPersonStep.scss';
import { useDispatch, useSelector } from 'react-redux';
import Accordion from '../../../../../common/Accordion/Accordion';
import {
  addPersonDetail,
  getApplicationCompanyDropDownData,
 // getApplicationFilter,
} from '../../../redux/ApplicationAction';
import PersonIndividualDetail from './personIndividualDetail/PersonIndividualDetail';

const ApplicationPersonStep = () => {
  const personState = useSelector(({ application }) => application.editApplication.personStep);

  const { streetType, australianStates } = useSelector(
    ({ application }) => application.company.dropdownData
  );
  const companyEntityType = useSelector(
    ({ application }) => application.applicationFilterList.dropdownData.companyEntityType
  );

  const entityTypeFromCompany = 'PARTNERSHIP';
  console.log('entityTypeFromCompany', entityTypeFromCompany);

  const dispatch = useDispatch();
  useEffect(() => {
 //   dispatch(getApplicationFilter());
    dispatch(getApplicationCompanyDropDownData());
  }, []);

  const titleDropDown = useMemo(() => {
    const finalData = ['Mr', 'Mrs', 'Ms', 'Doctor', 'Miss', 'Professor'];

    return finalData.map(e => ({
      label: e,
      name: 'title',
      value: e,
    }));
  }, []);

  const INPUTS = [
    {
      type: 'radio',
      name: 'type',
      data: [
        {
          id: 'individual',
          label: 'Individual',
          value: 'individual',
        },
        {
          id: 'company',
          label: 'Company',
          value: 'company',
        },
      ],
    },
  ];

  const COMPANY_INPUT = [
    {
      type: 'blank',
    },
    {
      label: 'Trading Name',
      placeholder: 'Trading Name',
      type: 'text',
      name: 'tradingName',
      data: [],
    },
    {
      label: 'Entity Type*',
      placeholder: 'Select',
      type: 'select',
      name: 'entityType',
      data: companyEntityType,
    },
    {
      label: 'ACN',
      placeholder: '01234',
      type: 'search',
      name: 'acn',
      data: [],
    },

    {
      label: 'Entity Name*',
      placeholder: 'Enter Entity',
      type: 'entityName',
      name: 'entityName',
      data: [],
    },
    {
      label: 'ABN*',
      placeholder: '01234',
      type: 'search',
      name: 'abn',
      data: [],
    },
    {
      type: 'blank',
    },
  ];

  const INDIVIDUAL_INPUT = [
    {
      label: 'Individual Details',
      placeholder: '',
      type: 'main-title',
      name: '',
      data: [],
    },
    {
      label: 'Title*',
      placeholder: 'Select',
      type: 'select',
      name: 'title',
      data: titleDropDown,
    },
    {
      type: 'blank',
    },
    {
      label: 'First Name*',
      placeholder: 'Enter first name',
      type: 'text',
      name: 'firstName',
    },
    {
      label: 'Middle Name',
      placeholder: 'Enter middle name',
      type: 'text',
      name: 'middleName',
    },
    {
      label: 'Last Name*',
      placeholder: 'Enter last name',
      type: 'text',
      name: 'lastName',
    },
    {
      label: 'Date of Birth*',
      placeholder: 'Select date',
      type: 'date',
      name: 'dateOfBirth',
    },
    {
      label:
        'Do you give your consent for us to check your credit history with external credit agencies?',
      type: 'checkbox',
      name: 'allowToCheckCreditHistory',
    },
    {
      label: 'Identification Details',
      type: 'main-title',
    },
    {
      label: 'Driver License Number',
      placeholder: 'Enter driver license number',
      type: 'text',
      name: 'driverLicenceNumber',
    },
    {
      type: 'blank',
    },
    {
      label: 'Residential Details',
      type: 'main-title',
    },
    {
      label: 'Unit Number',
      placeholder: 'Enter location',
      type: 'text',
      name: 'unitNumber',
    },
    {
      label: 'Street Number*',
      placeholder: 'Street number',
      type: 'text',
      name: 'streetNumber',
      data: [],
    },
    {
      label: 'Street Name',
      placeholder: 'Enter street Name',
      type: 'text',
      name: 'streetName',
      data: [],
    },
    {
      label: 'Street Type',
      placeholder: 'Select',
      type: 'select',
      name: 'streetType',
      data: streetType,
    },
    {
      label: 'Suburb',
      placeholder: 'Suburb',
      type: 'text',
      name: 'suburb',
      data: [],
    },
    {
      label: 'State',
      placeholder: 'Select',
      type: 'select',
      name: 'state',
      data: australianStates,
    },
    {
      label: 'Postcode*',
      placeholder: 'Enter postcode',
      type: 'text',
      name: 'postcode',
    },
    {
      label: 'Contact Details',
      type: 'main-title',
    },
    {
      label: 'Phone Number',
      placeholder: '1234567890',
      type: 'text',
      name: 'phoneNumber',
    },
    {
      label: 'Mobile',
      placeholder: '1234567890',
      type: 'text',
      name: 'mobileNumber',
    },
    {
      label: 'Email',
      placeholder: 'Enter email address',
      type: 'email',
      name: 'email',
    },
  ];

  useEffect(() => {
    dispatch(addPersonDetail('individual'));
  }, []);

  const hasRadio = useMemo(() => ['PARTNERSHIP', 'TRUST'].includes(entityTypeFromCompany), [
    entityTypeFromCompany,
  ]);

  const getAccordionAccordingEntityType = useCallback(
    (person, index) => {
      let itemHeader = 'Director Details';
      switch (entityTypeFromCompany) {
        // case 'PROPRIETARY_LIMITED':
        //   return getAccordionItem();
        // case 'LIMITED_COMPANY':
        //   return getAccordionItem();
        case 'PARTNERSHIP':
          itemHeader = 'Partner Details';
          break;
        case 'SOLE_TRADER':
          itemHeader = 'Sole Trader Details';
          break;
        case 'TRUST':
          itemHeader = 'Trustee Details';
          break;
        case 'BUSINESS':
          itemHeader = 'Proprietor Details';
          break;
        // case 'CORPORATION':
        //   return getAccordionItem();
        // case 'GOVERNMENT':
        //   return getAccordionItem();
        // case 'INCORPORATED':
        //   return getAccordionItem();
        // case 'NO_LIABILITY':
        //   return getAccordionItem();
        // case 'PROPRIETARY':
        //   return getAccordionItem();
        // case 'REGISTERED_BODY':
        //   return getAccordionItem();
        default:
          break;
      }
      return (
        <PersonIndividualDetail
          itemHeader={itemHeader}
          hasRadio={hasRadio}
          INPUTS={INPUTS}
          COMPANY_INPUT={COMPANY_INPUT}
          INDIVIDUAL_INPUT={INDIVIDUAL_INPUT}
          index={index}
        />
      );
    },
    [INDIVIDUAL_INPUT, COMPANY_INPUT, INPUTS, hasRadio]
  );

  return (
    <>
      <Accordion>
        {personState && personState ? personState.map(getAccordionAccordingEntityType) : ''}
      </Accordion>
    </>
  );
};

export default ApplicationPersonStep;
