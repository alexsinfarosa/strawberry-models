import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import takeRight from "lodash/takeRight";

import "../components/rTable.styl";
import { Flex, Box } from "reflexbox";
import { Table } from "antd";

const columns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    fixed: "left",
    width: 120
  },
  {
    title: "Index",
    dataIndex: "index",
    key: "index"
  },
  {
    title: "Risk Level",
    dataIndex: "riskLevel",
    key: "riskLevel"
  }
];

@inject("store")
@observer
export default class Strawberries extends Component {
  rowColor = (record, index) => {
    if (record.index < 0.50) {
      return "low";
    } else if (record.index >= 0.50 && record.index < 0.70) {
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
    return (
      <Flex column>
        <Box>
          <h2>{disease.family} Prediction For {station.name}</h2>
        </Box>

        <Flex justify="space-around" wrap>
          <Box mt={3} col={12} lg={5} md={5} sm={12}>
            <h3>Botrytis</h3>

            <Table
              columns={columns}
              rowKey={record => record.date}
              rowClassName={this.rowColor}
              loading={ACISData.length === 0}
              pagination={false}
              dataSource={
                areRequiredFieldsSet
                  ? takeRight(ACISData, 8).map(day => day.botrytis)
                  : null
              }
            />
          </Box>

          <Box mt={3} col={12} lg={5} md={5} sm={12}>
            <h3>Anthracnose</h3>

            <Table
              columns={columns}
              rowKey={record => record.date}
              rowClassName={this.rowColor}
              loading={ACISData.length === 0}
              pagination={false}
              dataSource={
                areRequiredFieldsSet
                  ? takeRight(ACISData, 8).map(day => day.anthracnose)
                  : null
              }
            />
          </Box>
        </Flex>
      </Flex>
    );
  }
}
