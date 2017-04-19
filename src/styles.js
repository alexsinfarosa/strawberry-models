import styled from "styled-components";
import { Row } from "react-flexbox-grid";

export const Page = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
`;

export const MRow = styled(Row)`
  flex: 1;
`;

export const MyApp = styled.div`
  border: 1px solid #eee;
  border-radius: 5px;
  width: 915px;
  min-height: 650px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: stretch;
  padding: 20px;
  ${/* background-color: green; */ ""}
`;
