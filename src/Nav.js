import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { NavLink } from "react-router-dom";

// import "./nav.styl";

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
              <NavLink exact activeClassName="active" to="/"> Home</NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/berry"> Berry</NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/onion"> Onion</NavLink>
            </li>
          </ul>
        </NavMenu>
      </Container>
    );
  }
}

export default Nav;
