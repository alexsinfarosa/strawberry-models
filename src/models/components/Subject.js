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
    const { disease, diseases } = this.props.store.app;
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
          name="berry-diseases"
          size="large"
          autoFocus
          value={disease.family}
          placeholder="Select Disease"
          style={{ width: 200, textAlign: "left" }}
          onChange={this.handleChange}
        >
          {diseases.map((disease, i) => {
            return (
              <Option key={i} value={disease.family}>{disease.family}</Option>
            );
          })}
        </Select>
      </div>
    );
  }
}

export default Subject;
