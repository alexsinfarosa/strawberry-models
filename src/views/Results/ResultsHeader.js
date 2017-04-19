import React, { Component } from "react";
import { inject, observer } from "mobx-react";

// styled-components
import { CenterText } from "./styles";

@inject("store")
@observer
export default class ResultsHeader extends Component {
  render() {
    const {
      diseaseR,
      stationR
    } = this.props.store.app;

    return (
      <div>
        <br />
        <CenterText>
          <h4 style={{ letterSpacing: "1px" }}>
            {diseaseR}
            {" "}
            Predictions for
            {" "}
            {stationR.name}
          </h4>
        </CenterText>
      </div>
    );
  }
}
