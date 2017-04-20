import React, { Component } from "react";
import { inject, observer } from "mobx-react";
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
    const { getCurrentStateStations } = this.props.store.app;

    const stationList = getCurrentStateStations.map(station => (
      <Option key={`${station.id} ${station.network}`}>{station.name}</Option>
    ));

    return (
      <div>
        <Select
          name="station"
          size="large"
          // defaultValue="Select State"
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
