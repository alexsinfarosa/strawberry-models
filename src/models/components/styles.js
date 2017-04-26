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
//
// export const Low = styled.td`
//   background-color: #C6F2A8
// `;
//
// export const Caution = styled.td`
//   background-color: #FCE3B5
// `;
//
// export const High = styled.td`
//   background-color: #FAC0BE
// `;
