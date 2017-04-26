import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

@inject("store")
@observer
export default class Graph extends Component {
  render() {
    const data = [
      { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
      { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
      { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
      { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
      { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
      { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
      { name: "Page G", uv: 3490, pv: 4300, amt: 2100 }
    ];

    const rowCount = data.length - 1;
    let aspect = 15 / rowCount;
    let width = "80%";
    console.log(window.innerWidth);
    if (window.innerWidth < 400) {
      width = "100%";
      aspect = 8 / rowCount;
    }
    console.log(width);
    console.log(aspect);
    return (
      <div
        className="table"
        style={{
          marginTop: "4rem",
          marginBottom: "10rem"
        }}
      >
        <h1>Graph</h1>
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "center"
            // background: "lightgreen"
          }}
        >

          <ResponsiveContainer width={width} aspect={aspect}>
            <AreaChart
              data={data}
              margin={{ top: 20, right: 5, left: -25, bottom: 5 }}
            >
              &gt;
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <ReferenceLine x="Page C" stroke="green" label="Min PAGE" />
              <ReferenceLine
                y={4000}
                label="Max"
                stroke="red"
                strokeDasharray="3 3"
              />
              <Area
                type="monotone"
                dataKey="uv"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}
