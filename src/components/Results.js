import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";

// utility functions
import takeRight from "lodash/takeRight";
// import format from "date-fns/format";
import isBefore from "date-fns/is_before";
import subDays from "date-fns/sub_days";

// style
import "./results.css";

// antd
import { Table } from "antd";
const { Column } = Table;

@inject("store")
@observer
class Results extends Component {
  ciccio = (value, row, index) => {
    const obj = {
      children: value,
      props: {}
    };
    if (index === 4) {
      obj.props.colSpan = 0;
    }
    console.log(obj);
    return obj;
  };
  render() {
    const { ACISData, disease, station, endDate } = this.props.store.app;
    // ACISData.map(day => console.log(toJS(day)));

    const months = ACISData => {
      if (isBefore(subDays(ACISData.date, 1), endDate)) {
        return <Column className="" title="Date" dataIndex="date" key="date" />;
      } else {
        return <Column className="" title="Date" dataIndex="date" key="date" />;
      }
    };

    const displayBotrytis = ACISData => {
      if (ACISData.botrytis < 0.50) {
        return (
          <Column
            className=""
            title="Botrytis"
            dataIndex="botrytis"
            key="botrytis"
          />
        );
      } else if (ACISData.botrytis >= 0.50 && ACISData.botrytis < 0.70) {
        return (
          <Column
            className=""
            title="Botrytis"
            dataIndex="botrytis"
            key="botrytis"
          />
        );
      }
      return (
        <Column
          className=""
          title="Botrytis"
          dataIndex="botrytis"
          key="botrytis"
        />
      );
    };

    const botrytisInfectionRisk = ACISData => {
      if (ACISData.botrytis === "low") {
        return (
          <Column
            className=""
            title="Botrytis Risk Level"
            dataIndex="botrytisIR"
            key="botrytisIR"
          />
        );
      } else if (ACISData.botrytis === "caution") {
        return (
          <Column
            className=""
            title="Botrytis Risk Level"
            dataIndex="botrytisIR"
            key="botrytisIR"
          />
        );
      }
      return (
        <Column
          className=""
          title="Botrytis Risk Level"
          dataIndex="botrytisIR"
          key="botrytisIR"
        />
      );
    };

    const displayAnthracnose = ACISData => {
      if (ACISData.anthracnose < 0.50) {
        return (
          <Column
            className=""
            title="Anthracnose"
            dataIndex="anthracnose"
            key="anthracnose"
          />
        );
      } else if (ACISData.anthracnose >= 0.50 && ACISData.anthracnose < 0.70) {
        return (
          <Column
            className=""
            title="Anthracnose"
            dataIndex="anthracnose"
            key="anthracnose"
          />
        );
      }
      return (
        <Column
          className=""
          title="Anthracnose"
          dataIndex="anthracnose"
          key="anthracnose"
        />
      );
    };

    const anthracnoseInfectionRisk = ACISData => {
      if (ACISData.anthracnoseIR === "low") {
        return (
          <Column
            className=""
            title="Anthracnose Risk Level"
            dataIndex="anthracnoseIR"
            key="anthracnoseIR"
          />
        );
      } else if (ACISData.anthracnoseIR === "caution") {
        return (
          <Column
            className=""
            title="Anthracnose Risk Level"
            dataIndex="anthracnoseIR"
            key="anthracnoseIR"
          />
        );
      }
      return (
        <Column
          className=""
          title="Anthracnose Risk Level"
          dataIndex="anthracnoseIR"
          key="anthracnoseIR"
        />
      );
    };

    return (
      <div>
        <div>
          <h1>Results</h1>
          <h3>{disease} Prediction for {station.name}</h3>
        </div>
        <br />
        <Table
          pagination={false}
          dataSource={takeRight(ACISData, 8)}
          // title={() => `${disease} Prediction for ${station.name}`}
        >
          <Column title="" dataIndex="dateTextDisplay" key="dateTextDisplay" />
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

export default Results;
