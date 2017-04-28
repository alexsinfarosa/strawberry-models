import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";

// utility functions
import takeRight from "lodash/takeRight";
// import isBefore from "date-fns/is_before";
// import isAfter from "date-fns/is_after";

// styles
import "./rTable.styl";
import { Flex, Box } from "reflexbox";

// antd
import { Table } from "antd";
// const info = Modal.info;

@inject("store")
@observer
class RTable extends Component {
  // cellColorTime = (day, record, index) => {
  //   const { endDate } = this.props.store.app;
  //   if (isBefore(day, endDate)) {
  //     return {
  //       props: {
  //         className: "table"
  //       },
  //       children: day
  //     };
  //   } else if (isAfter(day, endDate)) {
  //     return {
  //       props: {
  //         className: "table"
  //       },
  //       children: day
  //     };
  //   } else {
  //     return {
  //       props: {
  //         className: "table"
  //       },
  //       children: day
  //     };
  //   }
  // };

  state = {
    isModalVisible: true
  };

  // handleModal = () => {
  //   this.setState({ isModalVisible: !this.state.isModalVisible });
  // };

  rowColor = (record, index) => {
    if (record.index < 0.50) {
      return "low";
    } else if (record.index >= 0.50 && record.index < 0.70) {
      return "moderate";
    } else {
      return "high";
    }
  };

  // showInfo = () => {
  //   const that = this;
  //   info({
  //     title: "About Bluberry Maggot",
  //     content: "some descriptions",
  //     onOk() {
  //       that.setState({ isModalVisible: !that.state.isModalVisible });
  //     }
  //   });
  // };

  render() {
    const {
      ACISData,
      disease,
      station,
      areRequiredFieldsSet
    } = this.props.store.app;

    const blueberryMaggot = [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        fixed: "left"
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
            dataIndex: "min",
            key: "min"
          },
          {
            title: "Max",
            dataIndex: "max",
            key: "max"
          },
          {
            title: "Avg",
            dataIndex: "average",
            key: "average"
          }
        ]
      }
    ];

    const strawberries = [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        fixed: "left"
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
    return (
      <Flex column>
        <Box>

          <h2>{disease.family} Prediction For {station.name}</h2>
        </Box>
        {disease.family === "Strawberries"
          ? <Flex justify="space-around" wrap>
              <Box mt={3} col={12} lg={5} md={5} sm={12}>
                <h3>Botrytis</h3>

                <Table
                  columns={strawberries}
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
                  columns={strawberries}
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
          : <Flex justify="center">

              <Box mt={3} col={12} lg={10} md={10} sm={12}>
                <h3>Blueberry Maggot</h3>

                <Table
                  columns={blueberryMaggot}
                  bordered
                  rowKey={record => record.date}
                  // rowClassName={this.rowColor}
                  loading={ACISData.length === 0}
                  pagination={false}
                  dataSource={
                    areRequiredFieldsSet
                      ? takeRight(ACISData, 8).map(day => day.blueberryMaggot)
                      : null
                  }
                />
              </Box>

            </Flex>}
        {/* </Flex> */}
      </Flex>
    );
  }
}

export default RTable;
