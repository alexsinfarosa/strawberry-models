import React, { Component } from "react";
import { inject, observer } from "mobx-react";

//styled-components
import { NavContainer, Main, Header } from "./styles";

// components
import Nav from "./Nav";

@inject("store")
@observer
export default class Home extends Component {
  render() {
    return (
      <NavContainer>
        <Header>
          <div>NEWA</div>
          <div>Cornell</div>
        </Header>
        <Nav />
        <Main>
          <h1>Home Page...</h1>
        </Main>
      </NavContainer>
    );
  }
}
