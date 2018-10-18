import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Check from '@material-ui/icons/Check';

const styles = theme => ({
  wrapper: {
    display: 'block',
    position: 'relative',
    width: 50,
    height: 50
  },
  box: {
    display: 'block',
    width: 48,
    height: 48,
    border: '1px solid #FFFFFF'
  },
  icon: {
    position: 'absolute',
    color: '#FFFFFF',
    fontSize: '40px',
    top: '5px',
    left: '2px'
  }
});

/**
 * Solid background box with a white checkmark, used as an icon for RadioBox.
 * @param {Object} props - Properties passed into the component
 * @param {Object} props.classes - theme object based on Material-UI's theme
 * @param {Object} props.color - Background color of the box
 */
const BoxWithCheck = ({ classes, color }) => (
  <div className={classes.wrapper}>
    <div style={{ backgroundColor: color }} className={classes.box} />
    <Check className={classes.icon} />
  </div>
);

BoxWithCheck.propTypes = {
  classes: PropTypes.object,
  color: PropTypes.string
};

export default withStyles(styles)(BoxWithCheck);
