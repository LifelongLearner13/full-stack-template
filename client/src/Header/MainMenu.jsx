import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FaceIcon from '@material-ui/icons/FaceOutlined';

const styles = theme => ({
  list: {
    width: 250,
  },
});

/**
 * Main Menu for the application
 * @param {Object} props - All the properties passed into the component
 * @param {Object} props.classes - Customization of the Material-UI theme
 * @param {boolean} props.isOpen - True if the drawer is open
 * @param {Function} props.handleClose - Callback to handle the state of the menu drawer
 * @param {string} props.isAuthenticated - Truthy value if user is authenticated
 * @param {Object} props.history - React Router history, allows for programmatic routing
 */
const MainMenu = ({
  classes,
  isOpen,
  handleClose,
  isAuthenticated,
  history,
}) => {
  const content = (
    <div className={classes.list}>
      {isAuthenticated && (
        <List component={'nav'}>
          <ListItem button={true} onClick={() => history.push('/profile')}>
            <ListItemIcon>
              <FaceIcon />
            </ListItemIcon>
            <ListItemText>
              <Link to={'/profile'}>Profile</Link>
            </ListItemText>
          </ListItem>
        </List>
      )}
    </div>
  );
  return (
    <Drawer open={isOpen} onClose={handleClose}>
      <div
        tabIndex={0}
        role={'button'}
        onClick={handleClose}
        onKeyDown={handleClose}
      >
        {content}
      </div>
    </Drawer>
  );
};

MainMenu.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  isAuthenticated: PropTypes.string,
  classes: PropTypes.object,
  history: PropTypes.any,
};

export default withRouter(withStyles(styles)(MainMenu));
