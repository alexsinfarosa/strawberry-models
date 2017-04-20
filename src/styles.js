import styled from "styled-components";
// import { Row, Col } from "antd";

export const Page = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
`;

export const MRow = styled.div`
  display: flex;
  height: 100%
  ${/* background-color: orange; */ ""}
`;

export const LeftMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 20px;
  ${/* background-color: pink; */ ""}
`;

export const Main = styled.div`
  display: flex;
  flex: 3;
  padding: 20px;
  ${/* background-color: aqua; */ ""}
`;
