import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";

import withRoot from "../withRoot";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 700,
    margin: "0 auto",
    marginBottom: theme.spacing.unit * 6,
    marginTop: theme.spacing.unit * 4
  }
});

class Disclaimer extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {/*<Typography variant="caption" paragraph align="justify">
          Blueberry maggot emergence is predicted to occur when approximately
          <b> 913 degree days, base 50 ˚F</b>, have accumulated from January
          1st. The blueberry maggot degree day model uses the Baskerville Emin
          formula.
    </Typography> */}

        <Typography variant="caption" paragraph align="justify">
          <b>Disclaimer: These are theoretical predictions and forecasts.</b>The
          theoretical models predicting pest development or disease risk use the
          weather data collected (or forecasted) from the weather station
          location. These results should not be substituted for actual
          observations of plant growth stage, pest presence, and disease
          occurrence determined through scouting or insect pheromone traps.
        </Typography>
      </div>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(Disclaimer)))
);
