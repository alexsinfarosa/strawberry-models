import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";
import { Select } from "antd";
const Option = Select.Option;

// Utilities
// import { states } from "../states";

@inject("store")
@observer
class State extends Component {
  handleChange = value => {
    this.props.store.app.setStation(value);
    console.log(`station: ${value}`);
  };
  render() {
    const { getCurrentStateStations, getStation } = this.props.store.app;

    const stationList = getCurrentStateStations.map(station => (
      <Option key={`${station.id} ${station.network}`} value={station.name}>
        {station.name}
      </Option>
    ));

    return (
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ lineHeight: 2, margin: 0, width: 200 }}>Station: </p>
        <Select
          name="station"
          size="large"
          value={getStation.name}
          placeholder={`Select Station (${getCurrentStateStations.length})`}
          style={{ width: 200 }}
          onChange={this.handleChange}
        >
          {stationList}
        </Select>
      </div>
    );
  }
}

export default State;
