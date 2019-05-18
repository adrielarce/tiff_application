import React from 'react';
import PropTypes from 'prop-types';
import './AppBar.css';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    flexGrow: 1,
  },
};

function SimpleAppBar(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar className="appbar">
          <img src="https://www.tiff.net/img/logo-black.png" alt="tiff_logo" width="8%" className="logo" />
          <Typography variant="h6">
            MOVIE SPOTLIGHT 2019
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

SimpleAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleAppBar);