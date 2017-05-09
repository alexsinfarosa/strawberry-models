import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { format } from "date-fns";

import { Flex, Box } from "reflexbox";

import {
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  Text,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import CustomLabel from "./CustomLabel";
import CustomBar from "./CustomBar";

// styles
import "./styles";

// styled-components
import { StyledTooltip } from "./styles";

@inject("store")
@observer
export default class Graph extends Component {
  render() {
    const { cercosporaBeticola } = this.props.store.beet;

    // Potential bug. Chartjs needs a javascript array
    const data = cercosporaBeticola.map(e => e);

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

    const { barColor } = this.props.store.beet;

    const renderTooltip = props => {
      const { payload, label } = props;
      if (payload.length > 0) {
        return (
          <StyledTooltip>
            <h5>{format(label, "MMMM Do")}</h5>
            <p style={{ color: payload[3].color }}>
              {`${payload[3].name} Infection Values: ${payload[3].value}`}
            </p>
          </StyledTooltip>
        );
      }
    };

    return (
      <Flex mt={4} mb={4} column>
        <h2>2-Day Infection Values</h2>
        <Box
          mt={3}
          col={12}
          lg={12}
          md={12}
          sm={12}
          style={{ margin: "0 auto" }}
        >
          <ResponsiveContainer width="100%" aspect={aspect}>
            <ComposedChart
              width={610}
              height={320}
              data={data}
              margin={{ top: 0, right: 20, left: -30, bottom: 5 }}
            >
              <XAxis dataKey="date" tick={<CustomLabel />} />
              <YAxis
                dataKey="a2Day"
                allowDecimals={false}
                domain={["dataMin", "dataMax"]}
              />
              <Tooltip content={renderTooltip} offset={20} />
              <Legend
                align="center"
                verticalAlign="top"
                height={48}
                iconSize={16}
                iconType="rect"
                payload={[
                  { value: "Low", type: "rect", color: "#A3FDA1" },
                  { value: "Moderate", type: "rect", color: "#FDFAB0" },
                  { value: "High", type: "rect", color: "#FFA0A0" }
                ]}
              />
              <Area
                activeDot={false}
                name="Favorable"
                type="monotone"
                stackId="1"
                dataKey="high"
                stroke="#FFA0A0"
                fill="#FFA0A0"
                opacity={0.7}
              />
              <Area
                activeDot={false}
                name="Marginal"
                type="monotone"
                stackId="2"
                dataKey="moderate"
                stroke="#FDFAB0"
                fill="#FDFAB0"
                opacity={0.7}
              />
              <Area
                activeDot={false}
                name="Unfavorable"
                type="monotone"
                stackId="3"
                dataKey="low"
                stroke="#A3FDA1"
                fill="#A3FDA1"
                opacity={0.7}
              />
              <Bar
                name="2-Day"
                dataKey="a2Day"
                shape={<CustomBar />}
                fill={barColor}
              />

            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      </Flex>
    );
  }
}
