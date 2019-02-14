import React, { Component, Fragment } from "react";
import { inject, observer } from "mobx-react";

import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";

import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import InputAdornment from "@material-ui/core/InputAdornment";
import PlaceIcon from "@material-ui/icons/Place";
import Input from "@material-ui/core/Input";

// Date picker
import DatePicker from "material-ui-pickers/DatePicker";

// states
import { allStates } from "../assets/states";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%"
  },
  formControl: {
    minWidth: 120,
    width: "80%",
    margin: "32px auto"
  },
  formControlIcon: {
    minWidth: 120,
    width: "80%",
    margin: "0px auto",
    marginTop: 8,
    textAlign: "center"
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  toolbar: theme.mixins.toolbar,
  center: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textTransform: "uppercase"
  },
  link: {
    color: "#a52c25",
    textDecoration: "none"
  },
  iconMap: {
    margin: "0 auto",
    marginTop: theme.spacing.unit * 2,
    borderRadius: 10
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  styledBtn: {
    minWidth: 120,
    width: "80%",
    margin: "0px auto",
    marginTop: 2,
    textAlign: "center",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "baseline"
  },
  riskLevel: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 25,
    border: "1px solid #eee",
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10
  }
});

class LeftPanel extends Component {
  render() {
    const { classes } = this.props;
    const {
      postalCode,
      setPostalCode,
      filteredStationList,
      stationID,
      setStationID,
      dateOfInterest,
      setDateOfInterest
    } = this.props.appStore.paramsStore;

    const stateList = allStates.map(state => (
      <option key={state.postalCode} value={state.postalCode}>
        {state.name}
      </option>
    ));

    let stationList = [];
    if (filteredStationList) {
      stationList = filteredStationList.map(stn => (
        <option key={stn.id} value={stn.id}>
          {stn.name}
        </option>
      ));
    }

    return (
      <Fragment>
        <div className={`${classes.toolbar} ${classes.center}`}>
          <Typography
            variant="display1"
            color="secondary"
            gutterBottom
            style={{ marginTop: 16 }}
          >
            NEWA
          </Typography>
          <Typography variant="subheading" style={{ marginBottom: 32 }}>
            <a
              href="https://www.cornell.edu/"
              className={classes.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cornell University
            </a>
          </Typography>
        </div>

        <Button
          variant="raised"
          onClick={this.props.toggleModal}
          aria-label="map"
          color="primary"
          className={classes.iconMap}
        >
          MAP <PlaceIcon className={classes.rightIcon} />
        </Button>

        <form className={classes.root} noValidate autoComplete="off">
          {/* state */}
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="postalCode">State</InputLabel>
            <NativeSelect
              value={postalCode}
              onChange={setPostalCode}
              input={<Input id="postalCode" />}
            >
              <option value="" />
              {stateList}
            </NativeSelect>
          </FormControl>

          {/* station */}
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="stationID">
              Station ({stationList.length})
            </InputLabel>
            <NativeSelect
              value={stationID}
              onChange={e => {
                setStationID(e);
                this.props.closeDrawer();
              }}
              input={<Input id="stationID" />}
            >
              <option value="" />
              {stationList}
            </NativeSelect>
          </FormControl>

          <div className={classes.formControl}>
            <DatePicker
              style={{ width: "100%" }}
              label="Date of Interest"
              value={dateOfInterest}
              onChange={e => {
                setDateOfInterest(e);
                this.props.closeDrawer();
              }}
              format="MMMM Do, YYYY"
              disableFuture
              showTodayButton
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton style={{ marginRight: -10 }}>
                      <Icon>date_range</Icon>
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>

          <div className={classes.formControl} style={{ marginBottom: 16 }}>
            <Typography> Botrytis Risk Levels</Typography>
          </div>
          <div className={classes.styledBtn}>
            <div
              className={classes.riskLevel}
              style={{ background: "#44AA51" }}
            >
              <Typography variant="caption">LOW</Typography>
            </div>
            <Typography variant="caption">&lt;0.50</Typography>
          </div>
          <div className={classes.styledBtn}>
            <div
              className={classes.riskLevel}
              style={{ background: "#F6C317" }}
            >
              <Typography variant="caption">MODERATE</Typography>
            </div>
            <Typography variant="caption">&ge;0.50 and &lt;0.70</Typography>
          </div>
          <div className={classes.styledBtn}>
            <div
              className={classes.riskLevel}
              style={{ background: "#E0413D" }}
            >
              <Typography variant="caption">HIGH</Typography>
            </div>
            <Typography variant="caption">&ge;0.70</Typography>
          </div>

          <br />

          <div className={classes.formControl} style={{ marginBottom: 16 }}>
            <Typography> Anthracnose Risk Levels</Typography>
          </div>
          <div className={classes.styledBtn}>
            <div
              className={classes.riskLevel}
              style={{ background: "#44AA51" }}
            >
              <Typography variant="caption">LOW</Typography>
            </div>
            <Typography variant="caption">&lt;0.15</Typography>
          </div>
          <div className={classes.styledBtn}>
            <div
              className={classes.riskLevel}
              style={{ background: "#F6C317" }}
            >
              <Typography variant="caption">MODERATE</Typography>
            </div>
            <Typography variant="caption">&ge;0.15 and &lt;0.50</Typography>
          </div>
          <div className={classes.styledBtn}>
            <div
              className={classes.riskLevel}
              style={{ background: "#E0413D" }}
            >
              <Typography variant="caption">HIGH</Typography>
            </div>
            <Typography variant="caption">&ge;0.50</Typography>
          </div>
        </form>
      </Fragment>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(LeftPanel)))
);
