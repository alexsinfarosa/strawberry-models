import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";
// import { Select } from "antd";
import Select from "antd/lib/select";
import "antd/lib/select/style/css";
const Option = Select.Option;

@inject("store")
@observer
class Subject extends Component {
  handleChange = value => {
    this.props.store.app.setSubject(value);
    // console.log(`subject: ${value}`);
  };
  render() {
    const { subject, subjects, model } = this.props.store.app;
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
          name="subject"
          size="large"
          autoFocus
          value={subject.name}
          placeholder="Select Disease"
          style={{ width: 200, textAlign: "left" }}
          onChange={this.handleChange}
        >
          {subjects[model].map((subject, i) => {
            return (
              <Option key={i} value={subject.name}>
                {subject.name}
              </Option>
            );
          })}
        </Select>
      </div>
    );
  }
}

export default Subject;
