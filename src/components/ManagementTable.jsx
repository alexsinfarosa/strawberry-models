import React, { Component } from "react";
import { inject, observer } from "mobx-react";

// material-ui
import withRoot from "../withRoot";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Switch from "@material-ui/core/Switch";

import isWithinInterval from "date-fns/isWithinInterval";
import { format, isSameDay, differenceInDays } from "date-fns/esm";

// styles
const styles = theme => ({
  root: {
    width: "100%",
    marginBottom: theme.spacing.unit * 8
  },
  paper: {
    padding: 16
  },
  ul: {
    fontFamily: "Roboto"
  },
  em: {
    fontSize: "0.9rem",
    fontWeight: "bold",
    color: "black",
    letterSpacing: 1
  },
  cell: {
    fontSize: "0.9rem",
    lineHeight: 1.4
  },
  header: {
    textAlign: "center",
    margin: 0,
    padding: 0,
    // borderRight: "1px solid #E0E0E0",
    fontSize: 16,
    color: "black"
  },
  tableCell: {
    fontSize: "1rem",
    padding: "0 10px",
    textAlign: "center",
    "@media (min-width: 576px)": {
      fontSize: "1rem"
    }
  }
});

class ManagementTable extends Component {
  state = {
    hasBloomed: false
  };
  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  timeColor = date => {
    const formattedDate = format(date, "YYYY-MM-DD");
    const formattedToday = format(new Date(), "YYYY-MM-DD");
    if (isSameDay(formattedDate, formattedToday)) return;
    if (differenceInDays(formattedDate, formattedToday) < 0) return "#0FA3B1";
    if (differenceInDays(formattedDate, formattedToday) >= 0) return "#F9E04C";
  };

  render() {
    const { classes } = this.props;
    const { dateOfInterest } = this.props.appStore.paramsStore;
    const { dataForTable } = this.props.appStore.currentModel;
    const year = dateOfInterest.getFullYear();

    const isDormant = isWithinInterval(dateOfInterest, {
      start: new Date(`${year}-01-01`),
      end: new Date(`${year}-02-15`)
    });

    const isPrebloom = isWithinInterval(dateOfInterest, {
      start: new Date(`${year}-02-16`),
      end: new Date(`${year}-03-15`)
    });

    const isBloom = isWithinInterval(dateOfInterest, {
      start: new Date(`${year}-03-16`),
      end: new Date(`${year}-10-31`)
    });

    return (
      <div className={classes.root}>
        {isDormant && <DormantMsg classes={classes} />}
        {(isPrebloom || isBloom) && (
          <PrebloomMsg
            classes={classes}
            hasBloomed={this.state.hasBloomed}
            handleChange={this.handleChange}
            isBloom={isBloom}
          />
        )}
        {isBloom && (
          <AnotherTable
            classes={classes}
            dateOfInterest={dateOfInterest}
            dataForTable={dataForTable}
            timeColor={this.timeColor}
          />
        )}
      </div>
    );
  }
}

const DormantMsg = ({ classes }) => (
  <Paper elevetion={2} className={classes.paper}>
    <Typography variant="display1" component="h3" gutterBottom>
      Dormant
    </Typography>

    <br />
    <Typography variant="subheading" gutterBottom>
      Infection risk model results will display beginning February 15. To see
      model results for previous seasons, select an ending date of interest in
      the range from March 16 to October 31.
    </Typography>
    <br />
    <Typography variant="title" component="h3" gutterBottom>
      NOTE: the key factors affecting disease susceptibility:
    </Typography>
    <Typography variant="subheading">
      <ul className={classes.ul}>
        <li>
          <b>History of the disease in the planting:</b> if outbreaks of either
          disease have occurred in previous seasons to a greater or lesser
          extent, then the present risk of disease is greater or lesser,
          respectively.
        </li>
        <li>
          <b>Planting age and potential inoculum build-up:</b> older plantings
          have higher levels of disease inoculum build-up from previous seasons.
        </li>
        <li>
          <b>Crop phenology:</b> Both diseases can infect flowers in bloom and
          wounded fruit at harvest. The fungi causing anthracnose can infect
          other tissues including the crown and petioles.{" "}
        </li>
        <li>
          <b>Renovation practices the previous year:</b> effective renovation
          promotes healthy plantings, reducing risk to both diseases.
        </li>
        <li>
          <b>Nitrogen:</b> spring applications of nitrogen can increase the
          potential for Botrytis infection and high levels of nitrogen in soil
          favor anthracnose.
        </li>
      </ul>
    </Typography>
  </Paper>
);

const PrebloomMsg = ({ classes, hasBloomed, handleChange, isBloom }) => (
  <Paper elevetion={2} className={classes.paper}>
    <div>
      <Typography variant="display1" component="h3" gutterBottom>
        Has Bloom Begun?
      </Typography>
      <div>
        No
        <Switch
          checked={hasBloomed}
          onChange={handleChange("hasBloomed")}
          value="hasBloomed"
        />
        Yes
      </div>
    </div>
    <br />

    {/* NO */}
    {!hasBloomed && (
      <div>
        <Typography variant="title" component="h3" gutterBottom>
          Strawberry Botrytis and Anthracnose Infection Risk Model
          Considerations:
        </Typography>
        <Typography variant="subheading">
          <ul className={classes.ul}>
            <li>
              These infection risk tools are intended for field-grown
              strawberries and work equally well for June-bearing and day
              neutral varieties.
            </li>
            <li>
              The calculated infection risk may be applicable to low tunnel
              production, if the low tunnel sides were pulled up, allowing water
              (rain, irrigation) to wet plants.
            </li>
            <li>
              The calculated infection risk may not be applicable to high tunnel
              production.
            </li>
            <li>
              Use either the Botrytis Infection Risk Level or the Anthracnose
              Infection Risk Level to manage the disease of greatest concern.
            </li>
            <li>
              Fungicide applications are suggested when “Infection Risk Levels”
              are moderate or high and there has been more than 7-14 days since
              the last application or more than 1” of rain. High risk indicates
              that weather conditions are highly conducive to infection and
              highly efficacious fungicides should be used for either disease.
            </li>
            <li>
              Disease risk is calculated on a 24-hour clock, from noon to noon.
            </li>
          </ul>
        </Typography>
      </div>
    )}

    {(hasBloomed || isBloom) && (
      <Table style={{ marginBottom: 64 }}>
        <TableHead>
          <TableHead>
            <TableRow style={{ background: "#D0CD94" }}>
              <TableCell className={classes.em}>
                Botrytis Fruit Rot or Gray Mold
              </TableCell>
              <TableCell className={classes.em}>Botrytis Management</TableCell>
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow>
              <TableCell className={classes.cell}>
                Lesions remain firm and brown while fruit is green. Lesions
                expand and soften as fruit ripens. A powdery gray mass of spores
                may cover infected berries.
              </TableCell>
              <TableCell className={classes.cell}>
                Infections occur primarily Protect flowers when Infection Risk
                is moderate or high. Monitor fields and harvests for gray mold.
                Protect fruit if disease is present and Botrytis Infection Risk
                is moderate or high. during bloom. from early
              </TableCell>
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow>
              <TableCell className={classes.em}>
                Botrytis Infection Risk Levels
              </TableCell>
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell className={classes.em}>{`Low < 0.5`}</TableCell>
              <TableCell className={classes.cell}>
                No need for fungicides against Botrytis.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                className={classes.em}
              >{`Moderate ≥ 0.5 and <0.7`}</TableCell>
              <TableCell className={classes.cell}>
                Take into account the susceptibility. If several factors
                contribute to greater susceptibility, apply a fungicide if there
                has been no application for 7-14 days.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.em}>{`High ≥ 0.7`}</TableCell>
              <TableCell className={classes.cell}>
                If no fungicides have been applied in the last 7-14 days, apply
                a highly effective fungicide as soon as possible.
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Anthracnose */}
          <TableHead>
            <TableRow style={{ background: "#92DCE5" }}>
              <TableCell className={classes.em}>
                Anthracnose Fruit Rot
              </TableCell>
              <TableCell className={classes.em}>
                Anthracnose Management
              </TableCell>
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow>
              <TableCell className={classes.cell}>
                One or more circular, tan or light brown spots usually about 1/8
                to 1/4 inch in diameter occur on both green and ripe fruit and
                become sunken and darker. On ripe fruit, lesions may be sunken
                and filled with pink slimy spore masses.
              </TableCell>
              <TableCell className={classes.cell}>
                Open flowers and ripening and ripe fruit are most susceptible to
                anthracnose. The disease is favored during warm, wet weather
                conditions. Monitor fields and harvests for anthracnose and
                quickly begin a management program once the disease is detected
                and Anthracnose Infection Risk is moderate or high.
              </TableCell>
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow>
              <TableCell className={classes.em}>
                Anthracnose Infection Risk Levels
              </TableCell>
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell className={classes.em}>{`Low < 0.15`}</TableCell>
              <TableCell className={classes.cell}>
                No need for fungicides against anthracnose.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                className={classes.em}
              >{`Moderate ≥ 0.15 and <0.5`}</TableCell>
              <TableCell className={classes.cell}>
                Take into account the susceptibility. If several factors
                contribute to greater susceptibility, apply a fungicide if there
                has been no application for 7-14 days.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.em}>{`High ≥ 0.5`}</TableCell>
              <TableCell className={classes.cell}>
                If no fungicides have been applied in the last 7-14 days, apply
                a highly effective fungicide as soon as possible.
              </TableCell>
            </TableRow>
          </TableHead>
        </TableHead>
      </Table>
    )}

    <br />
    <Typography variant="title" component="h3" gutterBottom>
      NOTE: the key factors affecting disease susceptibility:
    </Typography>
    <Typography variant="subheading">
      <ul className={classes.ul}>
        <li>
          <b>History of the disease in the planting:</b> if outbreaks of either
          disease have occurred in previous seasons to a greater or lesser
          extent, then the present risk of disease is greater or lesser,
          respectively.
        </li>
        <li>
          <b>Planting age and potential inoculum build-up:</b> older plantings
          have higher levels of disease inoculum build-up from previous seasons.
        </li>
        <li>
          <b>Crop phenology:</b> Both diseases can infect flowers in bloom and
          wounded fruit at harvest. The fungi causing anthracnose can infect
          other tissues including the crown and petioles.{" "}
        </li>
        <li>
          <b>Renovation practices the previous year:</b> effective renovation
          promotes healthy plantings, reducing risk to both diseases.
        </li>
        <li>
          <b>Nitrogen:</b> spring applications of nitrogen can increase the
          potential for Botrytis infection and high levels of nitrogen in soil
          favor anthracnose.
        </li>
      </ul>
    </Typography>

    <br />

    <Typography variant="subheading">
      <b>When a prior fungicide interval is in place.</b> After applying a
      fungicide and during the labeled fungicide interval (often 7-14 days),
      ignore the risk levels. If ≥1 inch of rain falls during the spray
      interval, the fungicide has likely weathered off, therefore follow the
      infection risk levels and apply a fungicide accordingly. As the spray
      interval expires, assess and re-assess the risk levels and apply a
      fungicide accordingly.
    </Typography>
  </Paper>
);

const AnotherTable = ({ classes, dateOfInterest, dataForTable, timeColor }) => {
  return (
    <Paper elevetion={2} className={classes.paper}>
      <Typography variant="subheading" component="h3" gutterBottom>
        <b>
          Always re-check Infection Risk Levels that are based on forecasted
          weather data.
        </b>{" "}
        Weather forecasts may change and so will the calculated infection risk
        level.
      </Typography>
      <br />
      <Typography variant="title" component="h3" gutterBottom align="center">
        Strawberry Disease Forecast Environmental Variables Summary
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2} className={classes.header}>
              Date (noon-to-noon)
            </TableCell>
            <TableCell className={classes.header}>Rain (in)</TableCell>
            <TableCell className={classes.header}>
              Temp during LW (avg °C)
            </TableCell>
            <TableCell className={classes.header}>
              LW or RH ≥ 90% (hrs)
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
                    background: timeColor(o.date),
                    borderBottom: "none",
                    borderTop: "none"
                  }}
                />
                <TableCell
                  className={classes.tableCell}
                  style={{
                    // fontSize: isToday ? "1.3rem" : null,
                    fontWeight: isToday ? 700 : null
                  }}
                >
                  {isSameDay(formattedDate, formattedToday)
                    ? "Today"
                    : format(o.date, "MMMM Do")}
                </TableCell>
                <TableCell
                  className={classes.tableCell}
                  style={{
                    // fontSize: isToday ? "1.3rem" : null,
                    fontWeight: isToday ? 700 : null
                  }}
                >
                  {o.obj === null ? "-" : o.obj.pcpn.toFixed(1)}
                </TableCell>
                <TableCell
                  className={classes.tableCell}
                  style={{
                    // fontSize: isToday ? "1.3rem" : null,
                    fontWeight: isToday ? 700 : null
                  }}
                >
                  {o.obj === null ? "-" : o.obj.avgT.toFixed(1)}
                </TableCell>
                <TableCell
                  className={classes.tableCell}
                  style={{
                    // fontSize: isToday ? "1.3rem" : null,
                    fontWeight: isToday ? 700 : null
                  }}
                >
                  {o.obj === null ? "-" : o.obj.w.toFixed(0)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <br />
      <div>
        <Typography variant="title" component="h3" gutterBottom>
          Strawberry Botrytis and Anthracnose Infection Risk Model
          Considerations:
        </Typography>
        <Typography variant="subheading">
          <ul className={classes.ul}>
            <li>
              These infection risk tools are intended for field-grown
              strawberries and work equally well for June-bearing and day
              neutral varieties.
            </li>
            <li>
              The calculated infection risk may be applicable to low tunnel
              production, if the low tunnel sides were pulled up, allowing water
              (rain, irrigation) to wet plants.
            </li>
            <li>
              The calculated infection risk may not be applicable to high tunnel
              production.
            </li>
            <li>
              Use either the Botrytis Infection Risk Level or the Anthracnose
              Infection Risk Level to manage the disease of greatest concern.
            </li>
            <li>
              Fungicide applications are suggested when “Infection Risk Levels”
              are moderate or high and there has been more than 7-14 days since
              the last application or more than 1” of rain. High risk indicates
              that weather conditions are highly conducive to infection and
              highly efficacious fungicides should be used for either disease.
            </li>
            <li>
              Disease risk is calculated on a 24-hour clock, from noon to noon.
            </li>
          </ul>
        </Typography>
      </div>
    </Paper>
  );
};

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(ManagementTable)))
);
