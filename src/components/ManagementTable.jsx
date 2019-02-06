import React, { Component, Fragment } from "react";
import { inject, observer } from "mobx-react";

// material-ui
import withRoot from "../withRoot";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Hidden from "@material-ui/core/Hidden";

// pest management messages
import { pestManagement } from "../assets/pestManagement";

// styles
const styles = theme => ({
  root: {
    width: "100%",
    marginBottom: theme.spacing.unit * 8
  },
  table: {
    // maxWidth: 700
  },
  isMobile: {
    [theme.breakpoints.down("md")]: {
      display: "none"
    }
  },
  tableCell: {
    fontSize: "0.8rem",
    padding: "0 10px",
    textAlign: "center",
    "@media (min-width: 576px)": {
      fontSize: "0.8rem"
    }
  },
  tableHeader: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    borderRight: "1px solid #eee"
  }
});

class ManagementTable extends Component {
  render() {
    const { classes } = this.props;
    const { dataForTable } = this.props.appStore.currentModel;

    let cdd;
    if (dataForTable.length !== 0) {
      cdd = dataForTable[2].cdd;
    }
    let status;
    if (cdd <= 613) status = pestManagement[1];
    if (cdd > 613 && cdd <= 863) status = pestManagement[2];
    if (cdd > 863 && cdd <= 963) status = pestManagement[3];
    if (cdd > 964) status = pestManagement[4];

    return (
      <div className={classes.root}>
        {status ? (
          <div>
            <Typography
              variant="subheading"
              gutterBottom
              style={{ letterSpacing: 1 }}
            >
              MANAGEMENT
            </Typography>
            <Fragment>
              <Paper>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        className={classes.tableCell}
                        // rowSpan={2}
                        style={{
                          textAlign: "center",
                          margin: 0,
                          padding: 0
                          // fontSize: 16
                        }}
                      >
                        DISEASE
                      </TableCell>
                      <TableCell
                        style={{
                          textAlign: "center",
                          borderLeft: "1px solid #E0E0E0"
                          // fontSize: 16
                        }}
                        // colSpan={2}
                      >
                        DISEASE MANAGEMENT
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow hover>
                      <TableCell
                        style={{
                          borderRight: "1px solid #E0E0E0",
                          fontWeight: "bold",
                          letterSpacing: 1
                        }}
                      >
                        Botrytis
                      </TableCell>
                      <TableCell>
                        Disease management messages will appear here when the
                        strawberry diseases model is in NEWA
                      </TableCell>
                    </TableRow>

                    <TableRow hover>
                      <TableCell
                        style={{
                          borderRight: "1px solid #E0E0E0",
                          fontWeight: "bold",
                          letterSpacing: 1
                        }}
                      >
                        Anthracnose
                      </TableCell>
                      <TableCell>
                        Disease management messages will appear here when the
                        strawberry diseases model is in NEWA
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            </Fragment>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(ManagementTable)))
);
