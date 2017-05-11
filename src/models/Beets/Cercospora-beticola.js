import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import takeRight from "lodash/takeRight";
import { autorun } from "mobx";

import "../components/rTable.styl";
import { Flex, Box } from "reflexbox";
// import { Table } from "antd";
import Table from "antd/lib/table";
import "antd/lib/table/style/css";

// components
import Graph from "./Graph/Graph";

// styled-components
import { RiskLevel } from "./styles";

// To display the 'forecast text' and style the cell
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

// to style the single cell
// const riskLevelColors = dicv2Day => {
//   if (dicv2Day >= 0 && dicv2Day <= 3) {
//     return "low";
//   } else if (dicv2Day >= 4 && dicv2Day <= 6) {
//     return "moderate";
//   } else {
//     return "high";
//   }
// };

const noData = data => {
  if (data === "No Data") {
    return <span style={{ fontSize: ".6rem", color: "red" }}>No Data</span>;
  }
  return data;
};

const riskLevel = (text, record, i) => {
  // console.log(text, record, i);
  return (
    <div>
      <span style={{ color: record.colorBar }}>{text}</span>
      <RiskLevel style={{ background: record.colorBar }}>
        {record.a2DayIR}
      </RiskLevel>
    </div>
  );
};

// columns for the model
const columns = [
  {
    title: "Date",
    dataIndex: "dateTable",
    key: "dateTable",
    fixed: "left",
    width: 60,
    className: "table",
    render: date => forecastText(date)
  },
  {
    title: "Infection Values",

    children: [
      {
        title: "Daily",
        className: "table",
        dataIndex: "dicv",
        key: "dicv"
      },
      {
        title: "2-Day",
        className: "table",
        dataIndex: "a2Day",
        key: "a2Day",
        // render: (text, record, i) => {
        //   return {
        //     props: {
        //       className: riskLevelColors(text)
        //     },
        //     children: text
        //   };
        // }
        render: (text, record, i) => riskLevel(text, record, i)
      }
      // {
      //   title: "Risk Level",
      //   dataIndex: "a2DayIR",
      //   key: "a2DayIR",
      //   render: (text, record, i) => {
      //     return {
      //       props: {
      //         className: record.color
      //       },
      //       children: text
      //     };
      //   }
      // }
    ]
  },
  {
    title: "Accumulation Infection Values",
    children: [
      {
        title: "14-Day",
        className: "table",
        dataIndex: "a14Day",
        key: "a14Day",
        render: data => noData(data)
      },
      {
        title: "21-Day",
        className: "table",
        dataIndex: "a21Day",
        key: "a21Day",
        render: data => noData(data)
      },
      {
        title: "Season",
        className: "table",
        dataIndex: "season",
        key: "season"
      }
    ]
  }
];

@inject("store")
@observer
export default class CercosporaBeticola extends Component {
  constructor(props) {
    super(props);
    autorun(() => this.createDataModel());
  }

  createDataModel = () => {
    this.props.store.beet.resetCercospora();
    const { ACISData } = this.props.store.app;
    const data = {};
    let a2Day = 0;
    let season = 0;
    for (const [i, day] of ACISData.entries()) {
      // determine a2Day
      if (i > 0) {
        a2Day = day.dicv + ACISData[i - 1].dicv;
      }

      // a2Day Infection Risk
      let a2DayIR = "";
      let color = "";
      let colorBar = "";
      if (a2Day >= 0 && a2Day <= 3) {
        a2DayIR = "Low";
        color = "low";
        colorBar = "#81C784";
      } else if (a2Day >= 4 && a2Day <= 6) {
        a2DayIR = "Moderate";
        color = "moderate";
        colorBar = "#FCCE00";
      } else {
        a2DayIR = "High";
        color = "high";
        colorBar = "#f44336";
      }

      // 14-Day Accumulation Infection Values
      const a14Day = ACISData.slice(i - 14, i).map(e => e.dicv);
      // 21-Day Accumulation Infection Values
      const a21Day = ACISData.slice(i - 21, i).map(e => e.dicv);
      // Season Total Infection Values
      season += day.dicv;

      // building the object
      data["dateTable"] = day.dateTable;
      data["dateGraph"] = day.dateGraph;
      data["dateText"] = day.dateText;
      data["dicv"] = day.dicv;
      data["a2Day"] = a2Day;
      data["a2DayIR"] = a2DayIR;
      data["color"] = color;
      data["colorBar"] = colorBar;
      data["a14Day"] = a14Day[13] === undefined ? "No Data" : a14Day[13];
      data["a21Day"] = a21Day[20] === undefined ? "No Data" : a21Day[20];
      data["season"] = season;
      this.props.store.beet.setCercosporaBeticola(data);
    }
  };

  render() {
    const {
      ACISData,
      subject,
      station,
      areRequiredFieldsSet
    } = this.props.store.app;
    const { cercosporaBeticola } = this.props.store.beet;
    return (
      <Flex column>
        <Box>
          <h2>{subject.name} Prediction For {station.name}</h2>
        </Box>

        <Flex justify="space-between">
          <Box mt={3} col={12} lg={12} md={12} sm={12}>
            <h3>Cercospora leaf spot on table beet</h3>

            <Table
              bordered
              columns={columns}
              rowKey={record => record.dateTable}
              // rowClassName={record => record.color}
              loading={ACISData.length === 0}
              pagination={false}
              dataSource={
                areRequiredFieldsSet
                  ? takeRight(cercosporaBeticola, 8).map(day => day)
                  : null
              }
            />
          </Box>
        </Flex>
        <Graph />
      </Flex>
    );
  }
}
