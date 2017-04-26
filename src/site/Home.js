import React, { Component } from "react";
import { inject, observer } from "mobx-react";

//styled-components
import { Main } from "../appStyles";

// styles
import { Flex } from "reflexbox";

// components
import Nav from "./Nav";

@inject("store")
@observer
export default class Home extends Component {
  render() {
    return (
      <Flex column>
        <Nav />
        <Flex
          align="center"
          debug
          justify="center"
          style={{ height: "100vh" }}
          column
        >
          <Main p={2} m={2} lg={12} md={12} sm={12} col={12}>
            Home Page
          </Main>
        </Flex>
      </Flex>
    );
  }
}
