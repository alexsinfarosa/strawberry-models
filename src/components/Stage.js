import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Steps } from "antd";
const Step = Steps.Step;

// style
import "./rTable.styl";
let size = "default";
if (window.innerWidth < 400) {
  size = "small";
}
@inject("store")
@observer
class Stage extends Component {
  render() {
    return (
      <div
        className="table"
        style={{ marginTop: "4rem", marginBottom: "4rem", fontSize: ".5rem" }}
      >
        <h1>Stage example...</h1>
        <br />
        <Steps size={size} current={1}>
          <Step title="Finished" description="Larva" />
          <Step title="In Progress" description="Eggs hatching" />
          <Step title="Waiting" description="Moths emerging" />
        </Steps>
      </div>
    );
  }
}

export default Stage;
