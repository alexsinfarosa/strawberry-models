import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer
} from "recharts";
import CustomLabel from "./CustomLabel";

import { Flex, Box } from "reflexbox";

@inject("store")
@observer
export default class Graph extends Component {
  render() {
    const { ACISData } = this.props.store.app;

    // Potential bug. Chartjs needs a javascript array
    const data = ACISData.map(e => e);

    // Change the aspect ratio when viewed on different devices
    let aspect;
    const w = window.innerWidth;
    if (w >= 0 && w <= 401) {
      aspect = 1;
    } else if (w > 401 && w <= 768) {
      aspect = 1.5;
    } else {
      aspect = 2;
    }
    return (
      <Flex mt={4} mb={4} column>
        <h2>Cumulative Degree Day Graph</h2>
        <Box
          mt={3}
          col={12}
          lg={12}
          md={12}
          sm={12}
          style={{ margin: "0 auto" }}
        >
          <ResponsiveContainer width="100%" aspect={aspect}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 0, left: -30, bottom: 20 }}
            >
              <XAxis dataKey="graphDate" tick={<CustomLabel />} />
              <YAxis />
              <CartesianGrid stroke="#E9E9E9" strokeDasharray="7 7" />
              <Tooltip />
              <Legend align="center" verticalAlign="top" height={48} />
              <Line
                dot={false}
                activeDot={{ r: 7 }}
                type="monotone"
                dataKey="cdd"
                stroke="#8884d8"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Flex>
    );
  }
}
