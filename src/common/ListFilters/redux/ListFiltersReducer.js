import { LOGIN_REDUX_CONSTANTS } from '../../../screens/auth/login/redux/LoginReduxConstants';
import { LIST_FILTERS_REDUX_CONSTANTS } from './ListFiltersReduxConstants';

export const listFilterReducer = (state = {}, action) => {
  switch (action.type) {
    case LIST_FILTERS_REDUX_CONSTANTS.SAVE_APPLIED_FILTERS:
      return {
        ...state,
        [action?.filterFor]: action?.filters,
      };

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return {};

    default:
      return {
        ...state,
      };
  }
};
