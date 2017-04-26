import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";

// utility functions
import takeRight from "lodash/takeRight";
import isBefore from "date-fns/is_before";
import isAfter from "date-fns/is_after";
import format from "date-fns/format";

// style
import "./rTable.styl";

// styled-components
// import { Column } from "./styles";

// antd
import { Table } from "antd";
const { Column } = Table;

@inject("store")
@observer
class rTable extends Component {
  cellColorTime = (day, record, index) => {
    const { endDate } = this.props.store.app;
    if (isBefore(day, endDate)) {
      return {
        props: {
          className: "table"
        },
        children: format(day, "MMM D")
      };
    } else if (isAfter(day, endDate)) {
      return {
        props: {
          className: "table"
        },
        children: `${format(day, "MMM D")}`
      };
    } else {
      return {
        props: {
          className: "table"
        },
        children: format(day, "MMM D")
      };
    }
  };

  cellColorDay = (day, record, index) => {
    const { endDate } = this.props.store.app;
    if (isBefore(day, endDate)) {
      return {
        props: {
          className: "table"
        },
        children: format(day, "MMM D")
      };
    } else if (isAfter(day, endDate)) {
      return {
        props: {
          className: "table"
        },
        children: `${format(day, "MMM D")}`
      };
    } else {
      return {
        props: {
          className: "table"
        },
        children: format(day, "MMM D")
      };
    }
  };

  cellColorValue = (value, record, index) => {
    if (value < 0.50) {
      return {
        props: {
          className: "table low"
        },
        children: value
      };
    } else if (value >= 0.50 && value < 0.70) {
      return {
        props: {
          className: "table moderate"
        },
        children: value
      };
    } else {
      return {
        props: {
          className: "table high"
        },
        children: value
      };
    }
  };

  cellColorRiskLevel = (text, record, index) => {
    if (text === "Low") {
      return {
        props: {
          className: "table low"
        },
        children: text
      };
    } else if (text === "Moderate") {
      return {
        props: {
          className: "table moderate"
        },
        children: text
      };
    } else {
      return {
        props: {
          className: "table high"
        },
        children: text
      };
    }
  };

  rowColor = (record, index) => {
    const { value } = record;
    if (value < 0.50) {
      return "low";
    } else if (value >= 0.50 && value < 0.70) {
      return "moderate";
    } else {
      return "high";
    }
  };

  render() {
    const {
      ACISData,
      disease,
      station,
      areRequiredFieldsSet
    } = this.props.store.app;

    const column = (width, className, title, dataIndex, key, render) => {
      return (
        <Column
          width={width}
          className={className}
          title={title}
          dataIndex={dataIndex}
          key={key}
          render={render}
        />
      );
    };
    return (
      <div className="table" style={{ maxWidth: 400, margin: "0 auto" }}>
        <h1>Results</h1>
        <br /><br />
        <h3>
          <strong>Botrytis - </strong>{disease} Prediction for {station.name}
        </h3>
        <br />
        <Table
          rowKey={record => record.date}
          rowClassName={this.rowColor}
          loading={ACISData.length === 0}
          pagination={false}
          dataSource={
            areRequiredFieldsSet
              ? takeRight(ACISData, 8).map(day => day.botrytis)
              : null
          }
        >
          {column(80, "table", "", "time", "time")}
          {column(120, "table", "Date", "date", "date", this.cellColorDay)}
          {column(120, "table", "Botrytis", "value", "value")}
          {column(120, "table", "Risk Level", "riskLevel", "riskLevel")}
        </Table>

        <br /><br />
        <h3>
          <strong>Anthracnose - </strong>{disease} Prediction for {station.name}
        </h3>
        <br />
        <Table
          rowKey={record => record.date}
          rowClassName={this.rowColor}
          loading={ACISData.length === 0}
          pagination={false}
          dataSource={
            areRequiredFieldsSet
              ? takeRight(ACISData, 8).map(day => day.anthracnose)
              : null
          }
        >
          {column(80, "table", "", "time", "time")}
          {column(120, "table", "Date", "date", "date", this.cellColorDay)}
          {column(120, "table", "Botrytis", "value", "value")}
          {column(120, "table", "Risk Level", "riskLevel", "riskLevel")}
        </Table>

      </div>
    );
  }
}

export default rTable;
