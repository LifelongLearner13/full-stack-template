import React from 'react';
import PropTypes from 'prop-types';
import RadioGroup from '@material-ui/core/RadioGroup';

/**
 * Wrapper for the Material-UI RadioButtonGroup, allowing it to be used with Redux Form.
 * @param {Object} props - All the properties passed into the component
 * @param {Object} props.input - Values injected by Redux form
 * @param {Object} props.rest - Any other properties passed to the component
 */
const RadioGroupWrapper = ({ input, ...rest }) => (
  <RadioGroup
    {...input}
    {...rest}
    value={input.value}
    onChange={(event, value) => input.onChange(value)}
  />
);

RadioGroupWrapper.propTypes = {
  input: PropTypes.object,
  rest: PropTypes.object
};

export default RadioGroupWrapper;
