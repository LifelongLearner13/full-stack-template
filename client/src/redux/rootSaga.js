import { all, call } from 'redux-saga/effects';
import signup from '../SignUp/sagas';
import login, { loginFlow } from '../LogIn/sagas';
import theme from '../ThemePicker/sagas';

/**
 * Handle the async actions within the application.
 */
export default function* rootSaga() {
  // Run once when app first loads to check if user has a token stored in local storage
  yield call(loginFlow);
  // Tasks are run in parallel
  yield all([call(signup), call(login), call(theme)]);
}
