import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { when } from "mobx";
import { DatePicker } from "antd";
import moment from "moment";

@inject("store")
@observer
class Subject extends Component {
  constructor(props) {
    super(props);
    when(
      () => this.props.store.app.endDate === null,
      () => this.props.store.app.setEndDate(moment())
    );
  }

  onChange = (date, dateString) => {
    // console.log(date, dateString);
    this.props.store.app.setEndDate(dateString);
  };

  render() {
    const { endDate } = this.props.store.app;
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
          Date:{" "}
        </p>
        <p
          style={{
            textAlign: "left",
            lineHeight: 1,
            margin: 0,
            paddingLeft: 24,
            width: 200
          }}
        >
          <small>Start Date: January 1st</small>
        </p>
        <DatePicker
          style={{ width: 200, textAlign: "left" }}
          size="large"
          allowClear={false}
          value={moment(endDate)}
          format="MMM DD YYYY"
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default Subject;
