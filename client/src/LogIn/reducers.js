import {
  LOGIN_REQUESTING,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT_REQUESTING,
  LOGOUT_SUCCESS,
  LOGOUT_ERROR
} from '../redux/constants';
import initialState from '../redux/initialState';

/**
 * Updates the `login` piece of the Redux store, based on dispatched actions.
 */
export default (state = initialState.login, action) => {
  const { success } = action;
  switch (action.type) {
    case LOGIN_REQUESTING:
      return {
        requesting: true,
        success: false
      };

    case LOGIN_SUCCESS:
      return {
        requesting: false,
        success
      };

    case LOGIN_ERROR:
      return {
        requesting: false,
        success
      };

    case LOGOUT_REQUESTING:
      return {
        requesting: true,
        success: false
      };

    case LOGOUT_SUCCESS:
      return {
        requesting: false,
        success
      };

    case LOGOUT_ERROR:
      return {
        requesting: false,
        success
      };

    default:
      return state;
  }
};
