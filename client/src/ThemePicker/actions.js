import {
  THEME_REQUESTING,
  THEME_SUCCESS,
  THEME_ERROR,
  THEME_RESET
} from '../redux/constants';

/**
 * Redux action creators for the `theme` piece of the store
 */

export const themeRequest = ({ primary, secondary }) => ({
  type: THEME_REQUESTING,
  primary,
  secondary
});

export const themeSuccess = response => ({
  type: THEME_SUCCESS,
  ...response
});

export const themeError = response => ({ type: THEME_ERROR, ...response });

export const themeReset = () => ({ type: THEME_RESET });
