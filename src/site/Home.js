import React, { Component } from "react";
import { inject, observer } from "mobx-react";

//styled-components
import { SquareBox } from "./styles";

// styles
import { Flex } from "reflexbox";

// components
import Nav from "./Nav";

// import partners from "../../public/partners.PNG";

@inject("store")
@observer
export default class Home extends Component {
  render() {
    return (
      <Flex column>
        <Nav />

        <Flex mt={4} column>
          <Flex m={4} justify="space-between" wrap>

            <SquareBox col={12} lg={3} md={4} sm={12}>About Newa</SquareBox>
            <SquareBox col={12} lg={3} md={4} sm={12}>
              Weather Data Sources
            </SquareBox>
            <SquareBox col={12} lg={3} md={4} sm={12}>
              Pest Forecast Tools
            </SquareBox>
          </Flex>

          <Flex m={4} justify="space-around" wrap>

            <SquareBox col={12} lg={2} md={3} sm={12}>
              Crop Management Tools
            </SquareBox>
            <SquareBox col={12} lg={2} md={3} sm={12}>
              Weather Stations
            </SquareBox>
            <SquareBox col={12} lg={2} md={3} sm={12}>
              Station Pages
            </SquareBox>
            <SquareBox col={12} lg={2} md={3} sm={12}>
              Station Pages
            </SquareBox>

          </Flex>
        </Flex>

      </Flex>
    );
  }
}
