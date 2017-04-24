import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";
import { DatePicker } from "antd";

// language requirements
// import enUS from "antd/lib/locale-provider/en_US";
import moment from "moment";
// moment.locale("en");

@inject("store")
@observer
class Subject extends Component {
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
        {/* <LocaleProvider locale={enUS}> */}
        <DatePicker
          style={{ width: 200, textAlign: "left" }}
          size="large"
          value={moment(endDate)}
          format="MMM DD YYYY"
          onChange={this.onChange}
        />
        {/* </LocaleProvider> */}
      </div>
    );
  }
}

export default Subject;
