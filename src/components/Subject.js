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
    const { disease } = this.props.store.app;
    return (
      <div style={{ marginBottom: "2rem" }}>
        <p
          style={{
            textAlign: "left",
            lineHeight: 2,
            margin: 0,
            paddingLeft: 24,
            width: 200
          }}
        >
          Disease:
        </p>
        <Select
          name="berry-disease"
          size="large"
          autoFocus
          value={disease ? disease : undefined}
          placeholder="Select Disease"
          style={{ width: 200 }}
          onChange={this.handleChange}
        >
          <Option value="Strawberries">Strawberries</Option>
          <Option value="Blue berries">Blue berries</Option>
        </Select>
      </div>
    );
  }
}

export default Subject;
