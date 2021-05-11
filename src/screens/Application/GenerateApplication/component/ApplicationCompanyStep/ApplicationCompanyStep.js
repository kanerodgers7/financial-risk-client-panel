import React, {useCallback, useEffect, useMemo, useReducer, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ReactSelect from 'react-select';
import Input from '../../../../../common/Input/Input';
import _ from 'lodash';
import './ApplicationCompanyStep.scss';
import {
    getApplicationCompanyDataFromABNOrACN, getApplicationCompanyDataFromDebtor,
    getApplicationCompanyDropDownData,
    searchApplicationCompanyEntityName,
    updateEditApplicationData,
    updateEditApplicationField,
    wipeOutPersonsAsEntityChange,
} from '../../../redux/ApplicationAction';
import Loader from '../../../../../common/Loader/Loader';
import ApplicationEntityNameTable from '../components/ApplicationEntityNameTable/ApplicationEntityNameTable';
import Modal from '../../../../../common/Modal/Modal';
import IconButton from '../../../../../common/IconButton/IconButton';
import {errorNotification} from "../../../../../common/Toast";

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
            return {...drawerInitialState};
        case DRAWER_ACTIONS.UPDATE_DATA:
            return {
                ...state,
                ...action.data,
            };

        default:
            return state;
    }
};

const ApplicationCompanyStep = () => {
    const dispatch = useDispatch();

    const companyState = useSelector(({application}) => application?.editApplication?.company ?? {});
    const {partners} = useSelector(({application}) => application?.editApplication ?? {});
    const {
        debtors,
        streetType,
        australianStates,
        newZealandStates,
        entityType,
        countryList,
    } = useSelector(({application}) => application?.companyData?.dropdownData ?? {});
    const entityNameSearchDropDownData = useSelector(
            ({application}) => application?.companyData?.entityNameSearch ?? {}
    );

    const [drawerState, dispatchDrawerState] = useReducer(drawerReducer, drawerInitialState);
    const [stateValue, setStateValue] = useState([]);
    const [isAusOrNew, setIsAusOrNew] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [wipeOutDetails, setWipeOutDetails] = useState(false);
    const [selectedDebtorId, setSelectedDebtorId] = useState('');

    const [wipeOuts, setWipeOuts] = useState('');

    const [searchedEntityNameValue, setSearchedEntityNameValue] = useState('');

    const toggleConfirmationModal = useCallback(
            value => setShowConfirmModal(value!==undefined ? value:e => !e),
            [setShowConfirmModal]
    );

    useEffect(() => {
        if (companyState?.country?.value === 'AUS' || companyState?.country?.value === 'NZL') {
            setIsAusOrNew(true);
            setStateValue(companyState?.country?.value === 'AUS' ? australianStates : newZealandStates);
        }
    }, [companyState]);

    useEffect(() => {
         setSelectedDebtorId(companyState?.debtorId?.value);
    }, [companyState?.debtorId]);

    const changeEntityType = useMemo(
            () => [
                {title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal()},
                {
                    title: 'Delete',
                    buttonType: 'danger',
                    onClick: async () => {
                        try {
                            await dispatch(wipeOutPersonsAsEntityChange(selectedDebtorId, []));
                            updateSingleCompanyState(wipeOuts?.name, wipeOuts);
                            setWipeOutDetails(true);
                            toggleConfirmationModal();
                        } catch (e) {
                            /**/
                        }
                    },
                },
            ],
            [toggleConfirmationModal, wipeOutDetails, selectedDebtorId,wipeOuts]
    );

    const INPUTS = useMemo(
            () => [
                {
                    label: 'Debtor',
                    placeholder: 'Select',
                    type: 'select',
                    isOr:true,
                    name: 'debtorId',
                    data: debtors,
                },
                {
                    label: 'Country*',
                    placeholder: 'Select',
                    type: 'select',
                    name: 'country',
                    data: countryList,
                },
                {
                    label: 'ABN*',
                    placeholder: '01234',
                    type: 'search',
                    isOr:true,
                    name: 'abn',
                    data: [],
                },
                {
                    label: 'Phone Number',
                    placeholder: '1234567890',
                    type: 'text',
                    name: 'phoneNumber',
                    data: [],
                },
                {
                    label: 'Entity Name*',
                    placeholder: 'Enter Entity',
                    type: 'entityName',
                    isOr:true,
                    name: 'entityName',
                    data: {},
                },
                {
                    label: 'Property',
                    placeholder: 'Property',
                    type: 'text',
                    name: 'property',
                    data: [],
                },
                {
                    label: 'ACN',
                    placeholder: '01234',
                    type: 'search',
                    name: 'acn',
                    data: [],
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
                    data: entityType,
                },
                {
                    label: 'Outstanding Amount',
                    placeholder: '$0000',
                    type: 'text',
                    name: 'outstandingAmount',
                    data: [],
                },
                {
                    label: 'Unit Number',
                    placeholder: 'Unit Number',
                    type: 'text',
                    name: 'unitNumber',
                    data: [],
                },
                {
                    label: 'Street Number*',
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
                },
                {
                    label: 'Suburb',
                    placeholder: 'Suburb',
                    type: 'text',
                    name: 'suburb',
                    data: [],
                },
                {
                    label: 'State*',
                    placeholder: isAusOrNew ? 'Select':'Enter State',
                    type: isAusOrNew ? 'select':'text',
                    name: 'state',
                    data: stateValue,
                },
                {
                    label: 'Postcode*',
                    placeholder: 'Postcode',
                    type: 'text',
                    name: 'postCode',
                    data: [],
                },
            ],
            [debtors, streetType, entityType, stateValue, isAusOrNew]
    );

    const updateSingleCompanyState = useCallback(
            (name, value) => {
                if (wipeOutDetails) {
                    dispatch(updateEditApplicationField('company', 'wipeOutDetails', true));
                }
                dispatch(updateEditApplicationField('company', name, value));
            },
            [wipeOutDetails]
    );

    const updateCompanyState = useCallback(data => {
        dispatch(updateEditApplicationData('company', data));
    }, []);

    const handleTextInputChange = useCallback(
            e => {
                const {name, value} = e.target;
                updateSingleCompanyState(name, value);
            },
            [updateSingleCompanyState]
    );

    const handleSelectInputChange = useCallback(
            data => {
                if (data?.name==='country') {
                    updateSingleCompanyState(data?.name, data);
                    let showDropDownInput = true;

                    switch (data?.value) {
                        case 'AUS':
                            dispatch(updateEditApplicationField('company', 'state', []));
                            setStateValue(australianStates);
                            break;
                        case 'NZL':
                            dispatch(updateEditApplicationField('company', 'state', []));
                            setStateValue(newZealandStates);
                            break;
                        default:
                            showDropDownInput = false;
                            dispatch(updateEditApplicationField('company', 'state', []));
                            break;
                    }
                    setIsAusOrNew(showDropDownInput);
                } else if (data?.name ==='entityType' && partners.length!==0) {
                    setShowConfirmModal(true);
                    setWipeOuts(data);
                } else {
                    updateSingleCompanyState(data?.name, data);
                    dispatch(updateEditApplicationField('company', data?.name, data));
                }
            },
            [
                updateSingleCompanyState,
                setShowConfirmModal,
                setStateValue,
                newZealandStates,
                australianStates,
                setIsAusOrNew,
                setWipeOuts
            ]
    );
    const handleDebtorSelectChange = useCallback(
            async data => {
                try {
                    handleSelectInputChange(data);
                    const response = await getApplicationCompanyDataFromDebtor(data?.value);
                    if (response) {
                        updateCompanyState(response);
                    }
                } catch (e) {
                    /**/
                }
            },
            [companyState, handleSelectInputChange, updateCompanyState]
    );

    const handleSearchTextInputKeyDown = useCallback(
            async e => {
                try {
                    const response = await getApplicationCompanyDataFromABNOrACN(e.target.value);
                    if (response) {
                        updateCompanyState(response);
                    }
                } catch {
                    /**/
                }
            },
            [updateCompanyState]
    );

    const handleEntityNameSearch = useCallback(
            async e => {
                if (e.key==='Enter' && e.target.value.trim().length > 0) {
                    dispatchDrawerState({
                        type: DRAWER_ACTIONS.SHOW_DRAWER,
                        data: null,
                    });
                    setSearchedEntityNameValue(e.target.value.toString());
                    dispatch(searchApplicationCompanyEntityName(e.target.value));
                }
            },
            [updateCompanyState, dispatchDrawerState, setSearchedEntityNameValue]
    );

    const retryEntityNameRequest = useCallback(() => {
        if ((searchedEntityNameValue?.trim()?.length ?? -1) > 0) {
            dispatch(searchApplicationCompanyEntityName(searchedEntityNameValue));
        }
    }, [searchedEntityNameValue]);

    const handleEntityChange = useCallback(event => {
        const {name, value} = event.target;
        const data = {
                label: value,
                value,
            };
        dispatch(updateEditApplicationField('company', name, data));
    }, []);

    const handleToggleDropdown = useCallback(
            value =>
                    dispatchDrawerState({
                        type: DRAWER_ACTIONS.UPDATE_DATA,
                        data: {
                            visible: value!==undefined ? value:e => !e,
                        },
                    }),
            [dispatchDrawerState]
    );

    const handleEntityNameSelect = useCallback(
            async data => {
                try {
                    const response = await getApplicationCompanyDataFromABNOrACN(data.abn);
                    if (response) {
                        updateCompanyState(response);
                    }
                } catch (err) {
                    /**/
                }
                handleToggleDropdown(false);
                setSearchedEntityNameValue('');
            },
            [ updateCompanyState, setSearchedEntityNameValue, handleToggleDropdown]
    );

    const getComponentFromType = useCallback(
            input => {
                let component = null;

                switch (input.type) {
                    case 'text':
                        component = (
                                <Input
                                        type="text"
                                        name={input.name}
                                        placeholder={input.placeholder}
                                        value={
                                            input.name==='state'
                                                    ? (!isAusOrNew && companyState?.[input.name]?.label) ||
                                                    companyState[input?.name]
                                                    :companyState[input?.name]
                                        }
                                        onChange={handleTextInputChange}
                                />
                        );
                        break;
                    case 'search':
                        component = (
                                <Input
                                        type="text"
                                        name={input?.name}
                                        borderClass={input?.isOr && 'is-or-container'}
                                        suffix={input?.name ==='abn' ?<span className="material-icons">search</span>:''}
                                        placeholder={input.placeholder}
                                        value={companyState[input?.name]}
                                        onChange={handleTextInputChange}
                                        onKeyDown={_.debounce(handleSearchTextInputKeyDown, 1000)}
                                />
                        );
                        break;
                    case 'entityName':
                        component = (
                                <Input
                                        type="text"
                                        name={input?.name}
                                        suffix={<span className="material-icons">search</span>}
                                        placeholder={input.placeholder}
                                        borderClass={input?.isOr && 'is-or-container'}
                                        onKeyDown={handleEntityNameSearch}
                                        value={companyState?.entityName?.label}
                                        onChange={handleEntityChange}
                                />
                        );
                        break;
                    case 'select': {
                        let handleOnChange = handleSelectInputChange;
                        if (input.name === 'debtorId') {
                            handleOnChange = handleDebtorSelectChange;
                        }
                        component = (
                                <ReactSelect
                                        className={`${input?.isOr && 'is-or-container'} 'react-select-container'`}
                                        classNamePrefix="react-select"
                                        placeholder={input.placeholder}
                                        name={input?.name}
                                        options={input?.data}
                                        isSearchable
                                        value={companyState?.[input?.name]}
                                        onChange={handleOnChange}
                                />
                        );
                        break;
                    }
                    default:
                        return null;
                }
                return (
                        <React.Fragment key={input?.label}>
                            <span>{input?.label}</span>
                            <div>
                                {component}
                                {companyState?.errors?.[input?.name] && (
                                        <div className="ui-state-error">{companyState?.errors?.[input?.name]}</div>
                                )}
                            </div>
                        </React.Fragment>
                );
            },
            [
                companyState,
                handleSelectInputChange,
                handleTextInputChange,
                isAusOrNew,
                handleDebtorSelectChange
            ]
    );

    useEffect(() => {
        dispatch(getApplicationCompanyDropDownData()).catch(e => {
            errorNotification('Error during fetching data');
        });
        return () => dispatch(updateEditApplicationData('company', {errors: {}}));
    }, []);

    return (
            <>
                {showConfirmModal && (
                        <Modal
                                header="Change entity type"
                                buttons={changeEntityType}
                                hideModal={toggleConfirmationModal}
                        >
          <span className="confirmation-message">
            Are you sure you want to change entity type it will wipe-up person step data you filled?
          </span>
                        </Modal>
                )}
                {drawerState?.visible && (
                        <Modal
                                hideModal={handleToggleDropdown}
                                className="application-entity-name-modal"
                                header="Search Results"
                                closeIcon="cancel"
                                closeClassName="font-secondary"
                        >
                            {entityNameSearchDropDownData?.isLoading ? (
                                    <Loader/>
                            ):(
                                    !entityNameSearchDropDownData?.error && (
                                            <ApplicationEntityNameTable
                                                    data={entityNameSearchDropDownData?.data}
                                                    handleEntityNameSelect={handleEntityNameSelect}
                                            />
                                    )
                            )}
                            {entityNameSearchDropDownData?.error && (
                                    <>
                                        <div className="application-entity-name-modal-retry-button">
                                            {entityNameSearchDropDownData?.errorMessage}
                                        </div>
                                        <div className="application-entity-name-modal-retry-button">
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
                <div className="common-white-container client-details-container">
                    {INPUTS?.map(getComponentFromType)}
                </div>
            </>
    );
};

export default ApplicationCompanyStep;
