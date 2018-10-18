import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  box: {
    display: 'block',
    width: 50,
    height: 50
  }
});

/**
 * Solid background box, used as an icon for RadioBox.
 * @param {Object} props - Properties passed into the component
 * @param {Object} props.classes - theme object based on Material-UI's theme
 * @param {Object} props.color - Background color of the box
 */
const Box = ({ classes, color }) => (
  <div style={{ backgroundColor: color }} className={classes.box} />
);

Box.propTypes = {
  classes: PropTypes.object,
  color: PropTypes.string
};

export default withStyles(styles)(Box);
