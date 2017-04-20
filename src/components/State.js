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
    this.props.store.app.setState(value);
    console.log(`state: ${value}`);
  };
  render() {
    const stateList = states.map(state => (
      <Option key={state.postalCode} value={state.name}>{state.name}</Option>
    ));
    return (
      <div>
        <Select
          name="state"
          size="large"
          // defaultValue="Select State"
          placeholder="Select State"
          style={{ width: 200 }}
          onChange={this.handleChange}
        >
          {stateList}
        </Select>
      </div>
    );
  }
}

export default State;
