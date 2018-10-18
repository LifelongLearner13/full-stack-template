import React from 'react';
import propTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import materialUIColors from './materialUIColors';
import { getThemePrimary, getThemeSecondary } from '../redux/stateSelectors';

/**
 * Wrapper for the Material-UI's MuiThemeProvider. Reads custom theme colors from the Redux
 * store. MuiThemeProvider passes the theme object to any child that needs it.
 * @param {Object} props - Properties passed to React component
 * @param {JSX.Element} props.children - Component to render within this one.
 */
const DyThemeProvider = ({ primary, secondary, children }) => {
  const theme = {
    palette: {
      type: 'light',
      primary: materialUIColors[primary],
      secondary: materialUIColors[secondary],
      error: red,
      // Used by `getContrastText()` to maximize the contrast between the background and
      // the text.
      contrastThreshold: 3,
      // Used to shift a color's luminance by approximately
      // two indexes within its tonal palette.
      // E.g., shift from Red 500 to Red 300 or Red 700.
      tonalOffset: 0.2
    },
    typography: {
      // Apply Material UI's default fonts to all text
      fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(',')
    }
  };
  return (
    <MuiThemeProvider theme={createMuiTheme(theme)}>
      {children}
    </MuiThemeProvider>
  );
};

DyThemeProvider.propTypes = {
  primary: propTypes.string,
  secondary: propTypes.string,
  children: propTypes.any
};

const mapStateToProps = state => ({
  primary: getThemePrimary(state),
  secondary: getThemeSecondary(state)
});

export default withRouter(connect(mapStateToProps)(DyThemeProvider));
