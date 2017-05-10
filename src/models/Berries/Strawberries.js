import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import takeRight from "lodash/takeRight";
import { autorun } from "mobx";

import "../components/rTable.styl";
import { Flex, Box } from "reflexbox";
import { Table } from "antd";

// utils
import {
  leafWetnessAndTemps,
  botrytisModel,
  anthracnoseModel
} from "../../utils";

const forecastText = date => {
  return (
    <div>
      <div>{date.split("-")[0]}</div>
      <div style={{ fontSize: ".6rem", color: "red" }}>
        {date.split("-")[1]}
      </div>
    </div>
  );
};

const columns = [
  {
    title: "Date",
    className: "table",
    dataIndex: "date",
    key: "date",
    fixed: "left",
    width: 120,
    render: date => forecastText(date)
  },
  {
    title: "Index",
    className: "table",
    dataIndex: "index",
    key: "index"
  },
  {
    title: "Risk Level",
    className: "table",
    dataIndex: "riskLevel",
    key: "riskLevel"
  }
];

@inject("store")
@observer
export default class Strawberries extends Component {
  constructor(props) {
    super(props);
    autorun(() => this.createDataModel());
  }

  createDataModel = () => {
    const { ACISData, currentYear, startDateYear } = this.props.store.app;

    for (const day of ACISData) {
      // Returns an object {W: Int, T: Int}
      const W_and_T = leafWetnessAndTemps(day, currentYear, startDateYear);

      let indexBotrytis = botrytisModel(W_and_T);
      if (indexBotrytis === "NaN") {
        indexBotrytis = "No Data";
      }
      let indexAnthracnose = anthracnoseModel(W_and_T);
      if (indexAnthracnose === "NaN") {
        indexAnthracnose = "No Data";
      }

      // setup botrytis risk level
      let botrytis = { date: day.dateTable, index: indexBotrytis };
      if (indexBotrytis !== "No Data") {
        if (indexBotrytis < 0.50) {
          botrytis["riskLevel"] = "Low";
          botrytis["color"] = "low";
        } else if (indexBotrytis >= 0.50 && indexBotrytis < 0.70) {
          botrytis["riskLevel"] = "Moderate";
          botrytis["color"] = "moderate";
        } else {
          botrytis["riskLevel"] = "High";
          botrytis["color"] = "high";
        }
      }

      // setup anthracnose risk level
      let anthracnose = {
        date: day.dateTable,
        index: indexAnthracnose
      };
      if (indexAnthracnose !== "No Data") {
        if (indexAnthracnose < 0.50) {
          anthracnose["riskLevel"] = "Low";
          anthracnose["color"] = "low";
        } else if (indexAnthracnose >= 0.50 && indexAnthracnose < 0.70) {
          anthracnose["riskLevel"] = "Low";
          anthracnose["color"] = "low";
        } else {
          anthracnose["riskLevel"] = "Low";
          anthracnose["color"] = "low";
        }
      }

      this.props.store.berry.setStrawberry({ botrytis, anthracnose });
    }
  };

  render() {
    const {
      ACISData,
      subject,
      station,
      areRequiredFieldsSet
    } = this.props.store.app;
    const { strawberry } = this.props.store.berry;
    return (
      <Flex column>
        <Box>
          <h2>{subject.name} Prediction For {station.name}</h2>
        </Box>

        <Flex justify="space-between" wrap>
          <Box mt={3} col={12} lg={5} md={5} sm={12}>
            <h3>Botrytis</h3>

            <Table
              columns={columns}
              rowKey={record => record.date}
              rowClassName={record => record.color}
              loading={ACISData.length === 0}
              pagination={false}
              dataSource={
                areRequiredFieldsSet
                  ? takeRight(strawberry, 8).map(day => day.botrytis)
                  : null
              }
            />
          </Box>

          <Box mt={3} col={12} lg={5} md={5} sm={12}>
            <h3>Anthracnose</h3>

            <Table
              columns={columns}
              rowKey={record => record.date}
              rowClassName={record => record.color}
              loading={ACISData.length === 0}
              pagination={false}
              dataSource={
                areRequiredFieldsSet
                  ? takeRight(strawberry, 8).map(day => day.anthracnose)
                  : null
              }
            />
          </Box>
        </Flex>
      </Flex>
    );
  }
}
