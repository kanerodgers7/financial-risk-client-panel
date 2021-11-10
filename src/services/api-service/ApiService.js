/* eslint-disable no-param-reassign */
import axios from 'axios';
import { store } from '../../redux/store';
import { getAuthTokenLocalStorage } from '../../helpers/LocalStorageHelper';
import { errorNotification } from '../../common/Toast';
import { LOGIN_REDUX_CONSTANTS } from '../../screens/auth/login/redux/LoginReduxConstants';
import { HEADER_URLS } from '../../constants/UrlConstants';

const instance = axios.create({
  timeout: 10000,
  params: {}, // do not remove this, its added to add params later in the config
});

// Add a request interceptor
instance.interceptors.request.use(
  async config => {
    const token = getAuthTokenLocalStorage();

    if (token) {
      config.headers.common.authorization = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const ApiService = {
  request(config = {}) {
    return instance.request(config);
  },
  getData(url, config = {}) {
    return instance.get(url, config);
  },
  postData(url, data, config) {
    return instance.post(url, data, config);
  },
  putData(url, data, config) {
    return instance.put(url, data, config);
  },
  patchData(url, data) {
    return instance.patch(url, data);
  },
  deleteData(url, config = {}) {
    return instance.delete(url, config);
  },
};

instance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const statusCode = error?.response?.status ?? 0;
    switch (statusCode) {
      case 401:
        try {
          const response = await ApiService.deleteData(HEADER_URLS.LOGOUT_URL);
          if (response?.data?.status === 'SUCCESS') {
            store.dispatch({
              type: LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION,
            });
          }
        } catch (e) {
          store.dispatch({
            type: LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION,
          });
          errorNotification(
            'For security purposes you have been logged out, you need to re login',
            5000
          );
        }
        errorNotification(
          'For security purposes you have been logged out, you need to re login',
          5000
        );
        return false;
      case 403:
        window.location.href = '/forbidden-access';
        return false;
      default:
        break;
    }
    return Promise.reject(error);
  }
);

export default ApiService;
