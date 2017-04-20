import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { NavLink } from "react-router-dom";

// styled-components
import { Container, Header, NavMenu } from "./styles";

@inject("store")
@observer
class Nav extends Component {
  render() {
    return (
      <Container>
        <Header>
          <div>NEWA</div>
          <div>Cornell</div>
        </Header>
        <NavMenu>
          <ul>
            <li>
              <NavLink
                exact
                activeStyle={{ color: "red", borderBottom: "1px solid red" }}
                to="/"
              >
                {" "}Home
              </NavLink>
            </li>
            <li>
              <NavLink
                activeStyle={{ color: "red", borderBottom: "1px solid red" }}
                to="/berry"
              >
                {" "}Berry
              </NavLink>
            </li>
            <li>
              <NavLink
                activeStyle={{ color: "red", borderBottom: "1px solid red" }}
                to="/onion"
              >
                {" "}Onion
              </NavLink>
            </li>
          </ul>
        </NavMenu>
      </Container>
    );
  }
}

export default Nav;
