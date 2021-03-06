import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import { CSVLink } from "react-csv";

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
import CircularProgress from "@material-ui/core/CircularProgress";

// date
import { format, isSameDay, differenceInDays } from "date-fns/esm";

// styles
const styles = theme => ({
  root: {
    width: "100%",
    marginBottom: theme.spacing.unit * 4
  },
  table: {
    // minWidth: 700,
    width: "100%"
  },
  isMobile: {
    [theme.breakpoints.down("md")]: {
      display: "none"
    }
  },
  tableCell: {
    fontSize: "1rem",
    padding: "0 10px",
    textAlign: "center",
    "@media (min-width: 576px)": {
      fontSize: "1rem"
    }
  },
  tableHeader: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    borderRight: "1px solid #eee"
  },
  missingDays: {
    width: "100%",
    maxWidth: 700,
    margin: "0 auto",
    marginTop: theme.spacing.unit * 4
  },
  segment: {
    width: 110,
    textAlign: "center",
    borderRadius: 8,
    padding: 2,
    "& > *": {
      color: "white",
      fontWeight: 700,
      letterSpacing: 1,
      fontSize: 10
    }
  }
});

class GDDTable extends Component {
  timeColor = date => {
    const formattedDate = format(date, "YYYY-MM-DD");
    const formattedToday = format(new Date(), "YYYY-MM-DD");
    if (isSameDay(formattedDate, formattedToday)) return;
    if (differenceInDays(formattedDate, formattedToday) < 0) return "#0FA3B1";
    if (differenceInDays(formattedDate, formattedToday) >= 0) return "#F9E04C";
  };
  render() {
    const { classes } = this.props;
    const {
      isLoading,
      dateOfInterest,
      station
    } = this.props.appStore.paramsStore;

    const {
      dataForTable,
      missingDays,
      CSVData,
      setCSVData
    } = this.props.appStore.currentModel;

    const botrytisColor = d => {
      if (d < 0.5) return "#44AA51";
      if (d >= 0.5 && d < 0.7) return "#F6C317";
      if (d >= 0.7) return "#E0413D";
    };

    const anthracnoseColor = d => {
      if (d < 0.15) return "#44AA51";
      if (d >= 0.15 && d < 0.5) return "#F6C317";
      if (d >= 0.5) return "#E0413D";
    };

    return (
      <div className={classes.root}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="title" gutterBottom>
            Predictions
          </Typography>
          <CSVLink
            data={CSVData.slice()}
            filename={`StrawberryFruitRot${station.name}(${station.state}).csv`}
            target="_blank"
            onClick={e => setCSVData()}
            style={{ textDecoration: "none" }}
          >
            <Typography
              variant="subheading"
              gutterBottom
              style={{ letterSpacing: 1 }}
            >
              Download CSV
            </Typography>
          </CSVLink>
        </div>
        <Paper>
          {isLoading ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignContent: "center"
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell
                    className={classes.tableCell}
                    rowSpan={2}
                    colSpan={2}
                    style={{
                      textAlign: "center",
                      margin: 0,
                      padding: 0,
                      borderRight: "1px solid #E0E0E0",
                      fontSize: 16,
                      color: "black"
                    }}
                  >
                    <div>Date</div>
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: "center",
                      borderLeft: "1px solid #E0E0E0",
                      borderRight: "1px solid #E0E0E0",
                      fontSize: 16,
                      color: "black"
                    }}
                    colSpan={2}
                  >
                    Infection Risk Levels
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      borderRight: "1px solid #E0E0E0",
                      fontSize: 16,
                      color: "black"
                    }}
                  >
                    Botrytis
                  </TableCell>

                  <TableCell
                    className={classes.tableCell}
                    colSpan={20}
                    style={{ fontSize: 16, color: "black" }}
                  >
                    Anthracnose
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {dataForTable.map(o => {
                  const isToday = isSameDay(new Date(dateOfInterest), o.date);
                  const formattedDate = format(o.date, "YYYY-MM-DD");
                  const formattedToday = format(new Date(), "YYYY-MM-DD");
                  return (
                    <TableRow hover key={o.date}>
                      <TableCell
                        className={classes.tableCell}
                        style={{
                          margin: 0,
                          padding: 0,
                          width: 8,
                          background: this.timeColor(o.date),
                          borderBottom: "none",
                          borderTop: "none"
                        }}
                      />
                      <TableCell
                        className={classes.tableCell}
                        style={{
                          fontSize: isToday ? "1.3rem" : null,
                          fontWeight: isToday ? 700 : null
                        }}
                      >
                        {isSameDay(formattedDate, formattedToday)
                          ? "Today"
                          : format(o.date, "MMMM Do")}
                      </TableCell>

                      <TableCell
                        className={classes.tableCell}
                        numeric
                        style={{
                          fontSize: isToday ? "1.2rem" : "1rem",
                          fontWeight: isToday ? 700 : 400,
                          background: botrytisColor(o.botrytis),
                          letterSpacing: 1,
                          color: o.botrytis === "N/A" ? "black" : "black",
                          borderRight: "1px solid #E0E0E0",
                          borderLeft: "1px solid #E0E0E0"
                        }}
                      >
                        {o.botrytis}
                      </TableCell>

                      <TableCell
                        className={classes.tableCell}
                        numeric
                        style={{
                          fontSize: isToday ? "1.2rem" : "1rem",
                          fontWeight: isToday ? 700 : 400,
                          background: anthracnoseColor(o.anthracnose),
                          letterSpacing: 1,
                          color: o.anthracnose === "N/A" ? "black" : "black"
                        }}
                      >
                        {o.anthracnose}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Paper>

        {/*<Hidden smUp>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: 32
            }}
          >
            <div className={classes.segment} style={{ background: "#44AA51" }}>
              <Typography variant="caption">LOW</Typography>
              <Typography variant="caption">&lt;613</Typography>
            </div>
            <div className={classes.segment} style={{ background: "#F6C317" }}>
              <Typography variant="caption">MODERATE</Typography>
              <Typography variant="caption">&ge;613 and &le;863</Typography>
            </div>
            <div className={classes.segment} style={{ background: "#E0413D" }}>
              <Typography variant="caption">HIGH</Typography>
              <Typography variant="caption">&gt;863</Typography>
            </div>
          </div>
          </Hidden> */}

        {/* Missing Days */}
        {missingDays.length !== 0 && !isLoading && (
          <Typography variant="caption" className={classes.missingDays}>
            <span style={{ color: "black" }}>{`(+${missingDays.length}) ${
              missingDays.length === 1 ? "day" : "days"
            } missing:
                  `}</span>
            {missingDays.map((d, i) => {
              if (i === missingDays.length - 1) {
                return <span key={d}>{format(d, "MMMM Do")}.</span>;
              } else {
                return <span key={d}>{format(d, "MMMM Do")}, </span>;
              }
            })}
          </Typography>
        )}
      </div>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(GDDTable)))
);
