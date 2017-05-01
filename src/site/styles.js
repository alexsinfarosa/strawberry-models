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

export const SquareBox = styled(Box)`
  border: 1px solid #eee;
  /*background: lightgreen;*/
  /*height: 150px;*/
  margin-bottom: 4rem;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  padding: 1rem;

`;

export const Header1 = styled.h1`
  font-size: 4rem;
`;
export const Header2 = styled.h2`
  letter-spacing: 1px;
  font-size: 1.5rem;
`;
