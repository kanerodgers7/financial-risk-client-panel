import ApplicationApiServices from '../services/ApplicationApiServices';
import { errorNotification, successNotification } from '../../../common/Toast';
import {
  APPLICATION_COLUMN_LIST_REDUX_CONSTANTS,
  APPLICATION_FILTER_LIST_REDUX_CONSTANTS,
  APPLICATION_REDUX_CONSTANTS,
} from './ApplicationReduxConstants';
import ApplicationCompanyStepApiServices from '../services/ApplicationCompanyStepApiServices';
import ApplicationDocumentStepApiServices from '../services/ApplicationDocumentStepApiServices';
import ApplicationViewApiServices from '../services/ApplicationViewApiServices';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../common/GeneralLoader/redux/GeneralLoaderAction';
import { DashboardApiService } from '../../../common/Dashboard/services/DashboardApiService';

export const getApplicationsListByFilter = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const finalParams = {
        ...params,
        debtorId: params?.debtorId?.value
      }
      startGeneralLoaderOnRequest('applicationListPageLoader');
      const response = await ApplicationApiServices.getApplicationListByFilter(finalParams);

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.APPLICATION_LIST_SUCCESS,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('applicationListPageLoader');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('applicationListPageLoader');
      displayErrors(e);
    }
  };
};

export const resetApplicationListPaginationData = (page, pages, total, limit) => {
  return dispatch => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.RESET_APPLICATION_LIST_PAGINATION_DATA,
      page,
      pages,
      total,
      limit,
    });
  };
};

export const getApplicationColumnNameList = () => {
  return async dispatch => {
    try {
      const response = await ApplicationApiServices.getApplicationColumnNameList();

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.APPLICATION_COLUMN_LIST_ACTION,
          data: response?.data?.data,
        });
        dispatch({
          type: APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.APPLICATION_DEFAULT_COLUMN_LIST_ACTION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const deleteApplicationApiCall = async (appId, callBack) => {
  const params = {
    requestFrom: 'application',
  };
  try {
    startGeneralLoaderOnRequest('generateApplicationDeleteButtonLoaderAction');
    const response = await ApplicationApiServices.deleteApplication(appId, params);
    if (response.data.status === 'SUCCESS') {
      successNotification(response?.data?.message || 'Application deleted successfully.');
      stopGeneralLoaderOnSuccessOrFail('generateApplicationDeleteButtonLoaderAction');
      if (callBack) {
        callBack();
      }
    }
  } catch (e) {
    stopGeneralLoaderOnSuccessOrFail('generateApplicationDeleteButtonLoaderAction');
    displayErrors(e);
  }
};


export const changeApplicationColumnNameList = data => {
  return async dispatch => {
    dispatch({
      type: APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_APPLICATION_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveApplicationColumnNameList = ({
  applicationColumnNameList = {},
  isReset = false,
}) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(
        `applicationListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      let data = {
        isReset: true,
        columns: [],
        columnFor: 'application',
      };
      if (!isReset) {
        const defaultFields = applicationColumnNameList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = applicationColumnNameList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          isReset: false,
          columns: [...defaultFields, ...customFields],
          columnFor: 'application',
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopGeneralLoaderOnSuccessOrFail(
            `applicationListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
          );
          throw Error();
        }
      }
      const response = await ApplicationApiServices.updateApplicationColumnNameList(data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.APPLICATION_DEFAULT_COLUMN_LIST_ACTION,
          data: applicationColumnNameList,
        });
        successNotification('Columns updated successfully');
        stopGeneralLoaderOnSuccessOrFail(
          `applicationListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(
        `applicationListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      displayErrors(e);
      throw Error();
    }
  };
};

export const downloadDocuments = async data => {
  const str = data.toString();
  try {
    const config = {
      documentIds: str,
      action: 'download',
    };

    const response = await ApplicationApiServices.downloadDocument(config);
    if (response?.statusText === 'OK') {
      return response;
    }
  } catch (e) {
    displayErrors(e);
  }
  return false;
};

// for filter of Application list
export const getApplicationFilter = params => {
  return async dispatch => {
    try {
      const response = await ApplicationApiServices.getApplicationFilter(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_FILTER_LIST_REDUX_CONSTANTS.APPLICATION_FILTER_LIST_ACTION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
export const getApplicationDetail = applicationId => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('generateApplicationPageLoaderAction');
      const response = await ApplicationApiServices.getApplicationDetail(applicationId);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.APPLICATION_DETAILS,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('generateApplicationPageLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('generateApplicationPageLoaderAction');
      displayErrors(e);
    }
  };
};

/*
 * Contact
 * */

export const getApplicationCompanyDropDownData = () => {
  return async dispatch => {
    try {
      const response =
        await ApplicationCompanyStepApiServices.getApplicationCompanyStepDropdownData();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_DROP_DOWN_DATA,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getApplicationCompanyDataFromDebtor = id => {
  return async dispatch => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await ApplicationCompanyStepApiServices.getApplicationCompanyDataFromDebtor(
        id
      );

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.COMPANY
            .APPLICATION_COMPANY_WIPE_OUT_OLD_DATA_ON_SUCCESS,
          isDebtor: true,
        });
        return response.data;
      }
    } catch (e) {
      throw e;
    }
    return null;
  };
};

export const getApplicationCompanyDataFromABNOrACN = params => {
  return async dispatch => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response =
        await ApplicationCompanyStepApiServices.getApplicationCompanyDataFromABNorACN({
          ...params,
          step: 'company',
        });

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.COMPANY
            .APPLICATION_COMPANY_WIPE_OUT_OLD_DATA_ON_SUCCESS,
        });
        return response.data;
      }
    } catch (e) {
      throw e;
    }
    return null;
  };
};

export const searchApplicationCompanyEntityName = params => {
  return async dispatch => {
    try {
      dispatch({
        type: APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_ENTITY_TYPE_DATA,
        data: {
          isLoading: params?.page === 0 && true,
          error: false,
          errorMessage: '',
        },
      });
      const response = await ApplicationCompanyStepApiServices.searchApplicationCompanyEntityName(
        params
      );

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_ENTITY_TYPE_DATA,
          data: {
            isLoading: false,
            error: false,
            errorMessage: '',
            data: response?.data?.data,
          },
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response?.data?.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response?.data?.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else {
          dispatch({
            type: APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_ENTITY_TYPE_DATA,
            data: {
              isLoading: false,
              error: true,
              errorMessage: e.response.data.message ?? 'Please try again later.',
            },
          });
        }
      } else {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_ENTITY_TYPE_DATA,
          data: {
            isLoading: false,
            error: true,
            errorMessage: 'ABR Lookup is not responding, please try again.',
            data: [],
          },
        });
      }
    }
  };
};

export const resetEntityTableData = () => {
  return dispatch => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.COMPANY.WIPE_OUT_ENTITY_TABLE_DATA,
    });
  };
};

export const changeEditApplicationFieldValue = (name, value) => {
  return dispatch => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION
        .APPLICATION_COMPANY_EDIT_APPLICATION_CHANGE_FIELD_VALUE,
      name,
      value,
    });
  };
};

export const resetEditApplicationFieldValue = {
  type: APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION
    .APPLICATION_COMPANY_EDIT_APPLICATION_RESET_DATA,
};

export const updateEditApplicationData = (stepName, data) => {
  return dispatch => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION
        .APPLICATION_COMPANY_EDIT_APPLICATION_UPDATE_ALL_DATA,
      stepName,
      data,
    });
  };
};

export const updateEditApplicationField = (stepName, name, value) => {
  return dispatch => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION
        .APPLICATION_COMPANY_EDIT_APPLICATION_UPDATE_FIELD,
      stepName,
      name,
      value,
    });
  };
};
// for person step
export const addPersonDetail = type => {
  const companyData = {
    type: 'company',
    stakeholderCountry: [],
    abn: '',
    acn: '',
    entityType: '',
    entityName: '',
    tradingName: '',
    errors: {},
  };

  const individualData = {
    type: 'individual',
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    driverLicenceNumber: '',
    phoneNumber: '',
    mobileNumber: '',
    email: '',
    allowToCheckCreditHistory: false,
    property: '',
    unitNumber: '',
    streetNumber: '',
    streetName: '',
    streetType: '',
    suburb: '',
    state: '',
    country: '',
    postCode: '',
    stakeholderCountry: {
      label: 'Australia',
      name: 'country',
      value: 'AUS',
    },
    errors: {},
  };
  const data = type === 'individual' ? individualData : companyData;
  return dispatch => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.PERSON.ADD_APPLICATION_PERSON,
      data,
    });
  };
};

export const removePersonDetail = index => {
  return dispatch => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.PERSON.REMOVE_APPLICATION_PERSON,
      data: index,
    });
  };
};

// person step edit application
export const getApplicationPersonDataFromABNOrACN = params => {
  return async () => {
    try {
      const response =
        await ApplicationCompanyStepApiServices.getApplicationCompanyDataFromABNorACN({
          ...params,
          step: 'person',
        });

      if (response?.data?.status === 'SUCCESS') {
        return response?.data?.data;
      }
    } catch (e) {
      displayErrors(e);
      throw Error();
    }
    return null;
  };
};

export const updatePersonData = (index, name, value) => {
  return dispatch => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.PERSON.EDIT_APPLICATION_PERSON,
      index,
      name,
      value,
    });
  };
};
// dispatch this when radio button change from indi to company
export const changePersonType = (index, personType) => {
  return dispatch => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.PERSON.CHANGE_APPLICATION_PERSON_TYPE,
      index,
      personType,
    });
  };
};

export const updatePersonStepDataOnValueSelected = (index, data) => {
  return dispatch => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.PERSON.PERSON_STEP_COMPANY_EDIT_APPLICATION_UPDATE_ALL_DATA,
      index,
      data,
    });
  };
};

export const saveApplicationStepDataToBackend = data => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('generateApplicationSaveAndNextButtonLoaderAction');
      const response = await ApplicationApiServices.saveApplicationStepDataToBackend(data);
      if (response?.data?.status === 'SUCCESS') {
        if (response?.data?.data?.applicationStage) {
          const { _id } = response?.data?.data;
          dispatch(changeEditApplicationFieldValue('_id', _id));
        }
        successNotification(response?.data?.message || 'Application step saved successfully');
        stopGeneralLoaderOnSuccessOrFail('generateApplicationSaveAndNextButtonLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('generateApplicationSaveAndNextButtonLoaderAction');
      if (e.response?.data?.messageCode === 'APPLICATION_ALREADY_EXISTS') {
        errorNotification(e?.response?.data?.message ?? 'Application already exist');
        throw Error();
      } else if (e.response?.data?.messageCode === 'REQUIRE_FIELD_MISSING') {
        errorNotification(e?.response?.data?.message ?? 'Required field armissing');
        throw Error();
      } else {
        displayErrors(e);
        throw Error();
      }
    }
  };
};

// View Application

export const getApplicationDetailById = applicationId => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('viewApplicationPageLoader');
      const response = await ApplicationApiServices.getApplicationDetail(applicationId);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_DETAIL_ACTION,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('viewApplicationPageLoader');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('viewApplicationPageLoader');
      displayErrors(e);
    }
  };
};

export const changeApplicationStatus = (applicationId, status) => {
  return async dispatch => {
    try {
      const response = await ApplicationViewApiServices.changeApplicationStatus(
        applicationId,
        status
      );
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message ?? 'Application status updated successfully.');
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_STATUS_CHANGE_ACTION,
          data: status,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const resetApplicationDetail = () => {
  return dispatch => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_DETAIL_ACTION,
      data: {},
    });
  };
};

// document
export const getApplicationDocumentDataList = (id, params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const updateParams = {
        ...params,
        documentFor: 'application',
      };
      const response = await ApplicationDocumentStepApiServices.getApplicationDocumentDataList(
        id,
        updateParams
      );
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.DOCUMENTS.APPLICATION_DOCUMENT_GET_UPLOAD_DOCUMENT_DATA,
          data: response?.data?.data && response?.data?.data.docs ? response?.data?.data.docs : [],
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getDocumentTypeList = () => {
  return async dispatch => {
    try {
      const params = {
        listFor: 'application',
      };
      const response = await ApplicationDocumentStepApiServices.getDocumentTypeListData(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.DOCUMENTS.DOCUMENT_TYPE_LIST_DATA,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
export const uploadDocument = (data, config) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('GenerateApplicationDocumentUploadButtonLoaderAction');
      const response = await ApplicationDocumentStepApiServices.uploadDocument(data, config);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.DOCUMENTS.UPLOAD_DOCUMENT_DATA,
          data: response?.data?.data,
        });
        successNotification(response?.data?.message || 'Application document added successfully.');
        stopGeneralLoaderOnSuccessOrFail('GenerateApplicationDocumentUploadButtonLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('GenerateApplicationDocumentUploadButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const deleteApplicationDocumentAction = async (appDocId, cb) => {
  try {
    startGeneralLoaderOnRequest('GenerateApplicationDocumentDeleteButtonLoaderAction');
    const response = await ApplicationDocumentStepApiServices.deleteApplicationDocument(appDocId);
    if (response?.data?.status === 'SUCCESS') {
      successNotification(response?.data?.message || 'Application document deleted successfully.');
      stopGeneralLoaderOnSuccessOrFail('GenerateApplicationDocumentDeleteButtonLoaderAction');
      if (cb) {
        cb();
      }
    }
  } catch (e) {
    stopGeneralLoaderOnSuccessOrFail('GenerateApplicationDocumentDeleteButtonLoaderAction');
    displayErrors(e);
  }
};

// Application Task

export const getApplicationTaskList = id => {
  return async dispatch => {
    try {
      const data = {
        requestedEntityId: id,
        columnFor: 'application-task',
      };
      const response =
        await ApplicationViewApiServices.applicationTaskApiServices.getApplicationTaskListData(
          data
        );
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_TASK
            .APPLICATION_TASK_LIST_ACTION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

// Application modules
export const getApplicationModuleList = id => {
  return async dispatch => {
    try {
      const response =
        await ApplicationViewApiServices.applicationModulesApiServices.getApplicationModulesListData(
          id
        );
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_MODULES
            .APPLICATION_MODULE_LIST_DATA,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getViewApplicationDocumentTypeList = () => {
  return async dispatch => {
    try {
      const params = {
        listFor: 'application',
      };
      const response =
        await ApplicationViewApiServices.applicationModulesApiServices.getDocumentTypeListData(
          params
        );
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_MODULES
            .VIEW_APPLICATION_DOCUMENT_TYPE_LIST_DATA,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const viewApplicationUploadDocument = (data, config) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('viewDocumentUploadDocumentButtonLoaderAction');
      const response =
        await ApplicationViewApiServices.applicationModulesApiServices.uploadDocument(data, config);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_MODULES
            .VIEW_APPLICATION_UPLOAD_DOCUMENT_DATA,
          data: response?.data?.data,
        });
        successNotification(response?.data?.message || 'Document uploaded successfully.');
        stopGeneralLoaderOnSuccessOrFail('viewDocumentUploadDocumentButtonLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('viewDocumentUploadDocumentButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const deleteViewApplicationDocumentAction = async (appDocId, cb) => {
  try {
    startGeneralLoaderOnRequest('viewDocumentDeleteDocumentButtonLoaderAction');
    const response =
      await ApplicationViewApiServices.applicationModulesApiServices.deleteApplicationDocument(
        appDocId
      );
    if (response?.data?.status === 'SUCCESS') {
      successNotification(response?.data?.message || 'Document deleted successfully.');
      stopGeneralLoaderOnSuccessOrFail('viewDocumentDeleteDocumentButtonLoaderAction');
      if (cb) {
        cb();
      }
    }
  } catch (e) {
    stopGeneralLoaderOnSuccessOrFail('viewDocumentDeleteDocumentButtonLoaderAction');
    displayErrors(e);
  }
};
// Notes

export const getApplicationNotesList = id => {
  return async dispatch => {
    try {
      const data = {
        noteFor: 'application',
      };
      const response =
        await ApplicationViewApiServices.applicationNotesApiServices.getApplicationNotesListData(
          id,
          data
        );
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_NOTES
            .APPLICATION_NOTES_LIST_DATA,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const addApplicationNoteAction = (entityId, noteData) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('viewApplicationAddNewNoteButtonLoaderAction');
      const { description, isPublic } = noteData;
      const data = {
        noteFor: 'application',
        entityId,
        isPublic,
        description,
      };

      const response =
        await ApplicationViewApiServices.applicationNotesApiServices.addApplicationNote(data);

      if (response?.data?.status === 'SUCCESS') {
        await dispatch(getApplicationNotesList(entityId));
        successNotification(response?.data?.message || 'Note added successfully.');
        stopGeneralLoaderOnSuccessOrFail('viewApplicationAddNewNoteButtonLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('viewApplicationAddNewNoteButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const updateApplicationNoteAction = (entityId, noteData) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('viewApplicationEditNoteButtonLoaderAction');
      const { noteId, description, isPublic } = noteData;
      const data = {
        noteFor: 'application',
        entityId,
        isPublic,
        description,
      };

      const response =
        await ApplicationViewApiServices.applicationNotesApiServices.updateApplicationNote(
          noteId,
          data
        );

      if (response?.data?.status === 'SUCCESS') {
        await dispatch(getApplicationNotesList(entityId));
        successNotification(response?.data?.message || 'Note updated successfully.');
        stopGeneralLoaderOnSuccessOrFail('viewApplicationEditNoteButtonLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('viewApplicationEditNoteButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const deleteApplicationNoteAction = (noteId, cb) => {
  return async () => {
    try {
      startGeneralLoaderOnRequest('viewApplicationDeleteNoteButtonLoaderAction');
      const response =
        await ApplicationViewApiServices.applicationNotesApiServices.deleteApplicationNote(noteId);

      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Note deleted successfully.');
        stopGeneralLoaderOnSuccessOrFail('viewApplicationDeleteNoteButtonLoaderAction');
        if (cb) {
          cb();
        }
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('viewApplicationDeleteNoteButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const getApplicationDetailsOnBackToCompanyStep = (applicationId, activeStep) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('generateApplicationPageLoaderAction');
      const response = await ApplicationApiServices.getApplicationDetail(applicationId);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.UPDATE_APPLICATION_DETAILS_ON_BACK_TO_COMPANY_STEP,
          data: response?.data?.data,
          activeStep,
        });
        stopGeneralLoaderOnSuccessOrFail('generateApplicationPageLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('generateApplicationPageLoaderAction');
      displayErrors(e);
    }
  };
};

export const resetApplicationListData = () => {
  return dispatch => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.RESET_APPLICATION_LIST_DATA,
    });
  };
};

export const applicationDownloadAction = async filter => {
  startGeneralLoaderOnRequest('applicationDownloadButtonLoaderAction');
  try {
    const response = await ApplicationApiServices.downloadApplicationList({ ...filter });
    if (response?.statusText === 'OK') {
      stopGeneralLoaderOnSuccessOrFail(`applicationDownloadButtonLoaderAction`);
      return response;
    }
  } catch (e) {
    stopGeneralLoaderOnSuccessOrFail(`applicationDownloadButtonLoaderAction`);
    displayErrors(e);
  }
  return false;
};

export const getApplicationFilterDropDownDataBySearch = options => {
  return async dispatch => {
    try {
      const response = await DashboardApiService.getEntitiesBySearch(options);

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_FILTER_LIST_REDUX_CONSTANTS.APPLICATION_FILTER_LIST_BY_SEARCH,
          data: response?.data?.data,
          name: options.entityType,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getApplicationCompanyStepDropDownDataBySearch = options => {
  return async dispatch => {
    try {
      const response = await DashboardApiService.getEntitiesBySearch(options);

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_SEARCH_DROP_DOWN_DATA,
          data: response?.data?.data,
          name: options.entityType,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const downloadDecisionLetterForApplication = async (id, param) => {
  try {
    const response = await ApplicationViewApiServices.downloadDecisionLetterForApplication(
        id,
        param
    );
    if (response) {
      return response;
    }
  } catch (e) {
    if (e?.response?.statusText === 'Bad Request') {
      errorNotification('No decision letter found');
    }
    return false;
  }
  return false;
};

export const generateRandomRegistrationNumber = params => {
  return async(dispatch) => {
    try {
      const response = await ApplicationCompanyStepApiServices.generateRandomRegistrationNumber(params);
      if(response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.COMPANY.SET_RANDOM_GENERATED_REGISTRATION_NUMBER,
          data: response.data.data
        })
      return response.data.data;
      }
    } catch(e) {
      displayErrors(e);
    }
    return false;
  }
}
