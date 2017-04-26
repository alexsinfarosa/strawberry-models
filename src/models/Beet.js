import React, { Component } from "react";
import { inject, observer } from "mobx-react";

//styled-components
// import { NavContainer, Header, Main } from "./styles";

@inject("store")
@observer
export default class Beet extends Component {
  render() {
    return (
      <div>
        Beet Page
      </div>
    );
  }
}
