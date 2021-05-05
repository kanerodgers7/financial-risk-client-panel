export const BASE_URL = process.env.REACT_APP_BASE_URL;

export const AUTH_URLS = {
  LOGIN_URL: `${BASE_URL}auth/login/`,
  FORGOT_PASSWORD_URL: `${BASE_URL}auth/forget-password/`,
  VERIFY_OTP_URL: `${BASE_URL}auth/verify-otp/`,
  RESEND_OTP_URL: `${BASE_URL}auth/resend-otp/`,
  RESET_PASSWORD_URL: `${BASE_URL}auth/reset-password`,
  SET_PASSWORD_URL: `${BASE_URL}auth/set-password`,
};

export const HEADER_URLS = {
  LOGGED_USER_DETAILS_URL: `${BASE_URL}user/profile`,
  UPLOAD_PROFILE_PICTURE: `${BASE_URL}user/upload/profile-picture/`,
  CHANGE_PASSWORD_URL: `${BASE_URL}auth/change-password/`,
  LOGOUT_URL: `${BASE_URL}auth/logout/`,
};

export const APPLICATION_URLS = {
  APPLICATION_LIST_URL: `${BASE_URL}application/`,
  APPLICATION_COLUMN_NAME_LIST_URL: `${BASE_URL}application/column-name?columnFor=application`,
  APPLICATION_COLUMN_NAME_LIST_UPDATE_URL: `${BASE_URL}application/column-name/`,
  APPLICATION_SAVE_STEP_DATA: `${BASE_URL}application/`,
  APPLICATION_FILTER_LIST_URL: `${BASE_URL}application/entity-list`,
  GET_APPLICATION_DETAILS_URL: `${BASE_URL}application/details/`,

  COMPANY: {
    DROP_DOWN_DATA_URL: `${BASE_URL}application/entity-list/`,
    SEARCH_APPLICATION_BY_DEBTOR_DETAILS: `${BASE_URL}debtor/details/`,
    SEARCH_APPLICATION_BY_ABN_ACN_DETAILS: `${BASE_URL}application/search-entity/`,
    SEARCH_APPLICATION_ENTITY_TYPE: `${BASE_URL}application/search-entity-list/`,
    DELETE_APPLICATION_ENTITY_TYPE: `${BASE_URL}/debtor/stakeholder/`,
  },
  DOCUMENTS: {
    DOCUMENTS_LIST: `${BASE_URL}document/`,
    GET_DOCUMENT_TYPE_LIST_URL: `${BASE_URL}document/type-list`,
    UPLOAD_DOCUMENT_URL: `${BASE_URL}document/upload/`,
    APPLICATION_DELETE_DOCUMENT: `${BASE_URL}document/`,
  },
};

export const CREDIT_LIMITS_URLS = {
  CREDIT_LIMITS_LIST_URL: `${BASE_URL}debtor/`,
  CREDIT_LIMITS_COLUMN_LIST: `${BASE_URL}debtor/column-name/`,
  CREDIT_LIMITS_FILTER: `${BASE_URL}debtor/entity-list/`
};

export const EMPLOYEE_URLS = {
  EMPLOYEE_LIST_URL: `${BASE_URL}client/user/`
}

export const COMPANY_PROFILE_URL = {
  COMPANY_PROFILE_URL: `${BASE_URL}client/`
}

export const SUPPORT_URLS = {
  SUPPORT_URL: `${BASE_URL}organization/details/`
}
