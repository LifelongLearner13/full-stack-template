import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from '../common/PrivateRoute';
import Grid from '@material-ui/core/Grid';
import Header from '../Header';
import Profile from '../Profile';

class Main extends Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <Grid container spacing={24} component={'main'} direction={'column'}>
          <Switch>
            <PrivateRoute path={'/profile'} component={Profile} />
            <Route />
          </Switch>
        </Grid>
      </React.Fragment>
    );
  }
}

export default Main;
