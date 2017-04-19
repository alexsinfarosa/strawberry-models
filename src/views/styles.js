import styled from "styled-components";
import { Map } from "react-leaflet";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-family: serif;
`;

export const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 450px;
`;

export const Link = styled.a`
  display: flex;
  flex-direction: column;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  color: #544C45;
  margin-bottom: 10px;
  margin-left: 30px;

  &:hover {
    color: #b85700;
  }
`;

export const MapContainer = styled(Map)`
  height: 490px;
  width: 100%;
  margin: 0 auto;
`;
