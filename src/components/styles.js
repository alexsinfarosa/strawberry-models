import styled from "styled-components";

export const Selector = styled.div`
  display: flex;
  flex-direction: column;
  ${/* background-color: orange; */ ""}
`;

export const Select = styled.select`
  ${''/* appearance: none; */}
  margin-top: 5px;
  font-size: 12px;
  border-radius: 3px;
  background: white !important;
  border: 1px solid #CECECE;

  &:focus {
    outline: none;
  }
`;

export const CalculateBtn = styled.button`
  background-color: #FFFFCC;
  border: 1px solid #FFA500;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #FFFF66;
  }

  &:focus {
    outline: none;
  }
`;

export const Option = styled.option`
  color: red !important;
  background-color: yellow !important;
`;
