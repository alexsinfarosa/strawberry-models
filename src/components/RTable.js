import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";

// utility functions
import takeRight from "lodash/takeRight";
// import format from "date-fns/format";
import isBefore from "date-fns/is_before";
import isAfter from "date-fns/is_after";
import format from "date-fns/format";

// import subDays from "date-fns/sub_days";

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
  dayColor = (day, record, index) => {
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

  valueColor = (value, record, index) => {
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

  textColor = (text, record, index) => {
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

  render() {
    const {
      ACISData,
      disease,
      station,
      areRequiredFieldsSet,
      isLoading
    } = this.props.store.app;

    const dateTextDisplay = ACISData => {
      return (
        <Column
          className="table"
          title=""
          dataIndex="dateTextDisplay"
          key="dateTextDisplay"
        />
      );
    };

    const months = ACISData => {
      return (
        <Column
          className="table"
          title="Date"
          dataIndex="date"
          key="date"
          render={this.dayColor}
        />
      );
    };

    const displayBotrytis = ACISData => {
      return (
        <Column
          className="table"
          title="Botrytis"
          dataIndex="botrytis"
          key="botrytis"
          render={this.valueColor}
        />
      );
    };

    const botrytisInfectionRisk = ACISData => {
      return (
        <Column
          className="table"
          title="Risk Level"
          dataIndex="botrytisIR"
          key="botrytisIR"
          render={this.textColor}
        />
      );
    };

    const displayAnthracnose = ACISData => {
      return (
        <Column
          className="table"
          title="Anthracnose"
          dataIndex="anthracnose"
          key="anthracnose"
          render={this.valueColor}
        />
      );
    };

    const anthracnoseInfectionRisk = ACISData => {
      return (
        <Column
          className="table"
          title="Risk Level"
          dataIndex="anthracnoseIR"
          key="anthracnoseIR"
          render={this.textColor}
        />
      );
    };
    return (
      <div className="table">
        <h1>Results</h1>
        <h3>{disease} Prediction for {station.name}</h3>
        <br />

        <Table
          loading={ACISData.length === 0}
          pagination={false}
          dataSource={areRequiredFieldsSet ? takeRight(ACISData, 8) : null}
        >
          {dateTextDisplay(ACISData)}
          {months(ACISData)}
          {displayBotrytis(ACISData)}
          {botrytisInfectionRisk(ACISData)}

          {displayAnthracnose(ACISData)}
          {anthracnoseInfectionRisk(ACISData)}
        </Table>

      </div>
    );
  }
}

export default rTable;
