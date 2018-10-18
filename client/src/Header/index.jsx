import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import AccountMenu from './AccountMenu';
import { isUserAuthenticated } from '../redux/stateSelectors';
import { logoutRequesting } from '../LogIn/actions';
import MainMenu from './MainMenu';

const styles = {
  header: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

/**
 * Header displayed on all major pages.
 * @param {Object} props - All the properties passed into the component
 * @param {Object} props.classes - Customization to the Material-UI theme
 */
class Header extends React.Component {
  state = {
    isMenuOpen: false,
  };

  handleMenuClose = () => {
    this.setState({
      isMenuOpen: false,
    });
  };

  handleMenuOpen = () => {
    this.setState({
      isMenuOpen: true,
    });
  };

  render() {
    const { classes, isUserAuthenticated, logoutRequesting } = this.props;
    const { isMenuOpen } = this.state;

    return (
      <header>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={this.handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <MainMenu
              isOpen={isMenuOpen}
              handleClose={this.handleMenuClose}
              isAuthenticated={isUserAuthenticated}
            />
            <Typography
              variant="headline"
              color="inherit"
              className={classes.flex}
            >
              Full Stack Template
            </Typography>
            <AccountMenu
              isAuthenticated={isUserAuthenticated}
              handleLogOut={logoutRequesting}
            />
          </Toolbar>
        </AppBar>
      </header>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    isUserAuthenticated: isUserAuthenticated(state),
  };
};

const mapDispatchToProps = dispatch => ({
  logoutRequesting: () => dispatch(logoutRequesting()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Header));
