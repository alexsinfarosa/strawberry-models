import React, { Component } from "react";

export default class CustomLabel extends Component {
  render() {
    const { x, y, payload } = this.props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          fontSize={10}
          textAnchor="end"
          fill="#666"
          transform="rotate(-15)"
        >
          {payload.value}
        </text>
      </g>
    );
  }
}
