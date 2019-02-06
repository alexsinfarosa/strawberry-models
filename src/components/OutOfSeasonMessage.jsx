import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";

import withRoot from "../withRoot";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 500,
    margin: "0 auto",
    marginBottom: theme.spacing.unit * 8
  },
  header: {
    borderBottom: `2px solid ${theme.palette.primary.light}`,
    width: 250
  }
});

class OutOfSeasonMessage extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography
          variant="subheading"
          paragraph
          align="justify"
          className={classes.header}
        >
          PEST STATUS
        </Typography>
        <Typography variant="body1" paragraph align="justify">
          @Julie provide content here...
        </Typography>

        <Typography
          variant="subheading"
          paragraph
          align="justify"
          style={{ marginTop: 64 }}
          className={classes.header}
        >
          PEST MANAGEMENT
        </Typography>
        <Typography variant="body1" paragraph align="justify">
          The time of concern for Strawberry Disease Forecast Models has passed.
          The tool will begin again on March 1st.
        </Typography>
      </div>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(OutOfSeasonMessage)))
);
