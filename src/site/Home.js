import React, { Component } from "react";
import { inject, observer } from "mobx-react";

//styled-components
// import { SquareBox } from "./styles";

// styles
import { Flex, Box } from "reflexbox";

// components
import Nav from "./Nav";

@inject("store")
@observer
export default class Home extends Component {
  render() {
    return (
      <Flex column>
        <Nav />

        <Flex mt={4} column justify="center">
          <Box style={{ margin: "0 auto" }}>
            <h1>Work In Progress...</h1>
          </Box>
          <br />
          <Box style={{ margin: "0 auto" }}>
            <h2>
              The site helps to have all the models in one place
            </h2>
          </Box>
        </Flex>

      </Flex>
    );
  }
}
