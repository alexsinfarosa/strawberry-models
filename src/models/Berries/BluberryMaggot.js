import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import takeRight from "lodash/takeRight";

import { Flex, Box } from "reflexbox";
import { Table } from "antd";

import Graph from "../components/Graph/Graph";

const columns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    fixed: "left",
    width: 60
  },
  {
    title: "Degree Days",
    children: [
      {
        title: "Daily",
        dataIndex: "dd",
        key: "dd"
      },
      {
        title: "Cumulative",
        dataIndex: "cdd",
        key: "cdd"
      }
    ]
  },
  {
    title: "Temperature (˚F)",
    children: [
      {
        title: "Min",
        dataIndex: "Tmin",
        key: "Tmin"
      },
      {
        title: "Max",
        dataIndex: "Tmax",
        key: "Tmax"
      },
      {
        title: "Avg",
        dataIndex: "Tavg",
        key: "Tavg"
      }
    ]
  }
];

@inject("store")
@observer
export default class BluberryMaggot extends Component {
  render() {
    const {
      ACISData,
      disease,
      station,
      areRequiredFieldsSet
    } = this.props.store.app;
    ACISData.map(e => console.log(e));
    return (
      <Flex column>
        <Box>
          <h2>{disease.family} Prediction For {station.name}</h2>
        </Box>

        <Flex justify="center">

          <Box mt={3} col={12} lg={10} md={10} sm={12}>
            <h3>Blueberry Maggot</h3>

            <Table
              columns={columns}
              bordered
              rowKey={record => record.date}
              loading={ACISData.length === 0}
              pagination={false}
              dataSource={areRequiredFieldsSet ? takeRight(ACISData, 8) : null}
            />
          </Box>

        </Flex>
        {/* {areRequiredFieldsSet && <Graph />} */}
      </Flex>
    );
  }
}
