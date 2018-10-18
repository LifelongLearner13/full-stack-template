import React from 'react';
import TextField from '@material-ui/core/TextField';

/**
 * By abstracting the Material-Ui TextField component into this wrapper component,
 * we can use it in conjunction with the Redux Form Field component.
 * Source: https://redux-form.com/7.4.2/examples/material-ui/
 * @param {Object} props - All the properties passed into the component
 * @param {Object} props.input - Input properties added to the component by Redux Form
 * @param {Object} props.meta - Property added by Redux Form
 * @param {boolean} props.meta.touched - Has the user entered the field
 * @param {JSX.Element} props.meta.error - Any issues relating to the validation of the field
 * @param {Object} props.rest - Any other properties added to the component
 */
const TextFieldWrapper = ({ input, meta: { touched, error }, ...rest }) => (
  <TextField
    {...input}
    {...rest}
    error={Boolean(touched && error)}
    helperText={touched && error ? error : null}
  />
);

export default TextFieldWrapper;
