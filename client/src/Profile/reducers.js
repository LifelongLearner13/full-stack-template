import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from '../redux/constants';
import initialState from '../redux/initialState';

export default (state = initialState.profile, action) => {
  const { token, user } = action;
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        email: user.email,
        preferences: user.preferences,
        token
      };

    case LOGOUT_SUCCESS:
      return {
        email: null,
        preferences: {},
        token: null
      };

    default:
      return state;
  }
};
