import { call, put, takeLatest } from 'redux-saga/effects';
import { THEME_REQUESTING } from '../redux/constants';
import { setLocalStorage, getLocalStorage } from '../utils/localStorage';
import { themeSuccess, themeError } from './actions';

// API endpoint may change based on the build environment
const THEME_ENDPOINT =
  process.env.NODE_ENV === 'production'
    ? `${window.location.origin}/api/user/preferences`
    : `${process.env.REACT_APP_DEV_API_URL}/user/preferences`;

/**
 * API request to the `/user/preferences` endpoint. Modern browsers have
 * the Fetch API by default, but Create React App polyfills it for older browsers.
 * @param {string} email - User's email
 * @param {string} password - User's password
 */
function themeApi(token, theme) {
  return fetch(THEME_ENDPOINT, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ theme }),
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
 * Executed when the latest THEME_REQUESTING action is caught by themeWatcher
 * @param {Object} arguments - All arguments passed to the function
 * @param {string} email - Entered email address
 * @param {string} password - Entered password
 */
function* themeFlow({ primary, secondary }) {
  // Make sure user is authenticated.
  const token = getLocalStorage('token');
  if (!token) {
    yield put(
      themeError({
        success: false,
        message: 'You must be logged in in order to save a theme.',
      })
    );
    return false;
  }

  try {
    // Initiate call to theme endpoint, execution pauses until either response or
    // error is returned
    const response = yield call(themeApi, token, { primary, secondary });

    // Update new preferences in local storage
    let { preferences } = response;
    let user = yield call(getLocalStorage, 'user');
    user = { ...user, preferences };
    yield call(setLocalStorage, 'user', user);

    // If request was a success, dispatch action to the store
    yield put(themeSuccess(response));
  } catch (error) {
    // If request failed, dispatch action to the store.
    yield put(themeError({ success: false, message: error.message }));
  }
}

// Watch for the THEME_REQUESTING action
function* themeWatcher() {
  // Take the latest action of type THEME_REQUESTING and run themeFlow.
  // If another THEME_REQUESTING action is dispatched before themeFlow
  // finishes execution, then takeLatest cancels the original function and
  // starts over.
  yield takeLatest(THEME_REQUESTING, themeFlow);
}

export default themeWatcher;
