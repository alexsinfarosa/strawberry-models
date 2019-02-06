import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import planeSel from "../assets/planeSel.png";

// map
import { Map, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";

// utils
import { matchIconsToStations } from "../utils/utils";

// material-ui
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Paper from "@material-ui/core/Paper";

// styles
const styles = theme => ({
  root: {
    width: "100%",
    height: "100%",
    marginTop: theme.spacing.unit * 4
  }
});

class USMap extends Component {
  handleStateStationFromMap = station => {
    const { setStateStationFromMap } = this.props.appStore.paramsStore;
    setStateStationFromMap(station);
    this.props.toggleModal();
    this.props.closeDrawer();
  };

  render() {
    const { classes } = this.props;
    const { state, stations, station } = this.props.appStore.paramsStore;

    const stationsWithMatchedIcons = stations.map(station => {
      station["icon"] = matchIconsToStations(station, state);
      return station;
    });

    // Marker list
    const MarkerList = stationsWithMatchedIcons.map(stn => (
      <Marker
        key={`${stn.id} ${stn.network}`}
        position={[stn.lat, stn.lon]}
        icon={
          station && stn.id === station.id
            ? L.icon({
                iconUrl: stn.network === "icao" ? planeSel : stn.icon,
                iconSize: [14, 14]
              })
            : L.icon({
                iconUrl: stn.icon,
                iconSize: [12, 12]
              })
        }
        title={stn.name}
        onClick={() => this.handleStateStationFromMap(stn)}
      >
        <Tooltip>
          <span>
            {stn.name}, {stn.state}
          </span>
        </Tooltip>
      </Marker>
    ));

    return (
      <Paper className={classes.root}>
        <Map
          style={{ width: "100%", height: "100%" }}
          bounds={state.bbox}
          ref={m => (this.leafletMap = m)}
          scrollWheelZoom={false}
        >
          <TileLayer url="http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}" />
          {MarkerList}
        </Map>
      </Paper>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(USMap)))
);
