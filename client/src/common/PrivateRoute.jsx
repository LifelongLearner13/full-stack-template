import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { isUserAuthenticated } from '../redux/stateSelectors';

/**
 * Prevent a user from accessing a route that requires authentication.
 * @param {Object} props - All the properties passed into the component
 * @param {JSX.Element} props.component - Component to render if user is authenticated
 * @param {string} props.isAuthenticated - User's email, if they are authenticated
 * @param {Object} props.rest - Any other properties passed into the component
 */
const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      delete rest.to; // clean up rest, so we can pass it along to the child component
      return isAuthenticated !== null ? (
        <Component {...props} {...rest} />
      ) : (
        // If user is not authenticated redirect to `/login`
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      );
    }}
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.func,
  rest: PropTypes.object
};

const mapStateToProps = state => {
  return {
    isAuthenticated: isUserAuthenticated(state)
  };
};

export default connect(mapStateToProps)(PrivateRoute);
