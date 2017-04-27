import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Select } from "antd";
const Option = Select.Option;

const diseases = [
  { name: "Strawberries", model: "strawberryModel" },
  { name: "Blueberries", model: "blueberryModel" }
];

@inject("store")
@observer
class Subject extends Component {
  handleChange = value => {
    const disease = diseases.find(disease => disease.name === value);

    // Fetch data on disease change;
    this.props.store.app.setDisease({});
    this.props.store.app.setDisease(disease);
    console.log(`disease: ${disease.name}`);
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
          value={disease.name}
          placeholder="Select Disease"
          style={{ width: 200, textAlign: "left" }}
          onChange={this.handleChange}
        >
          {diseases.map((disease, i) => {
            return <Option key={i} value={disease.name}>{disease.name}</Option>;
          })}
        </Select>
      </div>
    );
  }
}

export default Subject;
