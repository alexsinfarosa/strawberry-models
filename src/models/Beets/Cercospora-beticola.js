import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import takeRight from "lodash/takeRight";
import { toJS } from "mobx";

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

const riskLevelColors = dicv2Day => {
  if (dicv2Day >= 0 && dicv2Day <= 3) {
    return "low";
  } else if (dicv2Day >= 4 && dicv2Day <= 6) {
    return "moderate";
  } else {
    return "high";
  }
};

@inject("store")
@observer
export default class CercosporaBeticola extends Component {
  render() {
    const {
      ACISData,
      subject,
      station,
      areRequiredFieldsSet,
      A2Day,
      riskLevel,
      A14Day,
      A21Day,
      season
    } = this.props.store.app;

    const a2day = takeRight(A2Day, 8);
    const riskLevelA2 = takeRight(riskLevel, 8);
    const a14day = takeRight(A14Day, 8);
    const a21day = takeRight(A21Day, 8);
    const seasonIF = takeRight(season, 8);

    const columns = [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        fixed: "left",
        width: 100,
        render: date => forecastText(date)
      },
      {
        title: "Infection Values",
        children: [
          {
            title: "Daily",
            dataIndex: "dicv",
            key: "dicv"
          },
          {
            title: "2-Day",
            key: "A2Day",
            render: (text, record, i) => {
              return {
                props: {
                  className: riskLevelColors(a2day[i])
                },
                children: a2day[i]
              };
            }
          },
          {
            title: "Risk Level",
            // dataIndex: "riskLevel",
            key: "riskLevel",
            render: (text, record, i) => {
              return {
                props: {
                  className: riskLevelColors(a2day[i])
                },
                children: riskLevelA2[i]
              };
            }
          }
        ]
      },
      {
        title: "Accumulation Infection Values",
        children: [
          {
            title: "14-Day",
            // dataIndex: "riskLevel",
            key: "14-Day",
            render: (text, record, i) => a14day[i]
          },
          {
            title: "21-Day",
            // dataIndex: "riskLevel",
            key: "21-Day",
            render: (text, record, i) => a21day[i]
          },
          {
            title: "Season",
            // dataIndex: "riskLevel",
            key: "season",
            render: (text, record, i) => seasonIF[i]
          }
        ]
      }
    ];

    return (
      <Flex column>
        <Box>
          <h2>{subject.name} Prediction For {station.name}</h2>
        </Box>

        <Flex justify="space-between">
          <Box mt={3} col={12} lg={12} md={12} sm={12}>
            <h3>Cercospora leaf spot on table beet</h3>

            <Table
              columns={columns}
              rowKey={record => record.date}
              rowClassName={record => record.color}
              loading={ACISData.length === 0}
              pagination={false}
              dataSource={
                areRequiredFieldsSet
                  ? takeRight(ACISData, 8).map(day => day.cercosporaBeticola)
                  : null
              }
            />
          </Box>
        </Flex>
      </Flex>
    );
  }
}
