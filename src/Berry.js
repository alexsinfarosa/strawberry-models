import React, { Component } from "react";
import { inject, observer } from "mobx-react";

//styled-components
// import { Centered } from "./styles";

@inject("store")
@observer
export default class Home extends Component {
  render() {
    return (
      <div>
        <h1>Berry</h1>
      </div>
    );
  }
}
