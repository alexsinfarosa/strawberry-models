import React from "react";
import { NavLink } from "react-router-dom";

// styled-components
import { Container, Header, NavMenu } from "./styles";

const Nav = () => {
  return (
    <Container>
      <Header>
        <div>NEWA</div>
        <div>Cornell</div>
      </Header>
      <NavMenu location={location}>
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
};

export default Nav;
