import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import profile from '../Profile/reducers';
import login from '../LogIn/reducers';
import signup from '../SignUp/reducers';
import messages from '../MessageList/reducers';
import theme from '../ThemePicker/reducers';

/**
 * Map pieces of state to their corresponding reducers.
 */
export default combineReducers({
  profile,
  login,
  signup,
  messages,
  theme,
  form
});
