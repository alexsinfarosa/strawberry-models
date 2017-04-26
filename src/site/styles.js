import styled from "styled-components";
// import { opacify } from "polished";

import { Box } from "reflexbox";
import { NavLink } from "react-router-dom";

export const NavBox = styled(Box)`
  textAlign: center;
`;

export const Navlink = styled(NavLink)`
  color: black;
  font-size: 1.4rem;
  font-weight: 100;
  letter-spacing: 1px;
  text-decoration: none;
  transition: all 0.2s;
  &:hover {
    text-decoration: underline;
    text-underline-position: under;
  }
`;
