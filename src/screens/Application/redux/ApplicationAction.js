import ApplicationApiServices from '../services/ApplicationApiServices';
import { errorNotification, successNotification } from '../../../common/Toast';
import {
  APPLICATION_COLUMN_LIST_REDUX_CONSTANTS,
  APPLICATION_FILTER_LIST_REDUX_CONSTANTS,
  APPLICATION_REDUX_CONSTANTS,
} from './ApplicationReduxConstants';
import ApplicationCompanyStepApiServices from '../services/ApplicationCompanyStepApiServices';
import ApplicationDocumentStepApiServices from "../services/ApplicationDocumentStepApiServices";


export const getApplicationsListByFilter = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const response = await ApplicationApiServices.getApplicationListByFilter(params);

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.APPLICATION_LIST_SUCCESS,
          data: response.data.data,
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.APPLICATION_LIST_FAILURE,
        });
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
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

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.APPLICATION_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
        dispatch({
          type: APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.APPLICATION_DEFAULT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
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
          throw Error();
        }
      }
      const response = await ApplicationApiServices.updateApplicationColumnNameList(data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.APPLICATION_DEFAULT_COLUMN_LIST_ACTION,
          data: applicationColumnNameList,
        });
        successNotification('Columns updated successfully');
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
      }
      throw Error();
    }
  };
};

// for filter of Application list
export const getApplicationFilter = () => {
  return async dispatch => {
    try {
      const response = await ApplicationApiServices.getApplicationFilter();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_FILTER_LIST_REDUX_CONSTANTS.APPLICATION_FILTER_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
};
export const getApplicationDetail = applicationId => {
  return async dispatch => {
    try {
      const response = await ApplicationApiServices.getApplicationDetail(applicationId);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.APPLICATION_DETAILS,
          data: response.data.data,
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
};

/*
 * Contact
 * */

export const getApplicationCompanyDropDownData = () => {
  return async dispatch => {
    try {
      const response = await ApplicationCompanyStepApiServices.getApplicationCompanyStepDropdownData();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_DROP_DOWN_DATA,
          data: response.data.data,
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
};

export const getApplicationCompanyDataFromDebtor = async (id, params) => {
  try {
    const response = await ApplicationCompanyStepApiServices.getApplicationCompanyDataFromDebtor(
            id,
            params
    );

    if (response.data.status === 'SUCCESS') {
      return response.data.data;
    }
    return null;
  } catch (e) {
    if (e.response.data.status === 'ERROR') {
      if (e.response.data.messageCode === 'APPLICATION_ALREADY_EXISTS') {
        errorNotification('Application already exist with this debtor');
      }
    }
    errorNotification('Internal server error');
    throw Error();
  }
};

export const getApplicationCompanyDataFromABNOrACN = async (params) => {
  try {
    const response = await ApplicationCompanyStepApiServices.getApplicationCompanyDataFromABNorACN(
            params
    );

    if (response.data.status === 'SUCCESS') {
      return response.data.data;
    }
    return null;
  } catch (e) {
    if (e.response && e.response.data) {
      if (e.response.data.status === 'ERROR') {
        errorNotification(e.response.data.message);
      } else if (e.response.data.status === undefined) {
        errorNotification('It seems like server is down, Please try again later.');
      } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
        errorNotification('Internal server error');
      } else {
        errorNotification('It seems like server is down, Please try again later.');
      }
    }
    throw Error();
  }
};

export const searchApplicationCompanyEntityName = (searchText) => {
  return async dispatch => {
    try {
      dispatch({
        type: APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_ENTITY_TYPE_DATA,
        data: {
          isLoading: true,
          error: false,
          errorMessage: '',
          data: [],
        },
      });
      const response = await ApplicationCompanyStepApiServices.searchApplicationCompanyEntityName(
              searchText,
      );

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_ENTITY_TYPE_DATA,
          data: {
            isLoading: false,
            error: false,
            errorMessage: '',
            data: response.data.data,
          },
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else {
          dispatch({
            type: APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_ENTITY_TYPE_DATA,
            data: {
              isLoading: false,
              error: true,
              errorMessage: e.response.data.message || 'Please try again later.',
              data: [],
            },
          });
        }
      } else {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_ENTITY_TYPE_DATA,
          data: {
            isLoading: false,
            error: true,
            errorMessage: 'ABR lookup facing trouble to found searched data. Please try again...',
            data: [],
          },
        });
      }
    }
  };
};

export const changeEditApplicationFieldValue = (name, value) => {
  return dispatch => {
    dispatch({
      type:
      APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION
              .APPLICATION_COMPANY_EDIT_APPLICATION_CHANGE_FIELD_VALUE,
      name,
      value,
    });
  };
};

export const resetEditApplicationFieldValue = {
  type:
  APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION.APPLICATION_COMPANY_EDIT_APPLICATION_RESET_DATA,
};

export const updateEditApplicationData = (stepName, data) => {
  return dispatch => {
    dispatch({
      type:
      APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION
              .APPLICATION_COMPANY_EDIT_APPLICATION_UPDATE_ALL_DATA,
      stepName,
      data,
    });
  };
};

export const updateEditApplicationField = (stepName, name, value) => {
  return dispatch => {
    dispatch({
      type:
      APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION
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
export const wipeOutPersonsAsEntityChange = (debtor, data) => {
  return async dispatch => {
    try {
      const response = await ApplicationCompanyStepApiServices.deleteApplicationCompanyEntityTypeData(
              { debtorId: debtor }
      );
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.PERSON.WIPE_OUT_PERSON_STEP_DATA,
          data,
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        }
        if (e.response.data.message) {
          errorNotification(e.response.data.message);
        } else {
          errorNotification('Internal server error');
        }
      }
    }
  };
};

// person step edit application
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
export const changePersonType = (index, type) => {
  const companyData = {
    type: 'company',
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
    errors: {},
  };
  const data = type === 'individual' ? individualData : companyData;
  return dispatch => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.PERSON.CHANGE_APPLICATION_PERSON_TYPE,
      index,
      data,
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
      const response = await ApplicationApiServices.saveApplicationStepDataToBackend(data);
      if (response.data.status === 'SUCCESS') {
        const { _id } = response.data.data;
        dispatch(changeEditApplicationFieldValue('_id', _id));
        successNotification('Application step saved successfully');
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.message) {
          errorNotification(e.response.data.message);
        } else if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.messageCode === 'APPLICATION_ALREADY_EXISTS') {
          errorNotification('Application already exist');
        }
      }
    }
  };
};



// View Application

export const getApplicationDetailById = applicationId => {
  return async dispatch => {
    try {
      const response = await ApplicationApiServices.getApplicationDetail(applicationId);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_DETAIL_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
};

export const resetApplicationDetail = () => {
  return dispatch => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_DETAIL_ACTION,
      data: [],
    });
  };
};

// document
export const getApplicationDocumentDataList = (id, params = { page: 1, limit: 15 }) => {
  console.log('getApplicationDocumentDataList',id)
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
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.DOCUMENTS.APPLICATION_DOCUMENT_GET_UPLOAD_DOCUMENT_DATA,
          data: response.data.data && response.data.data.docs ? response.data.data.docs : [],
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
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
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.DOCUMENTS.DOCUMENT_TYPE_LIST_DATA,
          data: response.data.data,
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
    }
  };
};
export const uploadDocument = (data, config) => {
  return async dispatch => {
    try {
      const response = await ApplicationDocumentStepApiServices.uploadDocument(data, config);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.DOCUMENTS.UPLOAD_DOCUMENT_DATA,
          data: response.data.data,
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
    }
  };
};

export const deleteApplicationDocumentAction = async (appDocId, cb) => {
  try {
    const response = await ApplicationDocumentStepApiServices.deleteApplicationDocument(appDocId);
    if (response.data.status === 'SUCCESS') {
      successNotification('Application document deleted successfully.');
      if (cb) {
        cb();
      }
    }
  } catch (e) {
    if (e.response && e.response.data) {
      if (e.response.data.status === undefined) {
        errorNotification('It seems like server is down, Please try again later.');
      } else {
        errorNotification('Internal server error');
      }
    }
  }
};
