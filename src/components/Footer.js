import React from 'react';
import './Footer.css';
import { withStyles } from '@material-ui/core/styles';
//import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    flexGrow: 1,
  },
};

function Footer() {
  return (
    <div className="footer">
        <img src="https://www.themoviedb.org/assets/2/v4/logos/408x161-powered-by-rectangle-blue-10d3d41d2a0af9ebcb85f7fb62ffb6671c15ae8ea9bc82a2c6941f223143409e.png" alt="tmdb_logo" className="logo" width="12%" />
    </div>
  );
}

export default withStyles(styles)(Footer);