import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { getMessages } from '../redux/stateSelectors';
import Message from './Message';

const style = theme => ({
  margin: {
    margin: theme.spacing.unit
  }
});

class MessageList extends React.Component {
  render() {
    const { classes, owner, messages } = this.props;
    let messagesToDisplay = owner
      ? messages.filter(mes => mes.owner === owner)
      : messages;
    return messagesToDisplay.map(mes => (
      <Message
        key={mes.time}
        variant={mes.variant}
        className={classes.margin}
        message={mes.body}
      />
    ));
  }
}

MessageList.propTypes = {
  classes: PropTypes.object.isRequired,
  messages: PropTypes.arrayOf(PropTypes.object)
};

const mapStateToProps = state => {
  return {
    messages: getMessages(state)
  };
};

export default connect(mapStateToProps)(withStyles(style)(MessageList));
