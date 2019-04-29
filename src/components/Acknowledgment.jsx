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
          <Typography variant="title" gutterBottom>
            ACKNOWLEDGMENT
          </Typography>
          <Typography
            component="p"
            style={{ lineHeight: "1.8em" }}
            gutterBottom
          >
            This NEWA disease forecast tool was co-authored and developed by Dr.
            Juliet Carroll,{" "}
            <a
              href="https://nysipm.cornell.edu/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NY SIPM Program
            </a>
            , and Dr. Kerik Cox, Plant Pathology and Plant-Microbe Biology, at
            Cornell University, with input from Dr. Natália Perez, University of
            Florida.
          </Typography>

          <Typography
            component="p"
            style={{ lineHeight: "1.8em" }}
            gutterBottom
          >
            Please contact <a href="mailto:kdc33@cornell.edu">Dr. Cox </a>with
            any questions regarding the scientific content and recommendations
            delivered in tool outputs.
          </Typography>

          <br />

          <Typography variant="title" gutterBottom>
            Botrytis References:
          </Typography>
          <Typography
            component="p"
            style={{ lineHeight: "1.8em" }}
            gutterBottom
          >
            Wilson, L.L., Madden, L.V. and Ellis, M.A. 1990. Influence of
            temperature and wetness duration on infection of immature and mature
            strawberry fruit by Colletotrichum acutatum. Phytopathology
            80:111-116.
          </Typography>

          <Typography
            component="p"
            style={{ lineHeight: "1.8em" }}
            gutterBottom
          >
            MacKenzie, S. J., and N. A. Peres. 2012. Use of leaf wetness and
            temperature to time fungicide applications to control Botrytis fruit
            rot of strawberry in Florida. Plant Dis. 96: 529-536.
          </Typography>

          <br />
          <Typography variant="title" gutterBottom>
            Anthracnose References:
          </Typography>
          <Typography
            component="p"
            style={{ lineHeight: "1.8em" }}
            gutterBottom
          >
            Bulger, M. A., Ellis, M. A., and Madden, L. V. 1987. Influence of
            temperature and wetness duration on infection of strawberry flowers
            by Botrytis cinerea and disease incidence of fruit originating from
            infected flowers. Phytopathology 77:1225-1230.
          </Typography>

          <Typography
            component="p"
            style={{ lineHeight: "1.8em" }}
            gutterBottom
          >
            MacKenzie, S. J., and N. A. Peres. 2012. Use of leaf wetness and
            temperature to time fungicide applications to control anthracnose
            rot of strawberry in Florida. Plant Disease 96: 522-528.
          </Typography>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Acknowledgment);
