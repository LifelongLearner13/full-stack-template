import {
  SIGNUP_REQUESTING,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
  LOGIN_REQUESTING,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT_SUCCESS
} from '../redux/constants';
import initialState from '../redux/initialState';

export default (state = initialState.messages, action) => {
  let newState = null;
  const { message } = action;
  switch (action.type) {
    case SIGNUP_REQUESTING:
      // Remove any old messages related to signing up
      newState = state.filter(el => el.owner !== 'SIGNUP');

      return [
        ...newState,
        {
          body: 'Creating your account...',
          owner: 'SIGNUP',
          variant: 'info',
          time: new Date()
        }
      ];

    case SIGNUP_SUCCESS:
      // Remove any old messages related to signing up
      newState = state.filter(el => el.owner !== 'SIGNUP');

      return [
        ...newState,
        {
          body: message,
          owner: 'SIGNUP',
          variant: 'success',
          time: new Date()
        }
      ];

    case SIGNUP_ERROR:
      // Remove any old messages related to signing up
      newState = state.filter(el => el.owner !== 'SIGNUP');
      return [
        ...newState,
        {
          body: message,
          owner: 'SIGNUP',
          variant: 'error',
          time: new Date()
        }
      ];

    case LOGIN_REQUESTING:
      // Remove any old messages related to signing up
      newState = state.filter(el => el.owner !== 'LOGIN');

      return [
        ...newState,
        {
          body: 'Creating your account...',
          owner: 'LOGIN',
          variant: 'info',
          time: new Date()
        }
      ];

    case LOGIN_SUCCESS:
      // Remove any old messages related to signing up
      newState = state.filter(el => el.owner !== 'LOGIN');

      return [
        ...newState,
        {
          body: message,
          owner: 'LOGIN',
          variant: 'success',
          time: new Date()
        }
      ];

    case LOGIN_ERROR:
      // Remove any old messages related to signing up
      newState = state.filter(el => el.owner !== 'LOGIN');
      return [
        ...newState,
        {
          body: message,
          owner: 'LOGIN',
          variant: 'error',
          time: new Date()
        }
      ];

    case LOGOUT_SUCCESS:
      return [];

    default:
      return state;
  }
};
