import React, { Component } from "react";
import { inject, observer } from "mobx-react";

//styled-components
import { Centered } from "./styles";

@inject("store")
@observer
export default class Home extends Component {
  render() {
    return (
      <Centered>
        <h5>Please make a selection from the menu on the left</h5>
      </Centered>
    );
  }
}
