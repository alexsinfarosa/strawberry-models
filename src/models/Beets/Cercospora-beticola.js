import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import takeRight from "lodash/takeRight";

import "../components/rTable.styl";
import { Flex, Box } from "reflexbox";
import { Table } from "antd";

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
    dataIndex: "date",
    key: "date",
    fixed: "left",
    width: 120,
    render: date => forecastText(date)
  },
  {
    title: "Daily Infection Values",
    dataIndex: "dicv",
    key: "dicv"
  },
  {
    title: "Risk Level",
    dataIndex: "riskLevel",
    key: "riskLevel"
  }
];

@inject("store")
@observer
export default class CercosporaBeticola extends Component {
  render() {
    const {
      ACISData,
      subject,
      station,
      areRequiredFieldsSet
    } = this.props.store.app;
    return (
      <Flex column>
        <Box>
          <h2>{subject.name} Prediction For {station.name}</h2>
        </Box>

        <Flex justify="space-between" wrap>
          <Box mt={3} col={12} lg={5} md={5} sm={12}>
            <h3>Cercospora Beticola</h3>

            <Table
              columns={columns}
              rowKey={record => record.date}
              rowClassName={record => record.color}
              loading={ACISData.length === 0}
              pagination={false}
              dataSource={
                areRequiredFieldsSet
                  ? takeRight(ACISData, 8).map(day => day.botrytis)
                  : null
              }
            />
          </Box>
        </Flex>
      </Flex>
    );
  }
}
