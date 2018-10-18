import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import FaceIcon from '@material-ui/icons/FaceOutlined';
import ThemePicker from '../ThemePicker';
import { getUserProfile } from '../redux/stateSelectors';

const styles = theme => ({
  avatar: {
    margin: `${theme.spacing.unit * 6}px auto`,
    backgroundColor: theme.palette.primary.main,
    width: '60px',
    height: '60px'
  },
  avatarIcon: {
    width: '2.5em',
    height: '2.5em'
  },
  section: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    width: '80%',
    margin: '0 auto'
  },
  sectionTitle: {
    marginBottom: theme.spacing.unit * 2
  }
});

/**
 * Layout for the Profile page.
 * @param {Object} props - Properties passed to the component
 * @param {Object} props.classes - Customization to the Material-UI theme
 * @param {profile} props.profile - Information stored in the Redux store
 */
class Profile extends Component {
  render() {
    const { classes, profile } = this.props;

    return (
      <React.Fragment>
        <Grid item xs={12} component={'section'}>
          <Avatar className={classes.avatar}>
            <FaceIcon className={classes.avatarIcon} />
          </Avatar>
          <Typography
            align={'center'}
            component={'h2'}
            variant={'display1'}
            gutterBottom
          >
            Profile
          </Typography>
        </Grid>
        <Grid item xs={12} component={'section'}>
          <Paper className={classes.section} elevation={1}>
            <Typography
              variant="title"
              component="h3"
              className={classes.sectionTitle}
            >
              Account Details
            </Typography>
            <Grid container spacing={24} justify={'center'}>
              <Grid item xs={5}>
                <Typography component={'p'} variant={'subheading'}>
                  Email
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography component={'p'} variant={'subheading'}>
                  {profile.email}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <ThemePicker />
      </React.Fragment>
    );
  }
}

Profile.propTypes = {
  profile: PropTypes.object,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: getUserProfile(state)
});

export default connect(mapStateToProps)(withStyles(styles)(Profile));
