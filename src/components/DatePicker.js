import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { LocaleProvider, DatePicker } from "antd";
import enUS from "antd/lib/locale-provider/en_US";
import moment from "moment";
moment.locale("en");
const RangePicker = DatePicker.RangePicker;

@inject("store")
@observer
class Subject extends Component {
  onChange = (dates, dateStrings) => {
    console.log("From: ", dates[0], ", to: ", dates[1]);
    console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
  };
  render() {
    return (
      <div>
        <LocaleProvider locale={enUS}>
          <RangePicker
            style={{ width: 200 }}
            size="large"
            ranges={{
              Today: [moment(), moment()],
              "This Month": [moment(), moment().endOf("month")]
            }}
            format="MMM Do"
            onChange={this.onChange}
          />
        </LocaleProvider>
      </div>
    );
  }
}

export default Subject;
