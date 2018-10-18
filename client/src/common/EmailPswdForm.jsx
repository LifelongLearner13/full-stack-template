import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextFieldWrapper from './TextFieldWrapper';
import MessageList from '../MessageList';

// Customizes the Material-UI theme for this component
const styles = theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing.unit
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.primary.light
  },
  submitWrapper: {
    margin: theme.spacing.unit,
    position: 'relative'
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
    '&:disabled': {
      backgroundColor: theme.palette.primary[200]
    }
  },
  buttonProgress: {
    color: theme.palette.secondary.dark,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -12
  }
});

/**
 * Form consisting of two text fields, email and password, and a submit button.
 * The password field can be toggled to show or obscure the entered password. Designed
 * to be wrapped in a Redux Form component.
 * Inspiration: https://material-ui.com/demos/text-fields/ and https://redux-form.com/7.4.2/examples/material-ui/
 * @param {Object} props - All the properties passed into the component
 * @param {Function} props.handleSubmit - Function to execute when form is submitted
 * @param {string} props.headLine - Title of the form
 * @param {string} props.buttonText - Text displayed on the "Submit" button
 * @param {Object} props.classes - Customizations on the Material-UI theme
 * @param {JSX.Element} props.AvatarIcon - Material-UI icon to display over the form title
 * @param {string} props.owner - Determines which messages will be displayed on the form
 */
class EmailPswdForm extends Component {
  state = {
    isPswdVisible: false
  };

  handleMouseDownPswd = event => {
    event.preventDefault();
  };

  togglePswdVisibility = () => {
    this.setState(state => ({ isPswdVisible: !state.isPswdVisible }));
  };

  render() {
    const {
      handleSubmit,
      headLine,
      buttonText,
      isRequesting,
      classes,
      AvatarIcon,
      owner
    } = this.props;
    const { isPswdVisible } = this.state;

    return (
      <form onSubmit={handleSubmit} className={classes.form}>
        <Avatar className={classes.avatar}>
          <AvatarIcon />
        </Avatar>
        <Typography variant="headline">{headLine}</Typography>
        <MessageList owner={owner} />
        <Field
          required={true}
          fullWidth={true}
          margin={'normal'}
          id={'email'}
          name={'email'}
          type={'text'}
          label={'Email Address'}
          InputProps={{
            autoFocus: true
          }}
          component={TextFieldWrapper}
        />
        <Field
          required={true}
          fullWidth={true}
          margin={'normal'}
          id={'password'}
          name={'password'}
          type={isPswdVisible ? 'text' : 'password'}
          label={'Password'}
          component={TextFieldWrapper}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={this.togglePswdVisibility}
                  onMouseDown={this.handleMouseDownPswd}
                >
                  {isPswdVisible ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <div className={classes.submitWrapper}>
          <Button
            type="submit"
            disabled={isRequesting}
            fullWidth
            variant="raised"
            color="primary"
            className={classes.submit}
          >
            {buttonText}
          </Button>
          {isRequesting && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
      </form>
    );
  }
}

EmailPswdForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  headLine: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  AvatarIcon: PropTypes.func.isRequired,
  owner: PropTypes.string.isRequired
};

export default withStyles(styles)(EmailPswdForm);
