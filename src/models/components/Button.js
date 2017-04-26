import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Button } from "antd";

@inject("store")
@observer
class Subject extends Component {
  handleChange = value => {
    this.props.store.app.setDisease(value);
    console.log(`selected: ${value}`);
  };
  render() {
    return (
      <Button type="default" size="large" icon="download">
        Calculate
      </Button>
    );
  }
}

export default Subject;