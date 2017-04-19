import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Select } from "antd";
const Option = Select.Option;

// Utilities
import { states } from "../states";

@inject("store")
@observer
class State extends Component {
  handleChange = value => {
    this.props.store.app.setDisease(value);
    console.log(`selected: ${value}`);
  };
  render() {
    const {
      getCurrentStateStations,
      station,
      selectStation
    } = this.props.store.app;

    const stationList = getCurrentStateStations.map(station => (
      <option key={`${station.id} ${station.network}`}>{station.name}</option>
    ));
    
    return (
      <div>
        <Select
          name="station"
          size="large"
          // defaultValue="Select State"
          placeholder={`Select Station ${getCurrentStateStations.length}`}
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
