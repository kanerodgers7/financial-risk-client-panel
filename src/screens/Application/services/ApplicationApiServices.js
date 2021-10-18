import ApiService from '../../../services/api-service/ApiService';
import { APPLICATION_URLS } from '../../../constants/UrlConstants';

const ApplicationApiServices = {
  getApplicationListByFilter: params =>
    ApiService.getData(APPLICATION_URLS.APPLICATION_LIST_URL, { params }),
  getApplicationColumnNameList: () =>
    ApiService.getData(APPLICATION_URLS.APPLICATION_COLUMN_NAME_LIST_URL),
  updateApplicationColumnNameList: data =>
    ApiService.putData(APPLICATION_URLS.APPLICATION_COLUMN_NAME_LIST_UPDATE_URL, data),
  getApplicationFilter: params =>
    ApiService.getData(APPLICATION_URLS.APPLICATION_FILTER_LIST_URL, { params }),
  saveApplicationStepDataToBackend: data =>
    ApiService.putData(`${APPLICATION_URLS.APPLICATION_SAVE_STEP_DATA}`, data),
  getApplicationDetail: appId =>
    ApiService.getData(`${APPLICATION_URLS.GET_APPLICATION_DETAILS_URL}${appId}`),
  downloadApplicationList: params =>
    ApiService.request({
      url: `${APPLICATION_URLS.DOWNLOAD_APPLICATION}`,
      params,
      method: 'GET',
      responseType: 'blob',
      timeout: 60000,
    }),
  downloadDocument: params =>
    ApiService.request({
      url: `${APPLICATION_URLS.VIEW_APPLICATION.DOWNLOAD_DOCUMENTS_URL}`,
      params,
      method: 'GET',
      responseType: 'blob',
    }),
};
export default ApplicationApiServices;
