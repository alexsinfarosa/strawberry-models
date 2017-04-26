import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { format } from "date-fns";

import {
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  Text,
  Tooltip,
  Legend
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
    const { graphData, barColor } = this.props.store.app;

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
      <div>
        <Text
          style={{
            display: "block",
            marginTop: "20px",
            fontSize: "16px",
            marginBottom: "5px",
            fontWeight: "700",
            letterSpacing: "1px"
          }}
        >
          2-Day Infection Values
        </Text>
        <ComposedChart
          width={610}
          height={320}
          data={graphData}
          margin={{ top: 0, right: 20, left: -30, bottom: 5 }}
        >
          <XAxis dataKey="dates" tick={<CustomLabel />} />
          <YAxis
            dataKey="a2Day"
            allowDecimals={false}
            domain={["dataMin", "dataMax"]}
          />
          <Tooltip content={renderTooltip} offset={20} />
          <Legend
            wrapperStyle={{ paddingTop: "30px" }}
            verticalAlign="bottom"
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
      </div>
    );
  }
}
