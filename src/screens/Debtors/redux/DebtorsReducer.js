import {
  DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS,
  DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS,
  DEBTORS_REDUX_CONSTANTS,
} from './DebtorsReduxConstants';

const initialDebtorState = {
  debtorsList: { docs: [], total: 1, limit: 15, page: 1, pages: 1, isLoading: true, error: null },

  viewDebtorActiveTabIndex: 0,

  notes: {
    notesList: { docs: [], total: 1, limit: 15, page: 1, pages: 1, isLoading: true, error: null },
  },
  debtorsColumnNameList: {},
  debtorsDefaultColumnNameList: {},
  selectedDebtorData: {},
  dropdownData: {
    streetType: [],
    australianStates: [],
    entityType: [],
  },
  documents: {
    documentsList: {
      docs: [],
      total: 0,
      limit: 0,
      page: 1,
      pages: 1,
      isLoading: true,
      error: null,
    },
    debtorsDocumentColumnNameList: {},
    debtorsDocumentDefaultColumnNameList: {},
    documentTypeList: [],
    uploadDocumentData: { docs: [], total: 1, limit: 15, page: 1, pages: 1 },
  },
  task: {
    taskList: { docs: [], total: 1, limit: 15, page: 1, pages: 1, isLoading: true, error: null },
    debtorsTaskColumnNameList: {},
    debtorsTaskDefaultColumnNameList: {},
    addTask: {
      title: '',
      description: '',
      priority: [],
      entityType: [],
      entityId: [],
      assigneeId: [],
      dueDate: '',
      taskFrom: 'debtor-task',
    },
    dropDownData: {
      assigneeList: [],
      entityList: [],
      defaultEntityList: [],
    },
  },
  application: {
    applicationList: {
      docs: [],
      total: 0,
      limit: 0,
      page: 1,
      pages: 1,
      isLoading: true,
      error: null,
    },
    debtorsApplicationColumnNameList: {},
    debtorsApplicationDefaultColumnNameList: {},
  },
  creditLimit: {
    creditLimitList: {
      docs: [],
      total: 0,
      limit: 0,
      page: 1,
      pages: 1,
      isLoading: true,
      error: null,
    },
    debtorsCreditLimitColumnNameList: {},
    debtorsCreditLimitDefaultColumnNameList: {},
  },
  stakeHolder: {
    stakeHolderList: {
      docs: [],
      total: 0,
      limit: 0,
      page: 1,
      pages: 1,
      isLoading: true,
      error: null,
    },
    debtorsStakeHolderColumnNameList: {},
    debtorsStakeHolderDefaultColumnNameList: {},
    stakeHolderDetails: {
      type: 'individual',
      abn: '',
      acn: '',
      entityType: '',
      entityName: '',
      tradingName: '',
      stakeholderCountry: '',
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
    },
    entityNameSearch: {
      isLoading: false,
      error: false,
      errorMessage: '',
      data: [],
      hasMoreData: false,
    },
    stakeHolderDropDownData: {
      clients: [],
      debtors: [],
      streetType: [],
      australianStates: [],
      newZealandStates: [],
      entityType: [],
      countryList: [],
    },
  },
  reports: {
    reportsList: {
      docs: [],
      total: 0,
      limit: 0,
      page: 1,
      pages: 1,
      isLoading: true,
      error: null,
    },
    reportsListForFetch: [],
    debtorsReportsColumnNameList: {},
    debtorsReportsDefaultColumnNameList: {},
  },
  overdue: {
    overdueList: {},
    entityList: {},
  },
  alerts: {
    alertsList: {},
    alertDetail: {},
  },
  editDebtor: {
    debtorStage: 0,
    _id: '',
    entityType: '',
    company: {
      onEntityChange: { data: {}, openModal: false },
      clientId: [],
      postCode: '',
      state: [],
      country: {
        label: 'Australia',
        name: 'country',
        value: 'AUS',
      },
      suburb: '',
      streetType: [],
      streetName: '',
      streetNumber: '',
      unitNumber: '',
      property: '',
      address: '',
      entityType: [],
      phoneNumber: '',
      entityName: [],
      acn: '',
      abn: '',
      tradingName: '',
      debtorId: [],
      clientList: [],
      wipeOutDetails: false,
      registrationNo: '',
      errors: {},
      isActive: true,
    },
    documents: {
      documentTypeList: { docs: [], total: 1, limit: 15, page: 1, pages: 1 },
      uploadDocumentDebtorData: [],
    },
  },
  companyData: {
    dropdownData: {
      clients: [],
      debtors: [],
      streetType: [],
      australianStates: [],
      newZealandStates: [],
      entityType: [],
      countryList: [],
    },
    entityNameSearch: {
      isLoading: false,
      error: false,
      errorMessage: '',
      data: [],
      hasMoreData: false,
    },
  },
};

export const debtorsManagement = (state = initialDebtorState, action) => {
  switch (action.type) {
    case DEBTORS_REDUX_CONSTANTS.FETCH_DEBTOR_LIST_REQUEST:
      return {
        ...state,
        debtorsList: { ...state?.debtorsList, isLoading: true, error: null },
      };
    case DEBTORS_REDUX_CONSTANTS.FETCH_DEBTOR_LIST_SUCCESS:
      return {
        ...state,
        debtorsList: { ...state?.debtorsList, ...action?.data, isLoading: false, error: null },
      };
    case DEBTORS_REDUX_CONSTANTS.FETCH_DEBTOR_LIST_FAILURE:
      return {
        ...state,
        debtorsList: { ...state?.debtorsList, isLoading: false, error: null },
      };

    // edit debtor
    case DEBTORS_REDUX_CONSTANTS.EDIT_DEBTOR.DEBTOR_COMPANY_EDIT_DEBTOR_CHANGE_FIELD_VALUE:
      return {
        ...state,
        editDebtor: {
          ...state?.editDebtor,
          [action?.name]: action?.value,
        },
      };
    case DEBTORS_REDUX_CONSTANTS.EDIT_DEBTOR.DEBTOR_COMPANY_EDIT_DEBTOR_RESET_DATA: {
      return {
        ...state,
        editDebtor: {
          ...initialDebtorState?.editDebtor,
        },
      };
    }
    case DEBTORS_REDUX_CONSTANTS.EDIT_DEBTOR.DEBTOR_COMPANY_EDIT_DEBTOR_UPDATE_ALL_DATA:
      return {
        ...state,
        editDebtor: {
          ...state?.editDebtor,
          [action?.stepName]: { ...state?.editDebtor?.[action.stepName], ...action?.data },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.EDIT_DEBTOR.DEBTOR_COMPANY_EDIT_DEBTOR_UPDATE_FIELD:
      return {
        ...state,
        editDebtor: {
          ...state?.editDebtor,
          [action?.stepName]: {
            ...state?.editDebtor?.[action?.stepName],
            [action?.name]: action?.value,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.DEBTOR_DETAILS:
      return {
        ...state,
        editDebtor: { ...state?.editDebtor, ...action?.data },
      };

    case DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.DEBTORS_MANAGEMENT_COLUMN_LIST_ACTION:
      return {
        ...state,
        debtorsColumnNameList: action?.data,
      };
    case DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.DEBTORS_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION:
      return {
        ...state,
        debtorsDefaultColumnNameList: action?.data,
      };

    case DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_DEBTORS_MANAGEMENT_COLUMN_LIST_ACTION: {
      const debtorsColumnNameList = {
        ...state?.debtorsColumnNameList,
      };
      const { type, name, value } = action?.data;
      debtorsColumnNameList[`${type}`] = debtorsColumnNameList[`${type}`].map(e =>
        e.name === name ? { ...e, isChecked: value } : e
      );
      return {
        ...state,
        debtorsColumnNameList,
      };
    }
    case DEBTORS_REDUX_CONSTANTS.DEBTOR_LIST_RESET_PAGINATION_DATA:
      return {
        ...state,
        debtorsList: {
          ...state?.debtorsList,
          page: action?.page,
          pages: action?.pages,
          total: action?.total,
          limit: action?.limit,
          docs: [],
        },
      };
    case DEBTORS_REDUX_CONSTANTS.SELECTED_DEBTORS_DATA:
      return {
        ...state,
        selectedDebtorData: action?.data,
        duplicateSelectedDebtorData: {
          tradingName: action?.data?.tradingName,
          property: action?.data?.property,
          streetNumber: action?.data?.streetNumber,
          streetType: action?.data?.streetType,
          postCode: action?.data?.postCode,
          contactNumber: action?.data?.contactNumber,
          unitNumber: action?.data?.unitNumber,
          streetName: action?.data?.streetName,
          suburb: action?.data?.suburb,
        },
      };

    case DEBTORS_REDUX_CONSTANTS.DEBTOR_UNDO_SELECTED_USER_DATA_ON_CLOSE:
      return {
        ...state,
        selectedDebtorData: {
          ...state?.selectedDebtorData,
          tradingName: state?.duplicateSelectedDebtorData?.tradingName,
          property: state?.duplicateSelectedDebtorData?.property,
          streetNumber: state?.duplicateSelectedDebtorData?.streetNumber,
          streetType: state?.duplicateSelectedDebtorData?.streetType,
          postCode: state?.duplicateSelectedDebtorData?.postCode,
          contactNumber: state?.duplicateSelectedDebtorData?.contactNumber,
          unitNumber: state?.duplicateSelectedDebtorData?.unitNumber,
          streetName: state?.duplicateSelectedDebtorData?.streetName,
          suburb: state?.duplicateSelectedDebtorData?.suburb,
        },
      };

    case DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS.DEBTORS_MANAGEMENT_DROPDOWN_LIST_REDUX_CONSTANTS: {
      const dropdownData = { ...state?.dropdownData };
      // eslint-disable-next-line no-shadow
      Object.entries(action?.data)?.forEach(([key, value]) => {
        dropdownData[key] = value?.data?.map(entity => ({
          label: entity?.name ?? entity?.label,
          name: value?.field,
          value: entity?._id ?? entity?.value,
        }));
      });
      return {
        ...state,
        dropdownData,
      };
    }
    case DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS.DEBTOR_MANAGEMENT_UPDATE_DEBTOR_ACTION:
      return {
        ...state,
        selectedDebtorData: {
          ...state?.selectedDebtorData,
          [`${action.name}`]: action?.value,
        },
      };
    // DEBTORS NOTES

    case DEBTORS_REDUX_CONSTANTS.NOTES.FETCH_DEBTOR_NOTES_LIST_SUCCESS:
      return {
        ...state,
        notes: {
          ...state?.notes,
          notesList: {
            ...state?.notes?.notesList,
            ...action?.data,
            isLoading: false,
            error: null,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.NOTES.FETCH_DEBTOR_NOTES_LIST_FAILURE:
      return {
        ...state,
        notes: {
          ...state?.notes,
          notesList: {
            ...state?.notes?.notesList,
            isLoading: false,
            error: action?.data,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.NOTES.DEBTORS_NOTES_LIST_USER_ACTION:
      return {
        ...state,
        notes: {
          ...state?.notes,
          notesList: action?.data,
        },
      };

    /** documents section */

    case DEBTORS_REDUX_CONSTANTS.DOCUMENTS.FETCH_DEBTOR_DOCUMENTS_LIST_SUCCESS:
      return {
        ...state,
        documents: {
          ...state?.documents,
          documentsList: {
            ...state?.documents?.documentsList,
            ...action?.data,
            isLoading: false,
            error: null,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.DOCUMENTS.FETCH_DEBTOR_DOCUMENTS_LIST_FAILURE:
      return {
        ...state,
        documents: {
          ...state?.documents,
          documentsList: {
            ...state?.documents?.documentsList,
            isLoading: false,
            error: action?.data,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.DOCUMENTS.DEBTOR_DOCUMENTS_LIST_USER_ACTION:
      return {
        ...state,
        documents: {
          ...state?.documents,
          documentsList: action?.data,
        },
      };

    case DEBTORS_REDUX_CONSTANTS.DOCUMENTS.DEBTOR_DOCUMENTS_MANAGEMENT_COLUMN_LIST_ACTION: {
      return {
        ...state,
        documents: {
          ...state?.documents,
          debtorsDocumentColumnNameList: action?.data,
        },
      };
    }

    case DEBTORS_REDUX_CONSTANTS.DOCUMENTS.DEBTOR_DOCUMENTS_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION: {
      return {
        ...state,
        documents: {
          ...state?.documents,
          debtorsDocumentDefaultColumnNameList: action?.data,
        },
      };
    }

    case DEBTORS_REDUX_CONSTANTS.DOCUMENTS.UPDATE_DEBTOR_DOCUMENTS_COLUMN_LIST_ACTION: {
      const debtorsDocumentColumnNameList = {
        ...state?.documents?.debtorsDocumentColumnNameList,
      };

      // eslint-disable-next-line no-shadow
      const { type, name, value } = action?.data;

      debtorsDocumentColumnNameList[`${type}`] = debtorsDocumentColumnNameList[`${type}`].map(e =>
        e.name === name
          ? {
              ...e,
              isChecked: value,
            }
          : e
      );
      return {
        ...state,
        documents: {
          ...state?.documents,
          debtorsDocumentColumnNameList,
        },
      };
    }

    case DEBTORS_REDUX_CONSTANTS.DOCUMENTS.DEBTOR_DOCUMENT_TYPE_LIST_USER_ACTION: {
      return {
        ...state,
        documents: {
          ...state?.documents,
          documentTypeList: action?.data,
        },
      };
    }
    // Documents
    case DEBTORS_REDUX_CONSTANTS.DOCUMENTS.DOCUMENT_TYPE_LIST_DATA:
      return {
        ...state,
        editDebtor: {
          ...state?.editDebtor,
          documents: {
            ...state?.editDebtor?.documents,
            documentTypeList: action?.data,
          },
        },
      };

    case DEBTORS_REDUX_CONSTANTS.DOCUMENTS.UPLOAD_DOCUMENT_DEBTOR_ACTION: {
      const editDebtor = { ...state?.editDebtor };
      const documents = { ...editDebtor?.documents };
      const uploadDocumentDebtorData = [...documents?.uploadDocumentDebtorData];

      return {
        ...state,
        editDebtor: {
          ...editDebtor,
          documents: {
            ...documents,
            // uploadDocumentDebtorData,
            uploadDocumentDebtorData: [...uploadDocumentDebtorData, action?.data],
          },
        },
        // documents: {
        //   ...state?.documents,
        //   uploadDocumentData: action?.data,
        // },
      };
    }

    // tasks

    case DEBTORS_REDUX_CONSTANTS.TASK.FETCH_DEBTOR_TASK_LIST_SUCCESS:
      return {
        ...state,
        task: {
          ...state?.task,
          taskList: {
            ...state?.task?.taskList,
            ...action?.data,
            isLoading: false,
            error: null,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.TASK.FETCH_DEBTOR_TASK_LIST_FAILURE:
      return {
        ...state,
        task: {
          ...state?.task,
          taskList: {
            ...state?.task?.taskList,
            isLoading: false,
            error: action?.data,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.TASK.DEBTOR_TASK_LIST_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          taskList: action?.data,
        },
      };

    case DEBTORS_REDUX_CONSTANTS.TASK.DEBTOR_TASK_COLUMN_NAME_LIST_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          debtorsTaskColumnNameList: action?.data,
        },
      };
    case DEBTORS_REDUX_CONSTANTS.TASK.DEBTOR_TASK_DEFAULT_COLUMN_NAME_LIST_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          debtorsTaskDefaultColumnNameList: action?.data,
        },
      };

    case DEBTORS_REDUX_CONSTANTS.TASK.UPDATE_DEBTOR_TASK_COLUMN_NAME_LIST_ACTION: {
      const debtorsTaskColumnNameList = {
        ...state?.task?.debtorsTaskColumnNameList,
      };
      // eslint-disable-next-line no-shadow
      const { name, type, value } = action?.data;
      debtorsTaskColumnNameList[`${type}`] = debtorsTaskColumnNameList[`${type}`].map(e =>
        e.name === name ? { ...e, isChecked: value } : e
      );
      return {
        ...state,
        task: {
          ...state?.task,
          debtorsTaskColumnNameList,
        },
      };
    }
    case DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.DEBTOR_UPDATE_ADD_TASK_FIELD_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          addTask: {
            ...state?.task?.addTask,
            [action?.name]: action?.value,
          },
        },
      };

    case DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.DEBTOR_ASSIGNEE_DROP_DOWN_DATA_ACTION: {
      const assigneeList = action?.data?.map(data => ({
        label: data?.name,
        value: data?._id,
        name: 'assigneeId',
        type: data?.type,
      }));
      return {
        ...state,
        task: {
          ...state?.task,
          dropDownData: {
            ...state?.task?.dropDownData,
            assigneeList,
          },
        },
      };
    }

    case DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.DEBTOR_ENTITY_DROP_DOWN_DATA_ACTION: {
      const entityList = action?.data?.map(data => ({
        label: data?.name ?? data?.applicationId,
        value: data?._id,
        name: 'entityId',
      }));
      return {
        ...state,
        task: {
          ...state?.task,
          dropDownData: {
            ...state?.task?.dropDownData,
            entityList,
          },
        },
      };
    }

    case DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.DEBTOR_DEFAULT_DEBTOR_ENTITY_DROP_DOWN_DATA_ACTION: {
      const defaultEntityList = action?.data?.map(data => ({
        label: data?.name ?? data?.applicationId,
        value: data?._id,
        name: 'entityId',
      }));
      return {
        ...state,
        task: {
          ...state?.task,
          dropDownData: {
            ...state?.task?.dropDownData,
            defaultEntityList,
          },
        },
      };
    }

    case DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.DEBTOR_RESET_ADD_TASK_STATE_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          addTask: {
            title: '',
            description: '',
            priority: [],
            entityType: [],
            entityId: [],
            assigneeId: [],
            dueDate: '',
            taskFrom: 'debtor-task',
          },
        },
      };

    case DEBTORS_REDUX_CONSTANTS.TASK.EDIT_TASK.GET_DEBTOR_TASK_DETAILS_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          addTask: action?.data,
        },
      };

    // application

    case DEBTORS_REDUX_CONSTANTS.APPLICATION.FETCH_DEBTOR_APPLICATION_LIST_SUCCESS:
      return {
        ...state,
        application: {
          ...state?.application,
          applicationList: {
            ...state?.application?.applicationList,
            ...action?.data,
            isLoading: false,
            error: null,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.APPLICATION.FETCH_DEBTOR_APPLICATION_LIST_FAILURE:
      return {
        ...state,
        application: {
          ...state?.application,
          applicationList: {
            ...state?.application?.applicationList,
            isLoading: false,
            error: action?.data,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.APPLICATION.DEBTOR_APPLICATION_COLUMN_LIST_ACTION: {
      return {
        ...state,
        application: {
          ...state?.application,
          debtorsApplicationColumnNameList: action?.data,
        },
      };
    }
    case DEBTORS_REDUX_CONSTANTS.APPLICATION.DEBTOR_APPLICATION_DEFAULT_COLUMN_LIST_ACTION: {
      return {
        ...state,
        application: {
          ...state?.application,
          debtorsApplicationDefaultColumnNameList: action?.data,
        },
      };
    }
    case DEBTORS_REDUX_CONSTANTS.APPLICATION.UPDATE_DEBTOR_APPLICATION_COLUMN_LIST_ACTION: {
      const debtorsApplicationColumnNameList = {
        ...state?.application?.debtorsApplicationColumnNameList,
      };
      // eslint-disable-next-line no-shadow
      const { name, type, value } = action?.data;
      debtorsApplicationColumnNameList[`${type}`] = debtorsApplicationColumnNameList?.[
        `${type}`
      ]?.map(e => (e.name === name ? { ...e, isChecked: value } : e));
      return {
        ...state,
        application: {
          ...state?.application,
          debtorsApplicationColumnNameList,
        },
      };
    }

    // creditLimit
    case DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.FETCH_DEBTOR_CREDIT_LIMIT_LIST_SUCCESS:
      return {
        ...state,
        creditLimit: {
          ...state?.creditLimit,
          creditLimitList: {
            ...state?.creditLimit?.creditLimitList,
            ...action?.data,
            isLoading: false,
            error: null,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.FETCH_DEBTOR_CREDIT_LIMIT_LIST_FAILURE:
      return {
        ...state,
        creditLimit: {
          ...state?.creditLimit,
          creditLimitList: {
            ...state?.creditLimit?.creditLimitList,
            isLoading: false,
            error: action?.data,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.DEBTOR_CREDIT_LIMIT_LIST_ACTION: {
      return {
        ...state,
        creditLimit: {
          ...state?.creditLimit,
          creditLimitList: action?.data,
        },
      };
    }
    case DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.DEBTOR_CREDIT_LIMIT_COLUMN_LIST_ACTION: {
      return {
        ...state,
        creditLimit: {
          ...state?.creditLimit,
          debtorsCreditLimitColumnNameList: action?.data,
        },
      };
    }
    case DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.DEBTOR_CREDIT_LIMIT_DEFAULT_COLUMN_LIST_ACTION: {
      return {
        ...state,
        creditLimit: {
          ...state?.creditLimit,
          debtorsCreditLimitDefaultColumnNameList: action?.data,
        },
      };
    }
    case DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.UPDATE_DEBTOR_CREDIT_LIMIT_COLUMN_LIST_ACTION: {
      const debtorsCreditLimitColumnNameList = {
        ...state?.creditLimit?.debtorsCreditLimitColumnNameList,
      };
      // eslint-disable-next-line no-shadow
      const { type, name, value } = action?.data;
      debtorsCreditLimitColumnNameList[`${type}`] = debtorsCreditLimitColumnNameList?.[
        `${type}`
      ]?.map(e => (e.name === name ? { ...e, isChecked: value } : e));
      return {
        ...state,
        creditLimit: {
          ...state?.creditLimit,
          debtorsCreditLimitColumnNameList,
        },
      };
    }

    // application
    case DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.FETCH_DEBTOR_STAKE_HOLDER_LIST_SUCCESS:
      return {
        ...state,
        stakeHolder: {
          ...state?.stakeHolder,
          stakeHolderList: {
            ...state?.stakeHolder?.stakeHolderList,
            ...action?.data,
            isLoading: false,
            error: null,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.FETCH_DEBTOR_STAKE_HOLDER_LIST_FAILURE:
      return {
        ...state,
        stakeHolder: {
          ...state?.stakeHolder,
          stakeHolderList: {
            ...state?.stakeHolder?.stakeHolderList,
            isLoading: false,
            error: action?.data,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.DEBTOR_STAKE_HOLDER_LIST_ACTION: {
      return {
        ...state,
        stakeHolder: {
          ...state?.stakeHolder,
          stakeHolderList: action?.data,
        },
      };
    }
    case DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.DEBTOR_STAKE_HOLDER_COLUMN_LIST_ACTION: {
      return {
        ...state,
        stakeHolder: {
          ...state?.stakeHolder,
          debtorsStakeHolderColumnNameList: action?.data,
        },
      };
    }
    case DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.DEBTOR_STAKE_HOLDER_DEFAULT_COLUMN_LIST_ACTION: {
      return {
        ...state,
        stakeHolder: {
          ...state?.stakeHolder,
          debtorsStakeHolderDefaultColumnNameList: action?.data,
        },
      };
    }
    case DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.UPDATE_DEBTOR_STAKE_HOLDER_COLUMN_LIST_ACTION: {
      const debtorsStakeHolderColumnNameList = {
        ...state?.stakeHolder?.debtorsStakeHolderColumnNameList,
      };
      // eslint-disable-next-line no-shadow
      const { name, type, value } = action?.data;
      debtorsStakeHolderColumnNameList[`${type}`] = debtorsStakeHolderColumnNameList?.[
        `${type}`
      ]?.map(e => (e.name === name ? { ...e, isChecked: value } : e));
      return {
        ...state,
        stakeHolder: {
          ...state?.stakeHolder,
          debtorsStakeHolderColumnNameList,
        },
      };
    }
    case DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD
      .CHANGE_DEBTOR_STAKE_HOLDER_PERSON_TYPE:
      return {
        ...state,
        stakeHolder: {
          ...state?.stakeHolder,
          stakeHolderDetails: {
            ...state?.stakeHolder?.stakeHolderDetails,
            type: action?.personType,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.UPDATE_STAKE_HOLDER_FIELDS:
      return {
        ...state,
        stakeHolder: {
          ...state?.stakeHolder,
          stakeHolderDetails: {
            ...state?.stakeHolder?.stakeHolderDetails,
            [action?.name]: action?.value,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD
      .UPDATE_STAKE_HOLDER_COMPANY_ALL_DATA:
      return {
        ...state,
        stakeHolder: {
          ...state?.stakeHolder,
          stakeHolderDetails: {
            ...state?.stakeHolder?.stakeHolderDetails,
            tradingName: action?.data?.tradingName ?? '',
            entityType: action?.data?.entityType ?? '',
            entityName: action?.data?.entityName ?? '',
            abn: action?.data?.abn ?? '',
            acn: action?.data?.acn ?? '',
          },
        },
      };

    case DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.STAKE_HOLDER_ENTITY_TYPE_DATA: {
      let entityNameSearchData = state?.stakeHolder?.entityNameSearch?.data ?? [];
      let hasNoMoreRecords = false;

      if (action?.data?.data) {
        entityNameSearchData = [...entityNameSearchData, ...action?.data?.data];

        if (state?.stakeHolder?.entityNameSearch?.data?.length === entityNameSearchData?.length)
          hasNoMoreRecords = true;
      }

      return {
        ...state,
        stakeHolder: {
          ...state?.stakeHolder,
          entityNameSearch: {
            ...state?.stakeHolder?.entityNameSearch,
            data: entityNameSearchData,
            hasMoreData: !hasNoMoreRecords,
            isLoading: action?.data?.isLoading,
            error: action?.data?.error,
            errorMessage: action?.data?.errorMessage,
          },
        },
      };
    }

    case DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.WIPE_OUT_ENTITY_TABLE_DATA:
      return {
        ...state,
        stakeHolder: {
          ...state?.stakeHolder,
          entityNameSearch: {
            isLoading: false,
            error: false,
            errorMessage: '',
            data: [],
            hasMoreData: false,
          },
        },
      };

    case DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.GET_STAKE_HOLDER_DETAILS:
      return {
        ...state,
        stakeHolder: {
          ...state?.stakeHolder,
          stakeHolderDetails: {
            ...state?.stakeHolder?.stakeHolderDetails,
            ...action?.data,
          },
        },
      };

    case DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.RESET_STAKE_HOLDER_STATE:
      return {
        ...state,
        stakeHolder: {
          ...state.stakeHolder,
          stakeHolderDetails: {
            type: 'individual',
            abn: '',
            acn: '',
            entityType: '',
            entityName: '',
            tradingName: '',
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
          },
          entityNameSearch: {},
        },
      };

    case DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.GENERATE_RANDOM_REGISTRATION_NUMBER_FOR_STAKEHOLDER:
      return {
        ...state,
        stakeHolder: {
          ...state.stakeHolder,
          stakeHolderDetails: {
            ...state.stakeHolder.stakeHolderDetails,
            registrationNumber: action?.data,
          },
        },
      };

    case DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.GET_STAKEHOLDER_DROPDOWN_DATA: {
      const dropDownData = { ...state?.stakeHolder?.stakeHolderDropDownData };
      // eslint-disable-next-line no-shadow
      Object.entries(action?.data)?.forEach(([key, value]) => {
        dropDownData[key] = value.data.map(entity => ({
          label: entity.name ?? entity.label,
          name: value.field ?? '',
          value: entity._id ?? entity.value,
        }));
      });
      return {
        ...state,
        stakeHolder: {
          ...state?.stakeHolder,
          stakeHolderDropDownData: { ...dropDownData },
        },
      };
    }

    case DEBTORS_REDUX_CONSTANTS.VIEW_DEBTOR_ACTIVE_TAB_INDEX: {
      return {
        ...state,
        viewDebtorActiveTabIndex: action?.index,
      };
    }

    // reports
    case DEBTORS_REDUX_CONSTANTS.REPORTS.FETCH_DEBTOR_REPORTS_LIST_SUCCESS:
      return {
        ...state,
        reports: {
          ...state?.reports,
          reportsList: {
            ...state?.reports?.reportsList,
            ...action?.data,
            isLoading: false,
            error: null,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.REPORTS.FETCH_DEBTOR_REPORTS_LIST_FAILURE:
      return {
        ...state,
        reports: {
          ...state?.reports,
          reportsList: {
            ...state?.reports?.reportsList,
            isLoading: false,
            error: action?.data,
          },
        },
      };

    case DEBTORS_REDUX_CONSTANTS.REPORTS.DEBTOR_REPORTS_COLUMN_LIST_ACTION: {
      return {
        ...state,
        reports: {
          ...state?.reports,
          debtorsReportsColumnNameList: action?.data,
        },
      };
    }
    case DEBTORS_REDUX_CONSTANTS.REPORTS.DEBTOR_REPORTS_DEFAULT_COLUMN_LIST_ACTION: {
      return {
        ...state,
        reports: {
          ...state?.reports,
          debtorsReportsDefaultColumnNameList: action?.data,
        },
      };
    }
    case DEBTORS_REDUX_CONSTANTS.REPORTS.UPDATE_DEBTOR_REPORTS_COLUMN_LIST_ACTION: {
      const debtorsReportsColumnNameList = {
        ...state?.reports?.debtorsReportsColumnNameList,
      };
      // eslint-disable-next-line no-shadow
      const { name, type, value } = action?.data;
      debtorsReportsColumnNameList[`${type}`] = debtorsReportsColumnNameList?.[`${type}`]?.map(e =>
        e.name === name ? { ...e, isChecked: value } : e
      );
      return {
        ...state,
        reports: {
          ...state?.reports,
          debtorsReportsColumnNameList,
        },
      };
    }

    case DEBTORS_REDUX_CONSTANTS.REPORTS.FETCH_DEBTOR_REPORTS_LIST_DATA_FOR_FETCH: {
      return {
        ...state,
        reports: {
          ...state?.reports,
          reportsListForFetch: action?.data?.reports,
          partners: action?.data?.partners,
        },
      };
    }

    case DEBTORS_REDUX_CONSTANTS.RESET_DEBTOR_LIST_DATA:
      return {
        ...state,
        debtorsList: initialDebtorState.debtorsList,
      };

    // overdue

    case DEBTORS_REDUX_CONSTANTS.DEBTOR_OVERDUE.GET_DEBTOR_OVERDUE_LIST:
      return {
        ...state,
        overdue: {
          ...state?.overdue,
          overdueList: action?.data,
        },
      };
    case DEBTORS_REDUX_CONSTANTS.DEBTOR_OVERDUE.GET_DEBTOR_OVERDUE_ENTITY_LIST: {
      const entityList = { ...state?.overdue?.overdueDetails?.entityList };
      Object.entries(action?.data)?.forEach(([key, value]) => {
        entityList[key] = value?.map(entity => ({
          label: entity?.name,
          name: key,
          value: entity?._id,
          acn: entity?.acn,
        }));
      });
      return {
        ...state,
        overdue: {
          ...state?.overdue,
          entityList,
        },
      };
    }

    case DEBTORS_REDUX_CONSTANTS.DEBTOR_OVERDUE.RESET_DEBTOR_OVERDUE_LIST_DATA: {
      return {
        ...state,
        overdue: {
          ...state?.overdue,
          overdueList: initialDebtorState?.overdue?.overdueList,
        },
      };
    }

    case DEBTORS_REDUX_CONSTANTS.RESET_DEBTOR_VIEW_DATA:
      return {
        ...state,
        selectedDebtorData: {},
      };

    // Alerts

    case DEBTORS_REDUX_CONSTANTS.ALERTS.FETCH_DEBTOR_ALERTS_LIST:
      return {
        ...state,
        alerts: {
          ...state?.alerts,
          alertsList: action?.data,
        },
      };

    case DEBTORS_REDUX_CONSTANTS.ALERTS.GET_DEBTOR_ALERTS_DETAILS:
      return {
        ...state,
        alerts: {
          ...state?.alerts,
          alertDetail: action?.data,
        },
      };
    case DEBTORS_REDUX_CONSTANTS.DOCUMENTS.DEBTOR_DOCUMENT_GET_UPLOAD_DOCUMENT_DATA: {
      const editDebtor = { ...state?.editDebtor };
      const documents = { ...editDebtor?.documents };
      const uploadDocumentDebtorData = [...action?.data];

      return {
        ...state,
        editDebtor: {
          ...editDebtor,
          documents: {
            ...documents,
            uploadDocumentDebtorData,
          },
        },
      };
    }
    case DEBTORS_REDUX_CONSTANTS.ALERTS.CLEAR_DEBTOR_ALERTS_DETAILS:
      return {
        ...state,
        alerts: {
          ...state?.alerts,
          alertDetail: {},
        },
      };
    // Company step
    case DEBTORS_REDUX_CONSTANTS.COMPANY.DEBTOR_COMPANY_DROP_DOWN_DATA: {
      const dropdownData = { ...state?.companyData?.dropdownData };
      Object.entries(action?.data)?.forEach(([key, value]) => {
        dropdownData[key] = value.data.map(entity => ({
          label: entity.name,
          name: value.field,
          value: entity._id,
        }));
      });
      const companyData = {
        ...state?.companyData,
        dropdownData,
      };
      return {
        ...state,
        companyData,
      };
    }
    default:
      return state;
  }
};
