import React from 'react';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import Box from './Box';
import BoxWithCheck from './BoxWithCheck';

/**
 * Solid box Radio button. When checked it has an overlay of a white checkmark.
 * Inspiration: https://material-ui.com/style/color/#color-tool
 * @param {Object} props - Properties passed into the component
 * @param {string} props.value - Value for the Input field
 * @param {string} props.label - Descriptor for the field
 * @param {string} props.color - The Color of the background
 * @param {Object} props.rest - Any other values passed into the component
 */
const RadioBox = ({ value, label, color, ...rest }) => (
  <Radio
    value={value}
    color={'default'}
    aria-label={label}
    disableRipple={true}
    icon={<Box color={color} />}
    checkedIcon={<BoxWithCheck color={color} />}
    {...rest}
  />
);

RadioBox.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  color: PropTypes.string,
  rest: PropTypes.any
};

export default RadioBox;
