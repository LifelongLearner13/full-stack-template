import { take, fork, cancel, call, put } from 'redux-saga/effects';
import {
  LOGIN_REQUESTING,
  LOGIN_ERROR,
  LOGOUT_REQUESTING,
} from '../redux/constants';
import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
} from '../utils/localStorage';
import {
  loginSuccess,
  loginError,
  logoutRequesting,
  logoutSuccess,
} from './actions';
import { themeReset, themeSuccess } from '../ThemePicker/actions';

// API endpoint may change based on the build environment
const LOGIN_ENDPOINT =
  process.env.NODE_ENV === 'production'
    ? `${window.location.origin}/api/auth/login`
    : `${process.env.REACT_APP_DEV_API_URL}/auth/login`;

/**
 * API request to the `/login` endpoint. Modern browsers have
 * the Fetch API by default, but Create React App polyfills it for older browsers.
 * @param {string} email - User's email
 * @param {string} password - User's password
 */
function loginApi(email, password) {
  return fetch(LOGIN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
    .then(response => response.json())
    .then(json => {
      // Check if server returned an error
      if (!json.success) {
        const serverError = new Error(json.message);
        throw serverError;
      }

      return json;
    })
    .catch(error => {
      // Fetch is weird when it comes to errors. This is only called when something
      // is really wrong, so prevent potentially sensitive error messages in production
      if (process.env.NODE_ENV === 'production') {
        const userError = new Error('Something went wrong, please try again.');
        throw userError;
      } else {
        console.warn(error);
        throw error;
      }
    });
}

/**
 * Saga generator for logging the user out.
 */
function* logout() {
  // dispatches the LOGOUT_REQUESTING action
  yield put(logoutRequesting());

  // Remove information from local storage
  yield call(removeLocalStorage, 'token');
  yield call(removeLocalStorage, 'user');

  yield put(themeReset());

  // dispatch success action
  yield put(logoutSuccess());
}

/**
 * Saga generator that will attempt to log a user in
 * @param {*} email - User's email, if null will try to retrieve JWT from local storage
 * @param {*} password - User's password, if null will try to retrieve JWT from local storage
 */
function* loginFlow(email, password) {
  let response;
  try {
    // Look to see if data is stored in local storage
    let storedToken = getLocalStorage('token');
    let storedUser = getLocalStorage('user');

    if (storedToken) {
      // If JWT was in local storage, dispatch action to log user in
      yield put(
        loginSuccess({
          success: true,
          token: storedToken,
          user: storedUser,
          message: 'Login Successful',
        })
      );

      // Load preferences, if any are associated with user
      if (storedUser.preferences) {
        yield put(
          themeSuccess({
            success: true,
            message: 'Saved theme loaded',
            preferences: storedUser.preferences,
          })
        );
      }
    } else {
      // If JWT was not in local storage and nothing was passed into the generator, give up
      if (!email || !password) return false;

      // Query the server
      response = yield call(loginApi, email, password);

      // Add information to local storage
      yield call(setLocalStorage, 'user', response.user);
      yield call(setLocalStorage, 'token', response.token);

      // Dispatch action to log user in
      yield put(loginSuccess(response));

      // Load preferences, if any are associated with user
      if (response.user.preferences) {
        yield put(
          themeSuccess({
            success: true,
            message: 'Saved theme loaded',
            preferences: response.user.preferences,
          })
        );
      }
    }
  } catch (error) {
    // API error, dispatch action to display message to user
    yield put(loginError({ success: false, message: error.message }));
    return false;
  }

  return true;
}

function* loginWatcher() {
  let loginTask = null;
  let action = null;

  // Continually watch for these instructions
  while (true) {
    // Wait for either `LOGOUT_REQUESTING` or LOGIN_REQUESTING` to be dispatched
    action = yield take([LOGOUT_REQUESTING, LOGIN_REQUESTING]);

    if (action.type === LOGIN_REQUESTING) {
      const { email, password } = action;

      // Non-blocking execution continues until next yield
      loginTask = yield fork(loginFlow, email, password);

      // Wait for either `LOGOUT_REQUESTING` or `LOGIN_ERROR`
      action = yield take([LOGOUT_REQUESTING, LOGIN_ERROR]);

      if (action.type === LOGOUT_REQUESTING) {
        // User is attempting a logout, cancel initial login action if it is still running.
        yield cancel(loginTask);
        yield call(logout);
      }
    } else {
      yield call(logout);
    }
  }
}

export { loginFlow };
export default loginWatcher;
