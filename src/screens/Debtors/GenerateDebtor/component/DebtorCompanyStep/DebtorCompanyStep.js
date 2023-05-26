import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../../../common/Input/Input';
import {
  changeEditDebtorFieldValue,
  generateRandomRegistrationNumber,
  getDebtorCompanyDataFromABNOrACN,
  getDebtorCompanyDataFromDebtor,
  getDebtorCompanyDropDownData,
  getDebtorCompanyStepDropDownDataBySearch,
  resetEntityTableData,
  saveDebtorStepDataToBackend,
  searchDebtorCompanyEntityName,
  updateEditDebtorData,
  updateEditDebtorField,
} from '../../../redux/DebtorsAction';
import { errorNotification } from '../../../../../common/Toast';
import Loader from '../../../../../common/Loader/Loader';
import DebtorEntityNameTable from '../components/DebtorEntityNameTable/DebtorEntityNameTable';
import Modal from '../../../../../common/Modal/Modal';
import Button from '../../../../../common/Button/Button';
import IconButton from '../../../../../common/IconButton/IconButton';
import { debtorErrorHelper } from '../../../../../helpers/debtorErrorHelper';
import { DEBTORS_REDUX_CONSTANTS } from '../../../redux/DebtorsReduxConstants';
import Select from '../../../../../common/Select/Select';

export const DRAWER_ACTIONS = {
  SHOW_DRAWER: 'SHOW_DRAWER',
  UPDATE_DATA: 'UPDATE_DATA',
  HIDE_DRAWER: 'HIDE_DRAWER',
};

const drawerInitialState = {
  visible: false,
  data: null,
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
    case DRAWER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        ...action.data,
      };

    default:
      return state;
  }
};

const DebtorCompanyStep = () => {
  const dispatch = useDispatch();

  const companyState = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.editDebtor?.company ?? {}
  );
  const { partners, errors } = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.editDebtor ?? {}
  );
  const {
    clients,
    debtors,
    streetType,
    australianStates,
    newZealandStates,
    entityType,
    countryList,
  } = useSelector(({ debtorsManagement }) => debtorsManagement?.companyData?.dropdownData ?? {});
  const entityNameSearchDropDownData = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.companyData?.entityNameSearch ?? {}
  );

  const [drawerState, dispatchDrawerState] = useReducer(drawerReducer, drawerInitialState);
  const [stateValue, setStateValue] = useState([]);
  const [isAusOrNew, setIsAusOrNew] = useState(false);

  const [searchedEntityNameValue, setSearchedEntityNameValue] = useState('');

  const [currentPage, setCurrentPage] = useState(0);

  const [errorMessage, setErrorMessage] = useState('');
  const [errorModal, setErrorModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);

  const prevRef = useRef({});

  useEffect(() => {
    const country = companyState?.country?.value ?? '';
    let showDropDownInput = true;
    // dispatch(updateEditDebtorField('company', 'state', []));
    switch (country) {
      case 'AUS':
      case 'NZL':
        setStateValue(country === 'AUS' ? australianStates : newZealandStates);
        break;
      default:
        showDropDownInput = false;
        break;
    }
    setIsAusOrNew(showDropDownInput);
    if (!prevRef.current?.abn) {
      prevRef.current = { ...prevRef.current, abn: '' };
    }
    if (!prevRef.current?.acn) {
      prevRef.current = { ...prevRef.current, acn: '' };
    }
  }, [
    companyState.abn,
    companyState.acn,
    companyState?.country?.value,
    prevRef,
    australianStates,
    newZealandStates,
  ]);

  /**/
  const handleDebtorErrors = useCallback(response => {
    const { isModal, modalType, message, resData } = debtorErrorHelper(response);
    if (isModal && modalType === 'ERROR') {
      setErrorMessage(message);
      setErrorModal(true);
      return false;
    }
    if (isModal && modalType === 'WARNING') {
      setErrorMessage(message);
      setWarningModal(true);
      return { resData, isModal };
    }
    return { resData };
  }, []);
  /**/

  const updateSingleCompanyState = useCallback((name, value) => {
    dispatch(updateEditDebtorField('company', name, value));
  }, []);

  const updateCompanyState = useCallback(data => {
    dispatch(updateEditDebtorData('company', data));
  }, []);

  const handleTextInputChange = useCallback(
    e => {
      const { name, value } = e.target;
      updateSingleCompanyState(name, value);
    },
    [updateSingleCompanyState]
  );

  const handleSelectInputChange = useCallback(
    async data => {
      if (data?.name === 'country') {
        updateSingleCompanyState(data?.name, data);
        dispatch(updateEditDebtorField('company', 'state', null));
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.COMPANY.DEBTOR_COMPANY_ON_COUNTRY_CHANGE_WIPE_OUT_DATA,
          data,
        });

        const finalErrors = { ...errors };
        delete finalErrors.state;

        dispatch(updateEditDebtorData('company', { errors: finalErrors }));
      } else if (data?.name === 'clientId') {
        try {
          let response;
          if (companyState?.debtorId?.value?.length > 0) {
            response = await dispatch(
              getDebtorCompanyDataFromDebtor(companyState?.debtorId?.value, {
                clientId: data?.value,
              })
            );
          } else if (companyState?.abn?.length > 0 || companyState?.abn?.length > 0) {
            if (!companyState?.country || companyState?.country?.length === 0) {
              errorNotification('Please select country before continue');
              return;
            }
            const searchString = companyState?.abn ?? companyState?.acn;
            response = await dispatch(
              getDebtorCompanyDataFromABNOrACN({
                searchString,
                clientId: data?.value,
                country: companyState?.country?.value,
              })
            );
          } else {
            updateSingleCompanyState(data?.name, data);
          }
          const { resData } = handleDebtorErrors(response);
          if (resData) {
            updateSingleCompanyState(data?.name, data);
            updateCompanyState(resData);
          }
        } catch (e) {
          handleDebtorErrors(e?.response);
        }
      } else {
        updateSingleCompanyState(data?.name, data);
        console.log('handleSelectInputChange___data', data);
      }
    },
    [updateSingleCompanyState, updateCompanyState, companyState, errors, partners?.length]
  );

  const handleDebtorSelectChange = useCallback(
    async data => {
      try {
        if (!companyState?.clientId || companyState?.clientId?.length === 0) {
          errorNotification('Please select client before continue');
          return;
        }
        const params = { clientId: companyState?.clientId?.value };
        const response = await dispatch(getDebtorCompanyDataFromDebtor(data?.value, params));
        const { resData } = handleDebtorErrors(response);
        if (resData) {
          await handleSelectInputChange(data);
          updateCompanyState(resData);
          prevRef.current = {
            ...prevRef.current,
            acn: resData?.acn,
            abn: resData?.abn,
          };
        }
      } catch (e) {
        handleDebtorErrors(e?.response);
      }
    },
    [
      companyState,
      handleSelectInputChange,
      updateCompanyState,
      updateSingleCompanyState,
      prevRef?.current,
    ]
  );

  const handleOnSelectSearchInputChange = useCallback((searchEntity, text) => {
    console.log('handleOnSelectSearchInputChange_______');
    const options = {
      searchString: text,
      entityType: searchEntity,
      requestFrom: 'debtor',
    };
    dispatch(getDebtorCompanyStepDropDownDataBySearch(options));
  }, []);

  const onHandleSearchClick = useCallback(
    async ref => {
      try {
        if (!companyState?.clientId || companyState?.clientId?.length === 0) {
          errorNotification('Please select clientId before continue');
          return;
        }
        if (!companyState?.country || companyState?.country?.length === 0) {
          errorNotification('Please select country before continue');
          return;
        }
        if (ref?.value?.trim()?.length > 0) {
          const searchString = ref?.value;
          const params = {
            searchString,
            clientId: companyState?.clientId?.value,
            country: companyState?.country?.value,
          };
          const response = await dispatch(getDebtorCompanyDataFromABNOrACN(params));

          const { resData } = handleDebtorErrors(response);
          if (resData) {
            updateCompanyState(resData);
            prevRef.current = {
              ...prevRef.current,
              acn: resData?.acn,
              abn: resData?.abn,
            };
          }
        } else {
          errorNotification(`Please enter search text for ${ref?.name}`);
        }
      } catch (err) {
        let value = prevRef?.current?.abn;
        if (ref?.name === 'acn') value = prevRef?.current?.acn;
        updateSingleCompanyState(ref?.name, value);
        handleDebtorErrors(err?.response);
      }
    },
    [companyState, updateCompanyState, updateSingleCompanyState, prevRef.current]
  );

  const handleSearchTextInputKeyDown = useCallback(
    async e => {
      if (e.key === 'Enter') {
        try {
          if (!companyState?.clientId || companyState?.clientId?.length === 0) {
            errorNotification('Please select clientId before continue');
            return;
          }
          if (!companyState?.country || companyState?.country?.length === 0) {
            errorNotification('Please select country before continue');
            return;
          }
          if (e?.target?.value?.trim()?.length > 0) {
            const searchString = e?.target?.value;
            const params = {
              searchString,
              clientId: companyState?.clientId?.value,
              country: companyState?.country?.value,
            };
            const response = await dispatch(getDebtorCompanyDataFromABNOrACN(params));

            const { resData } = handleDebtorErrors(response);
            if (resData) {
              updateCompanyState(resData);
              prevRef.current = {
                ...prevRef.current,
                acn: resData?.acn,
                abn: resData?.abn,
              };
            }
          } else {
            errorNotification(`Please enter search text for ${e?.target?.name}`);
          }
        } catch (err) {
          let value = prevRef?.current?.abn;
          if (e?.target?.name === 'acn') value = prevRef?.current?.acn;
          updateSingleCompanyState(e?.target?.name, value);
          handleDebtorErrors(err?.response);
        }
      }
    },
    [companyState, updateCompanyState, updateSingleCompanyState, prevRef.current]
  );

  const handleEntityNameSearchOnSearchClick = useCallback(
    async ref => {
      if (!companyState?.clientId || companyState?.clientId?.length === 0) {
        errorNotification('Please select client before continue');
        return;
      }
      if (!companyState?.country || companyState?.country?.length === 0) {
        errorNotification('Please select country before continue');
        return;
      }
      if (ref?.value.toString().trim().length > 0) {
        dispatchDrawerState({
          type: DRAWER_ACTIONS.SHOW_DRAWER,
          data: null,
        });
        setSearchedEntityNameValue(ref.value.toString());
        const params = {
          searchString: ref?.value,
          country: companyState?.country?.value,
          clientId: companyState?.clientId?.value,
          page: currentPage,
          step: 'company',
        };
        dispatch(searchDebtorCompanyEntityName(params));
      } else {
        errorNotification('Please enter search text for entity name');
      }
    },
    [
      companyState?.country,
      companyState?.clientId,
      updateCompanyState,
      dispatchDrawerState,
      setSearchedEntityNameValue,
      currentPage,
    ]
  );

  const handleEntityNameSearch = useCallback(
    async e => {
      if (e.key === 'Enter') {
        if (!companyState?.clientId || companyState?.clientId?.length === 0) {
          errorNotification('Please select client before continue');
          return;
        }
        if (!companyState?.country || companyState?.country?.length === 0) {
          errorNotification('Please select country before continue');
          return;
        }
        if (e.target.value.trim().length > 0) {
          dispatchDrawerState({
            type: DRAWER_ACTIONS.SHOW_DRAWER,
            data: null,
          });
          setSearchedEntityNameValue(e.target.value.toString());
          const params = {
            searchString: e?.target?.value,
            country: companyState?.country?.value,
            page: currentPage,
            step: 'company',
          };
          dispatch(searchDebtorCompanyEntityName(params));
        } else {
          errorNotification('Please enter search text for entity name');
        }
      }
    },
    [
      companyState?.country,
      companyState?.clientId,
      updateCompanyState,
      dispatchDrawerState,
      setSearchedEntityNameValue,
      currentPage,
    ]
  );

  const retryEntityNameRequest = useCallback(async () => {
    if (searchedEntityNameValue.trim().length > 0) {
      if (!companyState?.clientId || companyState?.clientId?.length === 0) {
        errorNotification('Please select client before continue');
        return;
      }
      if (!companyState?.country || companyState?.country?.length === 0) {
        errorNotification('Please select country before continue');
        return;
      }
      try {
        const params = {
          searchString: searchedEntityNameValue,
          country: companyState?.country?.value,
          clientId: companyState?.clientId?.value,
          page: currentPage,
          step: 'company',
        };
        await dispatch(searchDebtorCompanyEntityName(params));
      } catch (e) {
        /**/
      }
    }
  }, [searchedEntityNameValue, companyState?.country, companyState?.clientId, currentPage]);

  const handleEntityChange = useCallback(event => {
    const { name, value } = event.target;
    const data = {
      label: value,
      value,
    };
    dispatch(updateEditDebtorField('company', name, data));
  }, []);

  const handleToggleDropdown = useCallback(
    value =>
      dispatchDrawerState({
        type: DRAWER_ACTIONS.UPDATE_DATA,
        data: {
          visible: value !== undefined ? value : e => !e,
        },
      }),
    [dispatchDrawerState]
  );

  const onCloseEntityTableModal = useCallback(() => {
    handleToggleDropdown(false);
    setCurrentPage(0);
    setSearchedEntityNameValue('');
    dispatch(resetEntityTableData());
  }, []);

  const handleEntityNameSelect = useCallback(
    async data => {
      try {
        const params = {
          searchString: data?.abn,
          clientId: companyState?.clientId?.value,
          country: companyState?.country?.value,
        };
        const response = await dispatch(getDebtorCompanyDataFromABNOrACN(params));

        const { resData } = handleDebtorErrors(response);
        if (resData) {
          updateCompanyState(resData);
          prevRef.current = {
            ...prevRef.current,
            acn: resData?.acn,
            abn: resData?.abn,
          };
          onCloseEntityTableModal();
        }
      } catch (err) {
        handleDebtorErrors(err?.response);
      }
    },
    [companyState, updateCompanyState, prevRef.current]
  );

  const onGenerateRegistrationNumber = () => {
    dispatch(generateRandomRegistrationNumber({ requestFrom: 'debtor' }));
  };

  const INPUTS = useMemo(
    () => [
      // {
      //   label: 'Client',
      //   placeholder: 'Select Client',
      //   type: 'select',
      //   name: 'clientId',
      //   data: clients,
      //   onSelectChange: handleSelectInputChange,
      //   onInputChange: text => handleOnSelectSearchInputChange('clients', text),
      // },
      {
        label: 'Country*',
        placeholder: 'Select',
        type: 'select',
        name: 'country',
        data: countryList,
        onSelectChange: handleSelectInputChange,
      },
      {
        type: 'section',
        mainTitle: 'Debtor Search',
      },
      // {
      //   label: 'Existing Debtors',
      //   placeholder: 'Select',
      //   type: 'select',
      //   isOr: isAusOrNew,
      //   name: 'debtorId',
      //   data: debtors,
      //   onSelectChange: handleDebtorSelectChange,
      //   onInputChange: text => handleOnSelectSearchInputChange('debtors', text),
      // },
      {
        label: 'ABN/NZBN*',
        placeholder: '01234',
        type: 'search',
        isOr: isAusOrNew,
        name: 'abn',
        data: [],
      },
      {
        label: 'Entity Name*',
        placeholder: 'Enter Entity',
        type: 'entityName',
        isOr: isAusOrNew,
        name: 'entityName',
        data: [],
      },
      {
        label: 'ACN/NCN*',
        placeholder: '01234',
        type: 'search',
        name: 'acn',
        data: [],
      },
      {
        label: 'Generate Registration Number',
        type: 'button',
        name: 'randomNumber',
        onClick: onGenerateRegistrationNumber,
      },
      {
        type: 'section',
        mainTitle: 'Address and Other details',
      },
      // {
      //   label: 'Unit Number',
      //   placeholder: 'Unit Number',
      //   type: 'text',
      //   name: 'unitNumber',
      //   data: [],
      // },
      {
        label: 'Street Number',
        placeholder: 'Street Number',
        type: 'text',
        name: 'streetNumber',
        data: [],
      },
      {
        label: 'Street Name',
        placeholder: 'Street Name',
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
        onSelectChange: handleSelectInputChange,
      },
      {
        label: 'Suburb',
        placeholder: 'Suburb',
        type: 'text',
        name: 'suburb',
        data: [],
      },
      {
        label: 'Entity Type*',
        placeholder: 'Select',
        type: 'select',
        name: 'entityType',
        data: entityType,
        onSelectChange: handleSelectInputChange,
      },
      {
        label: 'Trading Name',
        placeholder: 'Trading Name',
        type: 'text',
        name: 'tradingName',
        data: [],
      },
      {
        label: 'State*',
        placeholder: isAusOrNew ? 'Select' : 'Enter State',
        type: isAusOrNew ? 'select' : 'text',
        name: 'state',
        data: stateValue,
        onSelectChange: handleSelectInputChange,
      },
      // {
      //   label: 'Property',
      //   placeholder: 'Property',
      //   type: 'text',
      //   name: 'property',
      //   data: [],
      // },
      {
        label: 'Postcode*',
        placeholder: 'Postcode',
        type: 'text',
        name: 'postCode',
        data: [],
      },
      {
        label: 'Phone Number',
        placeholder: '1234567890',
        type: 'text',
        name: 'contactNumber',
        data: [],
      },
    ],
    [
      clients,
      debtors,
      streetType,
      entityType,
      stateValue,
      isAusOrNew,
      countryList,
      handleDebtorSelectChange,
      handleSelectInputChange,
      handleOnSelectSearchInputChange,
      onGenerateRegistrationNumber,
    ]
  );

  const finalInputs = useMemo(() => {
    if (isAusOrNew) {
      return [...INPUTS];
    }
    const filteredData = [...INPUTS];
    filteredData.splice(3, 1, {
      label: 'Company Registration No.*',
      placeholder: 'Registration no',
      type: 'text',
      name: 'registrationNumber',
    });
    filteredData.splice(5, 1);
    return filteredData;
  }, [INPUTS, isAusOrNew]);

  const getComponentFromType = useCallback(
    input => {
      let component = null;

      switch (input.type) {
        case 'text':
          component = (
            <Input
              key={input.key}
              type="text"
              name={input.name}
              placeholder={input.placeholder}
              value={
                input?.name === 'state'
                  ? (!isAusOrNew && companyState?.[input.name]?.label) ?? companyState[input?.name]
                  : companyState[input?.name] ?? ''
              }
              onChange={handleTextInputChange}
            />
          );
          break;
        case 'search':
          component = (
            <Input
              key={input.key}
              type="text"
              name={input.name}
              suffix="search"
              suffixClass="debtor-search-suffix"
              suffixClick={onHandleSearchClick}
              placeholder={input.placeholder}
              value={companyState?.[input.name] ?? ''}
              onChange={handleTextInputChange}
              onKeyDown={handleSearchTextInputKeyDown}
            />
          );
          break;
        case 'entityName':
          component = (
            <Input
              key={input.key}
              type="text"
              name={input.name}
              suffix={isAusOrNew && 'search'}
              suffixClick={isAusOrNew ? handleEntityNameSearchOnSearchClick : null}
              suffixClass="debtor-search-suffix"
              placeholder={input.placeholder}
              onKeyDown={isAusOrNew ? handleEntityNameSearch : null}
              value={companyState?.entityName?.label ?? ''}
              onChange={handleEntityChange}
            />
          );
          break;
        case 'select': {
          component = (
            <Select
              key={input.key}
              placeholder={input.placeholder}
              name={input?.name}
              options={input?.data ?? []}
              isSearchable
              value={companyState?.[input?.name] ?? []}
              onChange={input?.onSelectChange}
              onInputChange={input?.onInputChange}
            />
          );
          break;
        }
        case 'button': {
          component = !isAusOrNew && (
            <Button
              key={input.key}
              buttonType="primary-small"
              title={input.label}
              onClick={input.onClick}
            />
          );
          break;
        }
        default:
          return (
            <div className="application-stepper-divider">
              <div className="application-company-step--main-title">{input?.mainTitle}</div>
            </div>
          );
      }
      return (
        <React.Fragment key={input.label}>
          {input.type === 'button' ? <div /> : <span>{input.label}</span>}
          <div className={input.name === 'abn' && 'debtor-input-or'}>
            {component}
            {companyState?.errors?.[input.name] && (
              <div className="ui-state-error">{companyState?.errors?.[input.name]}</div>
            )}
          </div>
        </React.Fragment>
      );
    },
    [
      companyState,
      handleDebtorSelectChange,
      handleSelectInputChange,
      handleTextInputChange,
      isAusOrNew,
    ]
  );

  const errorModalButtons = useMemo(
    () => [
      {
        title: 'Ok',
        buttonType: 'primary',
        onClick: () => {
          setErrorModal(false);
        },
      },
    ],
    []
  );

  const warningModalButtons = useMemo(
    () => [
      {
        title: 'No',
        buttonType: 'primary-1',
        onClick: () => {
          dispatch({
            type: DEBTORS_REDUX_CONSTANTS.COMPANY.DEBTOR_COMPANY_WIPE_OUT_DATA_IF_EXIST,
          });
          setWarningModal(false);
        },
      },
      {
        title: 'Yes',
        buttonType: 'primary',
        onClick: () => {
          setWarningModal(false);
        },
      },
    ],
    []
  );

  const changeEntityType = useMemo(
    () => [
      {
        title: 'No',
        buttonType: 'primary-1',
        onClick: () => {
          dispatch({
            type: DEBTORS_REDUX_CONSTANTS.COMPANY.ENTITY_TYPE_CHANGED,
            data: { data: {}, openModal: false },
          });
        },
      },
      {
        title: 'Yes',
        buttonType: 'danger',
        onClick: async () => {
          try {
            const data = {
              ...companyState?.onEntityChange?.data,
              removeStakeholders: true,
            };
            await dispatch(saveDebtorStepDataToBackend(data));
            dispatch({
              type: DEBTORS_REDUX_CONSTANTS.COMPANY.ENTITY_TYPE_CHANGED,
              data: { data: {}, openModal: false },
            });
            dispatch(changeEditDebtorFieldValue('debtorStage', 1));
          } catch (e) {
            /**/
          }
        },
      },
    ],
    [companyState?.onEntityChange?.data]
  );

  useEffect(() => {
    dispatch(getDebtorCompanyDropDownData());
    return () => dispatch(updateEditDebtorData('companyStep', { errors: {} }));
  }, []);

  return (
    <>
      {warningModal && (
        <Modal header="Debtor Already Exists" buttons={warningModalButtons}>
          <span className="confirmation-message">{errorMessage}</span>
        </Modal>
      )}
      {errorModal && (
        <Modal header="Debtor Already Exists" buttons={errorModalButtons}>
          <span className="confirmation-message">{errorMessage}</span>
        </Modal>
      )}
      {companyState?.onEntityChange?.openModal && (
        <Modal header="Change entity type" buttons={changeEntityType}>
          <span className="confirmation-message">
            Are you sure you want to change entity type? It will delete Stake Holders details.
          </span>
        </Modal>
      )}
      {drawerState.visible && (
        <Modal
          hideModal={onCloseEntityTableModal}
          className="debtor-entity-name-modal"
          header="Search Results"
          closeIcon="cancel"
          closeClassName="font-secondary"
        >
          {entityNameSearchDropDownData?.isLoading ? (
            <Loader />
          ) : (
            !entityNameSearchDropDownData?.error &&
            (entityNameSearchDropDownData?.data?.length > 0 ? (
              <DebtorEntityNameTable
                data={entityNameSearchDropDownData?.data}
                handleEntityNameSelect={handleEntityNameSelect}
                selectedCountry={companyState?.country?.value}
                setCurrentPage={setCurrentPage}
                requestNewPage={retryEntityNameRequest}
                hasMoreRecords={entityNameSearchDropDownData?.hasMoreData}
              />
            ) : (
              <div className="no-record-found">No record found</div>
            ))
          )}
          {entityNameSearchDropDownData?.error && (
            <>
              <div className="debtor-entity-name-modal-retry-button">
                {entityNameSearchDropDownData?.errorMessage}
              </div>
              <div className="debtor-entity-name-modal-retry-button">
                <IconButton
                  buttonType="primary"
                  title="refresh"
                  onClick={() => retryEntityNameRequest()}
                />
              </div>
            </>
          )}
        </Modal>
      )}
      <div className="application-company-container">{finalInputs.map(getComponentFromType)}</div>
    </>
  );
};

export default DebtorCompanyStep;
