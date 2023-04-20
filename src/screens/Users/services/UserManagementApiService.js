import ApiService from '../../../services/api-service/ApiService';
import { ORGANISATION_MODULE_URLS, USER_MANAGEMENT_URLS } from '../../../constants/UrlConstants';

const UserManagementApiService = {
  getAllUserPrivileges: params =>
    ApiService.getData(USER_MANAGEMENT_URLS.USER_PRIVILEGES_URL, { params }),
  getUserColumnListName: () => ApiService.getData(USER_MANAGEMENT_URLS.USER_COLUMN_NAME_LIST_URL),
  getAllOrganisationModuleList: () =>
    ApiService.getData(ORGANISATION_MODULE_URLS.GET_ORGANIZATION_MODULE_LIST_URL),
  getSelectedUserData: id =>
    ApiService.getData(`${USER_MANAGEMENT_URLS.SELECTED_USER_DETAILS_URL}${id}`),
  getClientList: () => ApiService.getData(USER_MANAGEMENT_URLS.USER_CLIENT_LIST_URL),
  addNewUser: data => ApiService.postData(USER_MANAGEMENT_URLS.SELECTED_USER_DETAILS_URL, data),
  updateUser: (id, data) =>
    ApiService.putData(`${USER_MANAGEMENT_URLS.SELECTED_USER_DETAILS_URL}${id}`, data),
  deleteUser: id => ApiService.deleteData(`${USER_MANAGEMENT_URLS.SELECTED_USER_DETAILS_URL}${id}`),
  updateUserColumnListName: data =>
    ApiService.putData(USER_MANAGEMENT_URLS.UPDATE_USER_COLUMN_NAME_LIST_URL, data),
  getAllUserListByFilter: params =>
    ApiService.getData(USER_MANAGEMENT_URLS.USER_LIST_URL, { params }),
  resendMail: userId => ApiService.getData(`${USER_MANAGEMENT_URLS.RESEND_MAIL}${userId}`),
};

export default UserManagementApiService;
