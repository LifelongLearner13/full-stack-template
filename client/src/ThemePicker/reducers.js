import initialState from '../redux/initialState';
import {
  THEME_REQUESTING,
  THEME_SUCCESS,
  THEME_ERROR,
  THEME_RESET
} from '../redux/constants';

/**
 * Manages the `theme` piece of the Redux store
 */
export default (state = initialState.theme, action) => {
  const { success, preferences } = action;
  switch (action.type) {
    case THEME_REQUESTING:
      return {
        ...state,
        requesting: true,
        success: false
      };
    case THEME_SUCCESS:
      return {
        ...state,
        requesting: false,
        success,
        primary: preferences.theme.primary,
        secondary: preferences.theme.secondary
      };
    case THEME_ERROR:
      return {
        ...state,
        requesting: false,
        success
      };
    case THEME_RESET:
      return initialState.theme;
    default:
      return state;
  }
};
