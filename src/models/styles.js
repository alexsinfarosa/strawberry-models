import styled from "styled-components";
import { Box } from "reflexbox";

export const Header = styled(Box)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 80px;
  color: black;
  font-size: 1rem;
  font-weight: 100;
  letter-spacing: 1px;
  /*background-color: lightgreen;*/

  & > a {
  color: black;
  font-size: 1rem;
  font-weight: 100;
  letter-spacing: 1px;
  text-decoration: none;
  transition: all 0.2s;
    &:hover {
      text-decoration: underline;
      text-underline-position: under;
    }
  }
`;

export const Sidebar = styled(Box)`
  display: flex;
  /*background-color: aqua*/
`;

export const Content = styled(Box)`
  display: flex;
  /*background-color: pink*/

`;
