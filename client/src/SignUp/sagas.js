import { call, put, takeLatest } from 'redux-saga/effects';
import { SIGNUP_REQUESTING } from '../redux/constants';
import { setLocalStorage } from '../utils/localStorage';
import { signupSuccess, signupError } from './actions';
import { loginRequest } from '../LogIn/actions';

// API endpoint may change based on the build environment
const SIGNUP_ENDPOINT =
  process.env.NODE_ENV === 'production'
    ? `${window.location.origin}/api/auth/signup`
    : `${process.env.REACT_APP_DEV_API_URL}/auth/signup`;

/**
 * API request to the `/signup` endpoint. Modern browsers have
 * the Fetch API by default, but Create React App polyfills it for older browsers.
 * @param {string} email - User's email
 * @param {string} password - User's password
 */
function signupApi(email, password) {
  return fetch(SIGNUP_ENDPOINT, {
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
 * Executed when the latest SIGNUP_REQUESTING action is caught by signupWatcher
 * @param {Object} arguments - All arguments passed to the function
 * @param {string} email - Entered email address
 * @param {string} password - Entered password
 */
function* signupFlow({ email, password }) {
  try {
    // Initiate call to signup endpoint, execution pauses until either response or
    // error is returned
    const response = yield call(signupApi, email, password);

    // If request was a success, dispatch action to the store
    yield put(signupSuccess(response));

    // Sign newly created user in
    let { token, user } = response;
    yield call(setLocalStorage, 'user', user);
    yield call(setLocalStorage, 'token', token);
    yield put(loginRequest({ email: user.email, password: null }));
  } catch (error) {
    // If request failed, dispatch action to the store.
    yield put(signupError({ success: false, message: error.message }));
  }
}

// Watch for the SIGNUP_REQUESTING action
function* signupWatcher() {
  // Take the latest action of type SIGNUP_REQUESTING and run signupFlow.
  // If another SIGNUP_REQUESTING action is dispatched before signupFlow
  // finishes execution, then takeLatest cancels the original function and
  // starts over.
  yield takeLatest(SIGNUP_REQUESTING, signupFlow);
}

export default signupWatcher;
