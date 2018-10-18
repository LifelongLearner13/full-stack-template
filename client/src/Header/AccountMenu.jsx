import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const styles = theme => ({
  menuList: {
    padding: 0
  },
  linkButton: {
    '&:hover': {
      backgroundColor: theme.palette.secondary[100],
      color: theme.palette.getContrastText(theme.palette.secondary[100])
    },
    '&:focus': {
      backgroundColor: theme.palette.secondary[100],
      color: theme.palette.getContrastText(theme.palette.secondary[100])
    }
  },
  link: {
    textDecoration: 'none',
    '&:visited': {
      color: theme.palette.text.primary
    },
    '&:active': {
      color: theme.palette.text.primary
    }
  }
});

/**
 * Dropdown menu for account based actions. Options change depending on the
 * authentication status.
 * @param {Object} props - All the properties passed into the component
 * @param {string} props.isAuthenticated - Truthy value if user is authenticated, false otherwise
 * @param {Function} props.handleLogOut - Callback to execute when user logs out.
 */
class AccountMenu extends Component {
  state = {
    anchorEl: null
  };

  onMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  onMenuClose = event => {
    this.setState({ anchorEl: null });
  };

  handleLogOut = () => {
    this.onMenuClose();
    this.props.handleLogOut();
  };

  render() {
    const { classes, isAuthenticated } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const menuContent = isAuthenticated
      ? [
          <MenuItem
            key={'profile'}
            onClick={this.onMenuClose}
            className={classes.linkButton}
          >
            <NavLink to={'/profile'} className={classes.link}>
              Profile
            </NavLink>
          </MenuItem>,
          <MenuItem
            key={'logOut'}
            onClick={this.onMenuClose}
            className={classes.linkButton}
          >
            <NavLink
              to={'/'}
              onClick={this.handleLogOut}
              className={classes.link}
            >
              Log Out
            </NavLink>
          </MenuItem>
        ]
      : [
          <MenuItem key={'logIn'} className={classes.linkButton}>
            <NavLink to={'/login'} className={classes.link}>
              Log In
            </NavLink>
          </MenuItem>,
          <MenuItem key={'signUp'} className={classes.linkButton}>
            <NavLink to={'/signup'} className={classes.link}>
              Sign Up
            </NavLink>
          </MenuItem>
        ];
    return (
      <div>
        <IconButton
          aria-owns={open ? 'account-menu' : null}
          aria-haspopup="true"
          onClick={this.onMenuOpen}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={open}
          onClose={this.onMenuClose}
          MenuListProps={{
            classes: {
              padding: classes.menuList
            }
          }}
        >
          {menuContent}
        </Menu>
      </div>
    );
  }
}

AccountMenu.propTypes = {
  isAuthenticated: PropTypes.string,
  handleLogOut: PropTypes.func
};

export default withStyles(styles)(AccountMenu);
