import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import AccountCircle from '@material-ui/icons/AccountCircleOutlined';
import Paper from '@material-ui/core/Paper';
import grey from '@material-ui/core/colors/grey';
import {
  isUserAuthenticated,
  isSignUpRequesting
} from '../redux/stateSelectors';
import { signupRequest } from './actions';
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
 * Form for a user to register for an account. Almost identical to the LogIn form.
 * @param {Object} props - All the properties passed into the component
 * @param {Object} props.classes - Customizes the Material-UI theme for this component
 * @param {Function} props.handleSubmit - Passed in from Redux Form, called when form is submitted
 * @param {string} isAuthenticated - A truthy value if user is authenticate, null otherwise
 * @param {boolean} isRequesting - True if form is waiting for server response, false otherwise
 */
class SignUp extends Component {
  submitCallback = formData => {
    this.props.signupRequest(formData);
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
            headLine={'Create an Account'}
            buttonText={'Sign Up'}
            AvatarIcon={AccountCircle}
            isRequesting={isRequesting}
            owner={'SIGNUP'}
          />
        </Paper>
      </main>
    );
  }
}

SignUp.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func,
  isAuthenticated: PropTypes.string,
  isRequesting: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: isUserAuthenticated(state),
  isRequesting: isSignUpRequesting(state)
});

const mapDispatchToProps = dispatch => ({
  signupRequest: data => dispatch(signupRequest(data))
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
  if (values.password && values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  return errors;
};

const Form = reduxForm({
  form: 'SignUp',
  validate
})(withStyles(styles)(SignUp));

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form);
