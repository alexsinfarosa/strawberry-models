import React, { Component } from "react";
import { inject, observer } from "mobx-react";

//styled-components
import { CenteredBox } from "./styles";

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

        <Flex p={3} mt={4} column justify="center">
          <CenteredBox style={{ margin: "0 auto" }}>
            <h1>Work In Progress..</h1>
          </CenteredBox>
          <br />
          <CenteredBox style={{ margin: "0 auto" }}>
            <h2>
              The site helps to have the models built so far in one place
            </h2>
          </CenteredBox>
        </Flex>

      </Flex>
    );
  }
}
