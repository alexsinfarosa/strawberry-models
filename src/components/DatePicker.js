import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { LocaleProvider, DatePicker } from "antd";

// language requirements
import enUS from "antd/lib/locale-provider/en_US";
import moment from "moment";
moment.locale("en");

@inject("store")
@observer
class Subject extends Component {
  onChange = (date, dateString) => {
    console.log(date, dateString);
  };
  render() {
    return (
      <div style={{ marginBottom: "2rem" }}>
        <p>Date: </p>
        <p><small>Start Date: January 1st</small></p>
        <LocaleProvider locale={enUS}>
          <DatePicker
            style={{ width: 200 }}
            size="large"
            format="MMM DD YYYY"
            onChange={this.onChange}
          />
        </LocaleProvider>
      </div>
    );
  }
}

export default Subject;
