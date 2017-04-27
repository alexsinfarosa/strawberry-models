import styled, { keyframes } from "styled-components";
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
const fadeIn = keyframes`
  from {
    transform: scale(.25);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    transform: scale(1);
    opacity: 1;
  }

  to {
    transform: scale(.25);
    opacity: 0;
  }
`;

const fadeinLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-200px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeoutLeft = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }

  to {
    opacity: 0;
    transform: translateX(-200px);
  }
`;

export const Sidebar = styled(Box)`
  display: flex;
  background-color: aqua;
  visibility: ${props => (props.open ? "hidden" : "visible")};
  animation: ${props => (props.open ? fadeoutLeft : fadeinLeft)} .3s linear;
  transition: visibility 1s linear;

  @media (max-width: 410px) {
    visibility: hidden;
    width: 0;
    animation: ${fadeoutLeft} .3s linear;
    transition: visibility 1s linear;
  }

`;
export const Content = styled(Box)`
  display: flex;
  /*background-color: pink*/

`;
