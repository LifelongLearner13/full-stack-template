import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Lock from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import grey from '@material-ui/core/colors/grey';
import {
  isUserAuthenticated,
  isLogInRequesting
} from '../redux/stateSelectors';
import { loginRequest } from './actions';
import EmailPswdForm from '../common/EmailPswdForm';

const styles = theme => ({
  layout: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    backgroundColor: grey[300] // #E0E0E0
  },
  paper: {
    margin: `${theme.spacing.unit * 8}px ${theme.spacing.unit * 3}px 0`,
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  }
});

/**
 * Form for a user to log into their account. Almost identical to the SignUp form.
 * @param {Object} props - All the properties passed into the component
 * @param {Object} props.classes - Customizes the Material-UI theme for this component
 * @param {Function} props.handleSubmit - Passed in from Redux Form, called when form is submitted
 * @param {string} isAuthenticated - A truthy value if user is authenticate, null otherwise
 * @param {boolean} isRequesting - True if form is waiting for server response, false otherwise
 */
class LogIn extends Component {
  submitCallback = formData => {
    this.props.loginRequest(formData);
  };

  render() {
    const { classes, handleSubmit, isAuthenticated, isRequesting } = this.props;
    return isAuthenticated ? (
      <Redirect to="/profile" />
    ) : (
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <EmailPswdForm
            handleSubmit={handleSubmit(this.submitCallback)}
            headLine={'Log In'}
            buttonText={'Submit'}
            AvatarIcon={Lock}
            isRequesting={isRequesting}
            owner={'LOGIN'}
          />
        </Paper>
      </main>
    );
  }
}

LogIn.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    isAuthenticated: isUserAuthenticated(state),
    isRequesting: isLogInRequesting(state)
  };
};

const mapDispatchToProps = dispatch => ({
  loginRequest: data => dispatch(loginRequest(data))
});

// Validation rules for the form
const validate = values => {
  const errors = {};
  const requiredFields = ['email', 'password'];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  });
  if (
    values.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = 'Invalid email address';
  }
  return errors;
};

const Form = reduxForm({
  form: 'LogIn',
  validate
})(withStyles(styles)(LogIn));

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form);
