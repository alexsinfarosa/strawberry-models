import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { NavLink } from "react-router-dom";

// styled-components
import { NavMenu } from "./styles";

@inject("store")
@observer
class Nav extends Component {
  render() {
    return (
      <NavMenu location={location}>
        <ul>
          <li>
            <NavLink
              exact
              activeStyle={{
                color: "black",
                textDecoration: "underline",
                textUnderlinePosition: "under"
              }}
              to="/"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              activeStyle={{
                color: "black",
                textDecoration: "underline",
                textUnderlinePosition: "under"
              }}
              to="/berry"
            >
              Berry
            </NavLink>
          </li>
          <li>
            <NavLink
              activeStyle={{
                color: "black",
                textDecoration: "underline",
                textUnderlinePosition: "under"
              }}
              to="/example"
            >
              Example
            </NavLink>
          </li>
        </ul>
      </NavMenu>
    );
  }
}

export default Nav;
