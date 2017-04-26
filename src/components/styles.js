import styled from "styled-components";
import { Map } from "react-leaflet";

export const MapContainer = styled(Map)`
  width: 100%;
  height: 400px;
  margin-bottom: 2rem;

  @media (max-width: 992px) {
    height: 350px;
  }
  @media (max-width: 768px) {
    height: 300px;
  }
  @media (max-width: 400px) {
    height: 200px;
  }
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  ${/* height: 400px; */ ""}
  max-width: 1024px;
  margin: 2rem auto;
`;
export const Row = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-between;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;

  }
  @media (max-width: 400px) {
    flex-direction: column;

  }
`;
export const Col = styled.div`
  display: flex;
  margin: 2rem;
  flex-direction: column;
  flex: 1;
`;

export const Low = styled.td`
  background-color: #C6F2A8
`;

export const Caution = styled.td`
  background-color: #FCE3B5
`;

export const High = styled.td`
  background-color: #FAC0BE
`;
