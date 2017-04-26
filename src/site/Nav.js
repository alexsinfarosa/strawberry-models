import React, { Component } from "react";
import { inject, observer } from "mobx-react";

//styled-components
import { NavBox, Navlink } from "./styles";

// styles
import { Flex } from "reflexbox";

@inject("store")
@observer
class Nav extends Component {
  render() {
    const isActive = {
      color: "black",
      textDecoration: "underline",
      textUnderlinePosition: "under"
    };
    return (
      <Flex gutter={2} align="center" wrap>

        <NavBox p={2} lg={4} md={4} sm={4} col={12}>
          <Navlink exact to="/" activeStyle={isActive}>
            Home
          </Navlink>
        </NavBox>

        <NavBox p={2} lg={4} md={4} sm={4} col={12}>
          <Navlink to="/berry" activeStyle={isActive}>
            Berry
          </Navlink>
        </NavBox>

        <NavBox p={2} lg={4} md={4} sm={4} col={12}>
          <Navlink to="/beet" activeStyle={isActive}>
            Beet
          </Navlink>
        </NavBox>

      </Flex>
    );
  }
}

export default Nav;
