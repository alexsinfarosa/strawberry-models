import styled from "styled-components";
import { Box } from "reflexbox";

export const Main = styled(Box)`
  text-align: center;
  background-color: pink;
  display: flex;
  justify-content: space-around;
  height: 100vh;
`;

export const Centered = styled.div`
  display: flex;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
`;
