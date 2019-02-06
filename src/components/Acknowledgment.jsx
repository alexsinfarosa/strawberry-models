import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
    borderRadius: 8
  })
});

class Acknowledgment extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div style={{ width: 500 }}>
        <Paper className={classes.root} elevation={4}>
          <Typography variant="headline" component="h3">
            ACKNOWLEDGMENT
          </Typography>
          <br />
          <Typography component="p">
            New York State Integrated Pest Management -{" "}
            <a
              href="https://nysipm.cornell.edu/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NYSIPM
            </a>
          </Typography>
          <Typography component="p">
            Northeast Regional Climate Center -{" "}
            <a
              href="http://www.nrcc.cornell.edu/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NRCC
            </a>
          </Typography>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Acknowledgment);
