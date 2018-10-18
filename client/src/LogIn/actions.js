import {
  LOGIN_REQUESTING,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT_REQUESTING,
  LOGOUT_SUCCESS
} from '../redux/constants';

/**
 * Redux action creators for the `login` piece of the store
 */

export const loginRequest = ({ email, password }) => ({
  type: LOGIN_REQUESTING,
  email,
  password
});

export const loginSuccess = response => ({ type: LOGIN_SUCCESS, ...response });

export const loginError = response => ({ type: LOGIN_ERROR, ...response });

export const logoutRequesting = response => ({
  type: LOGOUT_REQUESTING,
  ...response
});

export const logoutSuccess = response => ({
  type: LOGOUT_SUCCESS,
  ...response
});
