import { errorNotification, successNotification } from '../../../common/Toast';
import DebtorsApiServices from '../services/DebtorsApiServices';
import DebtorsNotesApiService from '../services/DebtorsNotesApiService';
import {
  DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS,
  DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS,
  DEBTORS_FILTER_LIST_REDUX_CONSTANTS,
  DEBTORS_REDUX_CONSTANTS,
} from './DebtorsReduxConstants';
import { DebtorsDocumentApiServices } from '../services/DebtorsDocumentApiServices';
import DebtorTaskApiService from '../services/DebtorTaskApiServices';
import DebtorApplicationApiServices from '../services/DebtorApplicationApiServices';
import DebtorCreditLimitApiServices from '../services/DebtorCreditLimitApiServices';
import DebtorStakeHolderApiServices from '../services/DebtorStakeHolderApiServices';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../common/GeneralLoader/redux/GeneralLoaderAction';
import { store } from '../../../redux/store';
import DebtorsReportsApiServices from '../services/DebtorsReportsApiServices';
import { DebtorOverdueApiServices } from '../services/DebtorOverdueApiServices';
import DebtorAlertsApiServices from '../services/DebtorAlertsApiServices';
import { DashboardApiService } from '../../Dashboard/services/DashboardApiService';
import DebtorsCompanyStepApiServices from '../services/DebtorsCompanyStepApiServices';

export const getDebtorsList = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('debtorListLoader');
      const response = await DebtorsApiServices.getAllDebtorsList(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.FETCH_DEBTOR_LIST_SUCCESS,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('debtorListLoader');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('debtorListLoader');
      displayErrors(e);
    }
  };
};

export const getDebtorsColumnNameList = () => {
  return async dispatch => {
    const params = {
      columnFor: 'debtor',
    };
    try {
      const response = await DebtorsApiServices.getDebtorsColumnNameList(params);

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.DEBTORS_MANAGEMENT_COLUMN_LIST_ACTION,
          data: response?.data?.data,
        });
        dispatch({
          type: DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.DEBTORS_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeDebtorsColumnListStatus = data => {
  return async dispatch => {
    dispatch({
      type: DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_DEBTORS_MANAGEMENT_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveDebtorsColumnListName = ({ debtorsColumnNameList = {}, isReset = false }) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(`DebtorListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
      let data = {
        columns: [],
        isReset: true,
        columnFor: 'debtor',
      };
      if (!isReset) {
        const defaultFields = debtorsColumnNameList.defaultFields.filter(e => e.isChecked).map(e => e.name);
        const customFields = debtorsColumnNameList.customFields.filter(e => e.isChecked).map(e => e.name);
        data = {
          columns: [...defaultFields, ...customFields],
          isReset: false,
          columnFor: 'debtor',
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopGeneralLoaderOnSuccessOrFail(`DebtorListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
          throw Error();
        }
      }
      const response = await DebtorsApiServices.updateDebtorsColumnNameList(data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.DEBTORS_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION,
          data: debtorsColumnNameList,
        });
        successNotification(response?.data?.message || 'Columns updated successfully.');
        stopGeneralLoaderOnSuccessOrFail(`DebtorListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`DebtorListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

export const resetDebtorListPaginationData = (page, pages, total, limit) => {
  return async dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.DEBTOR_LIST_RESET_PAGINATION_DATA,
      page,
      pages,
      total,
      limit,
    });
  };
};

export const getDebtorById = id => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('viewDebtorPageLoader');
      const response = await DebtorsApiServices.getDebtorDetailById(id);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.SELECTED_DEBTORS_DATA,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('viewDebtorPageLoader');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('viewDebtorPageLoader');
      displayErrors(e);
    }
  };
};

export const getDebtorDropdownData = () => {
  return async dispatch => {
    try {
      const response = await DebtorsApiServices.getDebtorDropdownDataList();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS.DEBTORS_MANAGEMENT_DROPDOWN_LIST_REDUX_CONSTANTS,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeDebtorData = (name, value) => {
  return async dispatch => {
    dispatch({
      type: DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS.DEBTOR_MANAGEMENT_UPDATE_DEBTOR_ACTION,
      name,
      value,
    });
  };
};

export const OnChangeCountry = value => {
  return async dispatch => {
    dispatch({
      type: DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS.DEBTOR_MANAGEMENT_UPDATE_DEBTOR_STATE_LIST_ACTION,
      value,
    });
  };
};

export const updateDebtorData = (id, finalData, cb) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(`viewDebtorUpdateDebtorButtonLoaderAction`);
      const response = await DebtorsApiServices.updateDebtorDetailById(id, finalData);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Debtor details updated successfully');
        dispatch(getDebtorById(id));
        stopGeneralLoaderOnSuccessOrFail(`viewDebtorUpdateDebtorButtonLoaderAction`);
        cb();
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`viewDebtorUpdateDebtorButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

// DEBTORS NOTES TAB

export const getDebtorsNotesListDataAction = (id, params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const updatedParams = {
        ...params,
        noteFor: 'debtor',
      };

      const response = await DebtorsNotesApiService.getDebtorsNotesList(id, updatedParams);

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.NOTES.FETCH_DEBTOR_NOTES_LIST_SUCCESS,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      dispatch({
        type: DEBTORS_REDUX_CONSTANTS.NOTES.FETCH_DEBTOR_NOTES_LIST_FAILURE,
        data: null,
      });
      displayErrors(e);
    }
  };
};

export const addDebtorsNoteAction = (entityId, noteData) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(`viewDebtorAddNewNoteButtonLoaderAction`);
      const { description, isPublic } = noteData;
      const data = {
        noteFor: 'debtor',
        entityId,
        isPublic,
        description,
      };

      const response = await DebtorsNotesApiService.addDebtorsNote(data);

      if (response?.data?.status === 'SUCCESS') {
        await dispatch(getDebtorsNotesListDataAction(entityId));
        successNotification(response?.data?.message || 'Note added successfully.');
        stopGeneralLoaderOnSuccessOrFail(`viewDebtorAddNewNoteButtonLoaderAction`);
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`viewDebtorAddNewNoteButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

export const updateDebtorsNoteAction = (entityId, noteData) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(`viewDebtorUpdateNoteButtonLoaderAction`);
      const { noteId, description, isPublic } = noteData;
      const data = {
        noteFor: 'debtor',
        entityId,
        isPublic,
        description,
      };

      const response = await DebtorsNotesApiService.updateDebtorsNote(noteId, data);

      if (response?.data?.status === 'SUCCESS') {
        await dispatch(getDebtorsNotesListDataAction(entityId));
        successNotification(response?.data?.message || 'Note updated successfully.');
        stopGeneralLoaderOnSuccessOrFail(`viewDebtorUpdateNoteButtonLoaderAction`);
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`viewDebtorUpdateNoteButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

export const deleteDebtorsNoteAction = async (noteId, cb) => {
  try {
    startGeneralLoaderOnRequest(`viewDebtorDeleteNoteButtonLoaderAction`);
    const response = await DebtorsNotesApiService.deleteDebtorsNote(noteId);

    if (response?.data?.status === 'SUCCESS') {
      successNotification(response?.data?.message || 'Note deleted successfully.');
      stopGeneralLoaderOnSuccessOrFail(`viewDebtorDeleteNoteButtonLoaderAction`);
      if (cb) {
        cb();
      }
    }
  } catch (e) {
    stopGeneralLoaderOnSuccessOrFail(`viewDebtorDeleteNoteButtonLoaderAction`);
    displayErrors(e);
  }
};

/* documents action */

export const getDebtorDocumentsListData = (id, params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const updatedParams = {
        ...params,
        documentFor: 'debtor',
      };

      const response = await DebtorsDocumentApiServices.getDebtorDocumentsList(id, updatedParams);

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.DOCUMENTS.FETCH_DEBTOR_DOCUMENTS_LIST_SUCCESS,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      dispatch({
        type: DEBTORS_REDUX_CONSTANTS.DOCUMENTS.FETCH_DEBTOR_DOCUMENTS_LIST_FAILURE,
        data: null,
      });
      displayErrors(e);
    }
  };
};

export const getDebtorDocumentsColumnNamesList = () => {
  return async dispatch => {
    try {
      const params = {
        columnFor: 'debtor-document',
      };

      const response = await DebtorsDocumentApiServices.getDebtorDocumentsColumnNamesList(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.DOCUMENTS.DEBTOR_DOCUMENTS_MANAGEMENT_COLUMN_LIST_ACTION,
          data: response?.data?.data,
        });
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.DOCUMENTS.DEBTOR_DOCUMENTS_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeDebtorDocumentsColumnListStatus = data => {
  return dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.DOCUMENTS.UPDATE_DEBTOR_DOCUMENTS_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveDebtorDocumentsColumnListName = ({ debtorsDocumentColumnNameList = {}, isReset = false }) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(`viewDebtorDocumentColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);

      let data = {
        isReset: true,
        columns: [],
        columnFor: 'debtor-document',
      };

      if (!isReset) {
        const defaultColumns = debtorsDocumentColumnNameList.defaultFields.filter(e => e.isChecked).map(e => e.name);
        const customFields = debtorsDocumentColumnNameList.customFields.filter(e => e.isChecked).map(e => e.name);
        data = {
          ...data,
          isReset: false,
          columns: [...defaultColumns, ...customFields],
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopGeneralLoaderOnSuccessOrFail(`viewDebtorDocumentColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
          throw Error();
        }
      }
      const response = await DebtorsDocumentApiServices.updateDebtorDocumentColumnListName(data);
      if (response && response.data && response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.DOCUMENTS.DEBTOR_DOCUMENTS_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION,
          data: debtorsDocumentColumnNameList,
        });
        successNotification(response?.data?.message || 'Columns updated successfully.');
        stopGeneralLoaderOnSuccessOrFail(`viewDebtorDocumentColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`viewDebtorDocumentColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

export const getDocumentTypeList = () => {
  return async dispatch => {
    try {
      const params = {
        listFor: 'debtor',
      };
      const response = await DebtorsDocumentApiServices.getDocumentTypeListData(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.DOCUMENTS.DOCUMENT_TYPE_LIST_DATA,
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
      startGeneralLoaderOnRequest(`viewDebtorUploadDocumentButtonLoaderAction`);
      const response = await DebtorsDocumentApiServices.uploadDocument(data, config);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.DOCUMENTS.UPLOAD_DOCUMENT_DEBTOR_ACTION,
          data: response?.data?.data,
        });
        successNotification(response.data.message || 'Document uploaded successfully');
        stopGeneralLoaderOnSuccessOrFail(`viewDebtorUploadDocumentButtonLoaderAction`);
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`viewDebtorUploadDocumentButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

// from ApplicationAction.js
// export const uploadDocument1 = (data, config) => {
//   return async dispatch => {
//     const params = {
//       requestFrom: 'application',
//     };
//     try {
//       startGeneralLoaderOnRequest('GenerateApplicationDocumentUploadButtonLoaderAction');
//       const response = await ApplicationDocumentStepApiServices.uploadDocument(
//         data,
//         config,
//         params
//       );
//       if (response?.data?.status === 'SUCCESS') {
//         dispatch({
//           type: APPLICATION_REDUX_CONSTANTS.DOCUMENTS.UPLOAD_DOCUMENT_DATA,
//           data: response?.data?.data,
//         });
//         successNotification(response?.data?.message || 'Application document added successfully.');
//         stopGeneralLoaderOnSuccessOrFail('GenerateApplicationDocumentUploadButtonLoaderAction');
//       }
//     } catch (e) {
//       stopGeneralLoaderOnSuccessOrFail('GenerateApplicationDocumentUploadButtonLoaderAction');
//       displayErrors(e);
//     }
//   };
// };

export const downloadDocuments = async data => {
  const str = data.toString();

  try {
    startGeneralLoaderOnRequest(`viewDebtorDownloadDocumentButtonLoaderAction`);
    const config = {
      documentIds: str,
      action: 'download',
    };

    const response = await DebtorsDocumentApiServices.downloadDocuments(config);
    if (response?.statusText === 'OK') {
      stopGeneralLoaderOnSuccessOrFail(`viewDebtorDownloadDocumentButtonLoaderAction`);
      return response;
    }
  } catch (e) {
    stopGeneralLoaderOnSuccessOrFail(`viewDebtorDownloadDocumentButtonLoaderAction`);
    displayErrors(e);
  }
  return false;
};

export const deleteDebtorDocumentAction = async (docId, cb) => {
  try {
    startGeneralLoaderOnRequest(`viewDebtorDeleteDocumentButtonLoaderAction`);
    const response = await DebtorsDocumentApiServices.deleteDebtorDocument(docId);
    if (response?.data?.status === 'SUCCESS') {
      successNotification(response?.data?.message || 'Document deleted successfully.');
      stopGeneralLoaderOnSuccessOrFail(`viewDebtorDeleteDocumentButtonLoaderAction`);
      if (cb) {
        cb();
      }
    }
  } catch (e) {
    stopGeneralLoaderOnSuccessOrFail(`viewDebtorDeleteDocumentButtonLoaderAction`);
    displayErrors(e);
  }
};

// tasks
export const getDebtorTaskListData = (params, id) => {
  return async dispatch => {
    try {
      const data = {
        ...params,
        requestedEntityId: id,
      };
      const response = await DebtorTaskApiService.getDebtorTaskListData(data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.FETCH_DEBTOR_TASK_LIST_SUCCESS,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      dispatch({
        type: DEBTORS_REDUX_CONSTANTS.TASK.FETCH_DEBTOR_TASK_LIST_FAILURE,
        data: null,
      });
      displayErrors(e);
    }
  };
};

export const getDebtorTaskColumnList = () => {
  return async dispatch => {
    try {
      const params = {
        columnFor: 'debtor-task',
      };
      const response = await DebtorTaskApiService.getDebtorTaskColumnNameList(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.DEBTOR_TASK_COLUMN_NAME_LIST_ACTION,
          data: response?.data?.data,
        });
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.DEBTOR_TASK_DEFAULT_COLUMN_NAME_LIST_ACTION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeDebtorTaskColumnNameListStatus = data => {
  return async dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.TASK.UPDATE_DEBTOR_TASK_COLUMN_NAME_LIST_ACTION,
      data,
    });
  };
};

export const saveDebtorTaskColumnNameListName = ({ debtorsTaskColumnNameList = {}, isReset = false }) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(`viewDebtorTaskColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
      let data = {
        isReset: true,
        columns: [],
        columnFor: 'debtor-task',
      };

      if (!isReset) {
        const defaultColumns = debtorsTaskColumnNameList.defaultFields.filter(e => e.isChecked).map(e => e.name);
        const customFields = debtorsTaskColumnNameList.customFields.filter(e => e.isChecked).map(e => e.name);
        data = {
          ...data,
          isReset: false,
          columns: [...defaultColumns, ...customFields],
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopGeneralLoaderOnSuccessOrFail(`viewDebtorTaskColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
          throw Error();
        }
      }

      const response = await DebtorTaskApiService.updateDebtorTaskColumnNameList(data);
      if (response && response.data && response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.DEBTOR_TASK_DEFAULT_COLUMN_NAME_LIST_ACTION,
          data: debtorsTaskColumnNameList,
        });
        successNotification(response?.data?.message || 'Columns updated successfully.');
        stopGeneralLoaderOnSuccessOrFail(`viewDebtorTaskColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`viewDebtorTaskColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

export const getAssigneeDropDownData = () => {
  return async dispatch => {
    try {
      const response = await DebtorTaskApiService.getAssigneeDropDownData();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.DEBTOR_ASSIGNEE_DROP_DOWN_DATA_ACTION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getEntityDropDownData = params => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('getDebtorTaskEntityDataLoader');
      const response = await DebtorTaskApiService.getEntityDropDownData(params);
      if (response?.data?.status === 'SUCCESS' && response?.data?.data) {
        stopGeneralLoaderOnSuccessOrFail('getDebtorTaskEntityDataLoader');
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.DEBTOR_ENTITY_DROP_DOWN_DATA_ACTION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('getDebtorTaskEntityDataLoader');
      displayErrors(e);
    }
  };
};

export const getDebtorDefaultEntityDropDownData = params => {
  return async dispatch => {
    try {
      const response = await DebtorTaskApiService.getEntityDropDownData(params);
      if (response?.data?.status === 'SUCCESS' && response?.data?.data) {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.DEBTOR_DEFAULT_DEBTOR_ENTITY_DROP_DOWN_DATA_ACTION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const updateAddTaskStateFields = (name, value) => {
  return dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.DEBTOR_UPDATE_ADD_TASK_FIELD_ACTION,
      name,
      value,
    });
  };
};

export const saveTaskData = (data, cb) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(`viewDebtorAddNewTaskButtonLoaderAction`);
      const response = await DebtorTaskApiService.saveNewTask(data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.DEBTOR_RESET_ADD_TASK_STATE_ACTION,
        });
        successNotification(response?.data?.message || 'Task created successfully');
        stopGeneralLoaderOnSuccessOrFail(`viewDebtorAddNewTaskButtonLoaderAction`);
        cb();
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`viewDebtorAddNewTaskButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

export const deleteTaskAction = (taskId, cb) => {
  return async () => {
    try {
      startGeneralLoaderOnRequest(`viewDebtorDeleteTaskButtonLoaderAction`);
      const response = await DebtorTaskApiService.deleteTask(taskId);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Task deleted successfully.');
        stopGeneralLoaderOnSuccessOrFail(`viewDebtorDeleteTaskButtonLoaderAction`);
        if (cb) {
          cb();
        }
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`viewDebtorDeleteTaskButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

export const getDebtorTaskDetail = id => {
  return async dispatch => {
    try {
      const response = await DebtorTaskApiService.getDebtorTaskDetailById(id);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.EDIT_TASK.GET_DEBTOR_TASK_DETAILS_ACTION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const updateTaskData = (id, data, cb) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(`viewDebtorUpdateTaskButtonLoaderAction`);
      const response = await DebtorTaskApiService.updateTask(id, data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.DEBTOR_RESET_ADD_TASK_STATE_ACTION,
        });
        successNotification(response?.data?.message || 'Task updated successfully');
        stopGeneralLoaderOnSuccessOrFail(`viewDebtorUpdateTaskButtonLoaderAction`);
        cb();
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`viewDebtorUpdateTaskButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

// Application
export const getDebtorApplicationListData = (id, param) => {
  return async dispatch => {
    try {
      const params = {
        ...param,
        listFor: 'debtor-application',
      };
      const response = await DebtorApplicationApiServices.getApplicationListData(id, params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.APPLICATION.FETCH_DEBTOR_APPLICATION_LIST_SUCCESS,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      dispatch({
        type: DEBTORS_REDUX_CONSTANTS.APPLICATION.FETCH_DEBTOR_APPLICATION_LIST_FAILURE,
        data: null,
      });
      displayErrors(e);
    }
  };
};

export const getDebtorApplicationColumnNameList = () => {
  return async dispatch => {
    try {
      const params = {
        columnFor: 'debtor-application',
      };
      const response = await DebtorApplicationApiServices.getDebtorApplicationColumnNameList(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.APPLICATION.DEBTOR_APPLICATION_COLUMN_LIST_ACTION,
          data: response?.data?.data,
        });
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.APPLICATION.DEBTOR_APPLICATION_DEFAULT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeDebtorApplicationColumnListStatus = data => {
  return async dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.APPLICATION.UPDATE_DEBTOR_APPLICATION_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveDebtorApplicationColumnNameList = ({ debtorsApplicationColumnNameList = {}, isReset = false }) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(`viewDebtorApplicationColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
      let data = {
        isReset: true,
        columns: [],
        columnFor: 'debtor-application',
      };
      if (!isReset) {
        const defaultFields = debtorsApplicationColumnNameList.defaultFields.filter(e => e.isChecked).map(e => e.name);
        const customFields = debtorsApplicationColumnNameList.customFields.filter(e => e.isChecked).map(e => e.name);
        data = {
          ...data,
          isReset: false,
          columns: [...defaultFields, ...customFields],
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopGeneralLoaderOnSuccessOrFail(
            `viewDebtorApplicationColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`,
          );
          throw Error();
        }
      }

      const response = await DebtorApplicationApiServices.updateDebtorApplicationColumnNameList(data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.APPLICATION.DEBTOR_APPLICATION_DEFAULT_COLUMN_LIST_ACTION,
          data: debtorsApplicationColumnNameList,
        });
        successNotification(response?.data?.message || 'Columns updated successfully');
        stopGeneralLoaderOnSuccessOrFail(`viewDebtorApplicationColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`viewDebtorApplicationColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

// credit limit
export const getDebtorCreditLimitData = (id, data) => {
  return async dispatch => {
    try {
      const response = await DebtorCreditLimitApiServices.getDebtorCreditLimitList(id, data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.FETCH_DEBTOR_CREDIT_LIMIT_LIST_SUCCESS,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getCreditLimitColumnsNameList = () => {
  return async dispatch => {
    try {
      const params = {
        columnFor: 'debtor-credit-limit',
      };
      const response = await DebtorCreditLimitApiServices.getDebtorCreditLimitColumnNameList(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.DEBTOR_CREDIT_LIMIT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.DEBTOR_CREDIT_LIMIT_DEFAULT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeDebtorCreditLimitColumnListStatus = data => {
  return dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.UPDATE_DEBTOR_CREDIT_LIMIT_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveDebtorCreditLimitColumnNameList = ({ debtorsCreditLimitColumnNameList = {}, isReset = false }) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(`viewDebtorCreditLimitColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
      let data = {
        isReset: true,
        columns: [],
        columnFor: 'debtor-credit-limit',
      };
      if (!isReset) {
        const defaultFields = debtorsCreditLimitColumnNameList.defaultFields.filter(e => e.isChecked).map(e => e.name);
        const customFields = debtorsCreditLimitColumnNameList.customFields.filter(e => e.isChecked).map(e => e.name);
        data = {
          isReset: false,
          columns: [...defaultFields, ...customFields],
          columnFor: 'debtor-credit-limit',
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopGeneralLoaderOnSuccessOrFail(
            `viewDebtorCreditLimitColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`,
          );
          throw Error();
        }
      }

      const response = await DebtorCreditLimitApiServices.updateDebtorCreditLimitColumnNameList(data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.DEBTOR_CREDIT_LIMIT_DEFAULT_COLUMN_LIST_ACTION,
          data: debtorsCreditLimitColumnNameList,
        });
        successNotification(response?.data?.message || 'Columns updated successfully');
        stopGeneralLoaderOnSuccessOrFail(`viewDebtorCreditLimitColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`viewDebtorCreditLimitColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

export const modifyDebtorCreditLimit = (id, data) => {
  return async () => {
    try {
      startGeneralLoaderOnRequest('ViewDebtorModifyCreditLimitButtonLoaderAction');

      const response = await DebtorCreditLimitApiServices.modifyDebtorCreditLimitData(id, data);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message ?? 'Credit limit updated successfully');
        stopGeneralLoaderOnSuccessOrFail('ViewDebtorModifyCreditLimitButtonLoaderAction');
      }
    } catch (e) {
      displayErrors(e);
      stopGeneralLoaderOnSuccessOrFail('ViewDebtorModifyCreditLimitButtonLoaderAction');
    }
  };
};

export const surrenderDebtorCreditLimit = (id, data) => {
  return async () => {
    try {
      startGeneralLoaderOnRequest('ViewDebtorSurrenderCreditLimitButtonLoaderAction');

      const response = await DebtorCreditLimitApiServices.surrenderDebtorCreditLimitData(id, data);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message ?? 'Credit limit surrendered successfully');
        stopGeneralLoaderOnSuccessOrFail('ViewDebtorSurrenderCreditLimitButtonLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('ViewDebtorSurrenderCreditLimitButtonLoaderAction');

      displayErrors(e);
    }
  };
};

export const downloadCreditLimitCSV = id => {
  return async () => {
    try {
      startGeneralLoaderOnRequest('viewDebtorDownloadCreditLimitCSVButtonLoaderAction');
      const response = await DebtorCreditLimitApiServices.downloadCreditLimitCSVFile(id);
      if (response?.statusText === 'OK') {
        stopGeneralLoaderOnSuccessOrFail(`viewDebtorDownloadCreditLimitCSVButtonLoaderAction`);
        return response;
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('viewDebtorDownloadCreditLimitCSVButtonLoaderAction');
      displayErrors(e);
      throw Error();
    }
    return false;
  };
};

export const downloadDebtorTabApplicationCSV = id => {
  return async () => {
    try {
      startGeneralLoaderOnRequest('DebtorDownloadApplicationCSVButtonLoaderAction');
      const response = await DebtorApplicationApiServices.downloadApplicationCSVFile(id);
      if (response?.statusText === 'OK') {
        stopGeneralLoaderOnSuccessOrFail(`DebtorDownloadApplicationCSVButtonLoaderAction`);
        return response;
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('DebtorDownloadApplicationCSVButtonLoaderAction');
      displayErrors(e);
      throw Error();
    }
    return false;
  };
};

// Stake Holder
export const getDebtorStakeHolderListData = (id, param) => {
  return async dispatch => {
    try {
      const params = {
        ...param,
      };
      const response = await DebtorStakeHolderApiServices.getStakeHolderListData(id, params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.FETCH_DEBTOR_STAKE_HOLDER_LIST_SUCCESS,
          data: response.data.data,
        });
      }
    } catch (e) {
      dispatch({
        type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.FETCH_DEBTOR_STAKE_HOLDER_LIST_FAILURE,
        data: null,
      });
      displayErrors(e);
    }
  };
};

export const getDebtorStakeHolderColumnNameList = () => {
  return async dispatch => {
    try {
      const params = {
        columnFor: 'stakeholder',
      };
      const response = await DebtorStakeHolderApiServices.getDebtorStakeHolderColumnNameList(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.DEBTOR_STAKE_HOLDER_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.DEBTOR_STAKE_HOLDER_DEFAULT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeDebtorStakeHolderColumnListStatus = data => {
  return async dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.UPDATE_DEBTOR_STAKE_HOLDER_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveDebtorStakeHolderColumnNameList = ({ debtorsStakeHolderColumnNameList = {}, isReset = false }) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(`viewDebtorStakeHolderColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
      let data = {
        isReset: true,
        columns: [],
        columnFor: 'stakeholder',
      };
      if (!isReset) {
        const defaultFields = debtorsStakeHolderColumnNameList.defaultFields.filter(e => e.isChecked).map(e => e.name);
        const customFields = debtorsStakeHolderColumnNameList.customFields.filter(e => e.isChecked).map(e => e.name);
        data = {
          ...data,
          isReset: false,
          columns: [...defaultFields, ...customFields],
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopGeneralLoaderOnSuccessOrFail(
            `viewDebtorStakeHolderColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`,
          );
          throw Error();
        }
      }
      const response = await DebtorStakeHolderApiServices.updateDebtorStakeHolderColumnNameList(data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.DEBTOR_STAKE_HOLDER_DEFAULT_COLUMN_LIST_ACTION,
          data: debtorsStakeHolderColumnNameList,
        });
        successNotification(response?.data?.message || 'Columns updated successfully');
        stopGeneralLoaderOnSuccessOrFail(`viewDebtorStakeHolderColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`viewDebtorStakeHolderColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

export const changeStakeHolderPersonType = personType => {
  return dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.CHANGE_DEBTOR_STAKE_HOLDER_PERSON_TYPE,
      personType,
    });
  };
};

export const updateStakeHolderDetail = (name, value) => {
  return dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.UPDATE_STAKE_HOLDER_FIELDS,
      name,
      value,
    });
  };
};

export const getStakeHolderDropDownData = () => {
  return async dispatch => {
    try {
      const response = await DebtorStakeHolderApiServices.StakeHolderCRUD.getStakeHolderDropdownData();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.GET_STAKEHOLDER_DROPDOWN_DATA,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getstakeholderCountryDataFromABNorACN = params => {
  return async () => {
    try {
      const response = await DebtorStakeHolderApiServices.StakeHolderCRUD.getstakeholderCountryDataFromABNorACN(params);

      if (response?.data?.status === 'SUCCESS') {
        return response.data.data;
      }
    } catch (e) {
      displayErrors(e);
      throw Error();
    }
    return null;
  };
};

export const updateStakeHolderDataOnValueSelected = data => {
  return dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.UPDATE_STAKE_HOLDER_COMPANY_ALL_DATA,
      data,
    });
  };
};

export const searchstakeholderCountryEntityName = params => {
  return async dispatch => {
    try {
      dispatch({
        type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.STAKE_HOLDER_ENTITY_TYPE_DATA,
        data: {
          isLoading: params?.page === 0 && true,
          error: false,
          errorMessage: '',
        },
      });
      const response = await DebtorStakeHolderApiServices.StakeHolderCRUD.searchstakeholderCountryEntityName(params);

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.STAKE_HOLDER_ENTITY_TYPE_DATA,
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
        if (e.response?.data?.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response?.data?.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else {
          dispatch({
            type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.STAKE_HOLDER_ENTITY_TYPE_DATA,
            data: {
              isLoading: false,
              error: true,
              errorMessage: e.response.data.message ?? 'Please try again later.',
              data: [],
            },
          });
        }
      } else {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.STAKE_HOLDER_ENTITY_TYPE_DATA,
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

export const resetEntityTableData = () => {
  return dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.WIPE_OUT_ENTITY_TABLE_DATA,
    });
  };
};

export const addNewStakeHolder = (id, data, cb) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(`viewDebtorAddNewStakeHolderButtonLoaderAction`);
      const response = await DebtorStakeHolderApiServices.StakeHolderCRUD.addNewStakeHolder(id, data);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Stakeholder created successfully');
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.RESET_STAKE_HOLDER_STATE,
        });
        stopGeneralLoaderOnSuccessOrFail(`viewDebtorAddNewStakeHolderButtonLoaderAction`);
        cb();
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`viewDebtorAddNewStakeHolderButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

export const updateStakeHolder = (debtorId, stakeHolderId, data, cb) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(`viewDebtorUpdateStakeHolderButtonLoaderAction`);
      const response = await DebtorStakeHolderApiServices.StakeHolderCRUD.updateStakeHolder(
        debtorId,
        stakeHolderId,
        data,
      );
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Stakeholder updated successfully');
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.RESET_STAKE_HOLDER_STATE,
        });
        stopGeneralLoaderOnSuccessOrFail(`viewDebtorUpdateStakeHolderButtonLoaderAction`);
        cb();
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`viewDebtorUpdateStakeHolderButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

export const deleteStakeHolderDetails = (stakeHolderId, cb) => {
  return async () => {
    try {
      startGeneralLoaderOnRequest(`viewDebtorDeleteStakeHolderButtonLoaderAction`);
      const response = await DebtorStakeHolderApiServices.StakeHolderCRUD.deleteStakeHolder(stakeHolderId);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Stakeholder deleted successfully');
        stopGeneralLoaderOnSuccessOrFail(`viewDebtorDeleteStakeHolderButtonLoaderAction`);
        cb();
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`viewDebtorDeleteStakeHolderButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

export const getStakeHolderDetails = id => {
  return async dispatch => {
    try {
      const response = await DebtorStakeHolderApiServices.StakeHolderCRUD.getStakeHolderDetails(id);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.GET_STAKE_HOLDER_DETAILS,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const setViewDebtorActiveTabIndex = index => {
  store.dispatch({
    type: DEBTORS_REDUX_CONSTANTS.VIEW_DEBTOR_ACTIVE_TAB_INDEX,
    index,
  });
};
// Reports
export const getDebtorReportsListData = (id, param) => {
  return async dispatch => {
    try {
      const response = await DebtorsReportsApiServices.getDebtorsReportListData(id, param);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.REPORTS.FETCH_DEBTOR_REPORTS_LIST_SUCCESS,
          data: response.data.data,
        });
      }
    } catch (e) {
      dispatch({
        type: DEBTORS_REDUX_CONSTANTS.REPORTS.FETCH_DEBTOR_REPORTS_LIST_FAILURE,
        data: null,
      });
      displayErrors(e);
    }
  };
};

export const getDebtorReportsColumnNameList = () => {
  return async dispatch => {
    try {
      const response = await DebtorsReportsApiServices.getDebtorReportColumnNameList();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.REPORTS.DEBTOR_REPORTS_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.REPORTS.DEBTOR_REPORTS_DEFAULT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeDebtorReportsColumnListStatus = data => {
  return async dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.REPORTS.UPDATE_DEBTOR_REPORTS_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveDebtorReportsColumnNameList = ({ debtorsReportsColumnNameList = {}, isReset = false }) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(`viewDebtorReportColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
      let data = {
        isReset: true,
        columns: [],
        // columnFor: 'debtor-application',
      };
      if (!isReset) {
        const defaultFields = debtorsReportsColumnNameList.defaultFields.filter(e => e.isChecked).map(e => e.name);
        const customFields = debtorsReportsColumnNameList.customFields.filter(e => e.isChecked).map(e => e.name);
        data = {
          ...data,
          isReset: false,
          columns: [...defaultFields, ...customFields],
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopGeneralLoaderOnSuccessOrFail(`viewDebtorReportColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
          throw Error();
        }
      }

      const response = await DebtorsReportsApiServices.updateDebtorReportColumnNameList(data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.REPORTS.DEBTOR_REPORTS_DEFAULT_COLUMN_LIST_ACTION,
          data: debtorsReportsColumnNameList,
        });
        successNotification(response?.data?.message || 'Columns updated successfully');
        stopGeneralLoaderOnSuccessOrFail(`viewDebtorReportColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`viewDebtorReportColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

export const getDebtorReportsListForFetch = id => {
  return async dispatch => {
    try {
      const response = await DebtorsReportsApiServices.getDebtorsReportListDataForFetch(id);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.REPORTS.FETCH_DEBTOR_REPORTS_LIST_DATA_FOR_FETCH,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
export const fetchSelectedReportsForDebtor = data => {
  return async () => {
    try {
      startGeneralLoaderOnRequest('viewDebtorFetchReportButtonLoaderAction');
      const response = await DebtorsReportsApiServices.fetchSelectedReportsForDebtor(data);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message ?? 'Reports fetched successfully');
        stopGeneralLoaderOnSuccessOrFail('viewDebtorFetchReportButtonLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('viewDebtorFetchReportButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const resetDebtorListData = () => {
  return dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.RESET_DEBTOR_LIST_DATA,
    });
  };
};

export const downloadReportForDebtor = async id => {
  try {
    const response = await DebtorsApiServices.debtorReportsApi.downloadDebtorReport(id);
    if (response) {
      return response;
    }
  } catch (e) {
    displayErrors(e);
  }
  return false;
};

export const resetViewDebtorData = () => {
  return dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.RESET_DEBTOR_VIEW_DATA,
    });
  };
};

// overdue
export const getDebtorOverdueList = (param, id) => {
  return async dispatch => {
    try {
      const params = {
        entityType: 'debtor',
        ...param,
      };
      startGeneralLoaderOnRequest('debtorOverdueListPageLoaderAction');
      const response = await DebtorOverdueApiServices.getDebtorOverdueList(params, id);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.DEBTOR_OVERDUE.GET_DEBTOR_OVERDUE_LIST,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('debtorOverdueListPageLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('debtorOverdueListPageLoaderAction');
      displayErrors(e);
    }
  };
};

export const getDebtorOverdueEntityDetails = () => {
  return async dispatch => {
    try {
      const response = await DebtorOverdueApiServices.getDebtorOverdueEntityListData();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.DEBTOR_OVERDUE.GET_DEBTOR_OVERDUE_ENTITY_LIST,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const resetDebtorOverdueListData = () => {
  return dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.DEBTOR_OVERDUE.RESET_DEBTOR_OVERDUE_LIST_DATA,
    });
  };
};

export const debtorDownloadAction = async filters => {
  startGeneralLoaderOnRequest('debtorDownloadButtonLoaderAction');
  try {
    const response = await DebtorsApiServices.downloadDebtorList({ ...filters });
    if (response?.statusText === 'OK') {
      stopGeneralLoaderOnSuccessOrFail(`debtorDownloadButtonLoaderAction`);
      return response;
    }
  } catch (e) {
    stopGeneralLoaderOnSuccessOrFail(`debtorDownloadButtonLoaderAction`);
    displayErrors(e);
  }
  return false;
};

// alerts
export const getDebtorsAlertsListData = (id, params) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('debtorAlertListLoader');
      const response = await DebtorAlertsApiServices.getAlertsListData(id, params);
      if (response?.data?.status === 'SUCCESS') {
        stopGeneralLoaderOnSuccessOrFail('debtorAlertListLoader');
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.ALERTS.FETCH_DEBTOR_ALERTS_LIST,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('debtorAlertListLoader');
      displayErrors(e);
    }
  };
};

export const getDebtorAlertsDetail = id => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('debtorAlertDetailsLoader');
      const response = await DebtorAlertsApiServices.getDebtorAlertsDetails(id);
      if (response?.data?.status === 'SUCCESS') {
        stopGeneralLoaderOnSuccessOrFail('debtorAlertDetailsLoader');
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.ALERTS.GET_DEBTOR_ALERTS_DETAILS,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('debtorAlertDetailsLoader');
      displayErrors(e);
    }
  };
};

export const clearAlertDetails = () => {
  return dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.ALERTS.CLEAR_DEBTOR_ALERTS_DETAILS,
    });
  };
};

export const downloadCreditLimitDecisionLetter = id => {
  return async () => {
    try {
      startGeneralLoaderOnRequest('decisionLetterDownloadButtonLoaderAction');
      const response = await DebtorCreditLimitApiServices.downloadCreditLimitDecisionLetter(id);
      if (response?.statusText === 'OK') {
        stopGeneralLoaderOnSuccessOrFail(`decisionLetterDownloadButtonLoaderAction`);
        return response;
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('decisionLetterDownloadButtonLoaderAction');
      if (e?.response?.statusText === 'Bad Request') {
        errorNotification('No decision letter found');
      }
      throw Error();
    }
    return false;
  };
};

export const getDebtorTaskDropDownDataBySearch = options => {
  return async dispatch => {
    try {
      const response = await DashboardApiService.getEntitiesBySearch({
        ...options,
        isForRisk: true,
      });

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.DEBTOR_ENTITY_DROP_DOWN_DATA_ACTION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const generateRandomRegistrationNumberForDebtorStakeholder = () => {
  return async dispatch => {
    try {
      const response = await DebtorsCompanyStepApiServices.generateRandomRegistrationNumber();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.GENERATE_RANDOM_REGISTRATION_NUMBER_FOR_STAKEHOLDER,
          data: response.data.data,
        });
        return response.data.data;
      }
    } catch (e) {
      displayErrors(e);
    }
    return false;
  };
};

export const updateEditDebtorField = (stepName, name, value) => {
  return dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.EDIT_DEBTOR.DEBTOR_COMPANY_EDIT_DEBTOR_UPDATE_FIELD,
      stepName,
      name,
      value,
    });
  };
};

export const changeEditDebtorFieldValue = (name, value) => {
  return dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.EDIT_DEBTOR.DEBTOR_COMPANY_EDIT_DEBTOR_CHANGE_FIELD_VALUE,
      name,
      value,
    });
  };
};

export const saveDebtorStepDataToBackend = data => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('generateDebtorsSaveAndNextButtonLoaderAction');
      const response = await DebtorsApiServices.saveDebtorStepDataToBackend(data);
      if (response?.data?.status === 'SUCCESS') {
        if (response?.data?.data?.debtorStage) {
          const { _id } = response?.data?.data;
          dispatch(changeEditDebtorFieldValue('_id', _id));
        }
        successNotification(response?.data?.message || 'Debtors step saved successfully');
        stopGeneralLoaderOnSuccessOrFail('generateDebtorsSaveAndNextButtonLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('generateDebtorsSaveAndNextButtonLoaderAction');
      if (e?.response?.data?.messageCode === 'ENTITY_TYPE_CHANGED') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.COMPANY.ENTITY_TYPE_CHANGED,
          data: { data, openModal: true },
        });
      } else displayErrors(e);
      throw Error();
    }
  };
};

export const updateEditDebtorData = (stepName, data) => {
  return dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.EDIT_DEBTOR.DEBTOR_COMPANY_EDIT_DEBTOR_UPDATE_ALL_DATA,
      stepName,
      data,
    });
  };
};

export const generateRandomRegistrationNumber = params => {
  return async dispatch => {
    try {
      const response = await DebtorsCompanyStepApiServices.generateRandomRegistrationNumber(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.COMPANY.SET_RANDOM_GENERATED_REGISTRATION_NUMBER,
          data: response.data.data,
        });
        return response.data.data;
      }
    } catch (e) {
      displayErrors(e);
    }
    return false;
  };
};

export const getDebtorCompanyDataFromABNOrACN = params => {
  return async dispatch => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await DebtorsCompanyStepApiServices.getApplicationCompanyDataFromABNorACN({
        ...params,
        step: 'company',
      });

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.COMPANY.DEBTOR_COMPANY_WIPE_OUT_OLD_DATA_ON_SUCCESS,
        });
        return response.data;
      }
    } catch (e) {
      displayErrors(e);
      throw e;
    }
    return null;
  };
};

export const getDebtorCompanyDataFromDebtor = (id, params) => {
  return async dispatch => {
    // eslint-disable-next-line no-useless-catch
    try {
      const finalParams = {
        ...params,
        requestFrom: 'application',
      };
      const response = await DebtorsCompanyStepApiServices.getApplicationCompanyDataFromDebtor(id, finalParams);

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.COMPANY.DEBTOR_COMPANY_WIPE_OUT_OLD_DATA_ON_SUCCESS,
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

export const getDebtorCompanyDropDownData = () => {
  return async dispatch => {
    try {
      const response = await DebtorsCompanyStepApiServices.getDebtorsCompanyStepDropdownData();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.COMPANY.DEBTOR_COMPANY_DROP_DOWN_DATA,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getDebtorCompanyStepDropDownDataBySearch = options => {
  return async dispatch => {
    try {
      const response = await DashboardApiService.getEntitiesBySearch({
        ...options,
        isForRisk: true,
      });

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.COMPANY.DEBTOR_SEARCH_DROP_DOWN_DATA,
          data: response?.data?.data,
          name: options.entityType,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getDebtorDetail = debtorId => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('generateDebtorPageLoaderAction');
      const response = await DebtorsApiServices.getDebtorDetail(debtorId);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.DEBTOR_DETAILS,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('generateDebtorPageLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('generateDebtorPageLoaderAction');
      displayErrors(e);
    }
  };
};

export const getDebtorDocumentDataList = id => {
  return async dispatch => {
    try {
      const param = {
        documentFor: 'debtor',
        requestFrom: 'debtor',
      };
      const response = await DebtorsDocumentApiServices.getDebtorDocumentsList(id, param);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.DOCUMENTS.DEBTOR_DOCUMENT_GET_UPLOAD_DOCUMENT_DATA,
          data: response?.data?.data && response?.data?.data.docs ? response?.data?.data.docs : [],
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getDebtorFilter = () => {
  return async dispatch => {
    try {
      const response = await DebtorsApiServices.getDebtorFilter();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_FILTER_LIST_REDUX_CONSTANTS.DEBTOR_FILTER_LIST_ACTION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const resetEditDebtorFieldValue = {
  type: DEBTORS_REDUX_CONSTANTS.EDIT_DEBTOR.DEBTOR_COMPANY_EDIT_DEBTOR_RESET_DATA,
};

export const searchDebtorCompanyEntityName = params => {
  return async dispatch => {
    try {
      dispatch({
        type: DEBTORS_REDUX_CONSTANTS.COMPANY.DEBTOR_COMPANY_ENTITY_TYPE_DATA,
        data: {
          isLoading: params?.page === 0 && true,
          error: false,
          errorMessage: '',
        },
      });
      const response = await DebtorsCompanyStepApiServices.searchDebtorsCompanyEntityName(params);

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.COMPANY.DEBTOR_COMPANY_ENTITY_TYPE_DATA,
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
            type: DEBTORS_REDUX_CONSTANTS.COMPANY.DEBTOR_COMPANY_ENTITY_TYPE_DATA,
            data: {
              isLoading: false,
              error: true,
              errorMessage: e.response.data.message ?? 'Please try again later.',
            },
          });
        }
      } else {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.COMPANY.DEBTOR_COMPANY_ENTITY_TYPE_DATA,
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
      type: DEBTORS_REDUX_CONSTANTS.PERSON.ADD_DEBTOR_PERSON,
      data,
    });
  };
};
