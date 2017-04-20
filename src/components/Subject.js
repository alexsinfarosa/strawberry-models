import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Select } from "antd";
const Option = Select.Option;

@inject("store")
@observer
class Subject extends Component {
  handleChange = value => {
    this.props.store.app.setDisease(value);
    console.log(`disease: ${value}`);
  };
  render() {
    return (
      <div>
        <Select
          name="berry-disease"
          size="large"
          autoFocus
          // defaultValue="Select Berry"
          placeholder="Select Disease"
          style={{ width: 200 }}
          onChange={this.handleChange}
        >
          <Option value="Strawberries">Strawberries</Option>
        </Select>
      </div>
    );
  }
}

export default Subject;
