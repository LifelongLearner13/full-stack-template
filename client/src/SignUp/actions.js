import {
  SIGNUP_REQUESTING,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR
} from '../redux/constants';

/**
 * Redux action creators for the `signup` piece of the store
 */

export const signupRequest = ({ email, password }) => ({
  type: SIGNUP_REQUESTING,
  email,
  password
});

export const signupSuccess = response => ({
  type: SIGNUP_SUCCESS,
  ...response
});

export const signupError = response => ({ type: SIGNUP_ERROR, ...response });
