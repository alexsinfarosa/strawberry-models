import styled from "styled-components";
import { color } from "polished";

export const Page = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
`;

export const Main = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  ${/* background-color: aqua; */ ""}
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 7rem;
  ${/* background: lightgreen; */ ""}
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  padding: 0 10px;
  ${/* background: pink; */ ""}

  & > div {
    font-size: 1.1rem;
    font-weight: bold
  }

  @media (max-width: 1170px) {

  }
  @media (max-width: 992px) {

  }
  @media (max-width: 768px) {

  }
  @media (max-width: 400px) {

  }
`;

export const NavMenu = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  flex: 1;
  ${/* background: aqua; */ ""}

  & > ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;

    & > li {
      flex: 1;
      margin-right: 2rem;

      & > a {
        color: black;
        font-size: 1.4rem;
        font-weight: 100;
        letter-spacing: 1px;
        text-decoration: none;
        padding: 10px 5px;
        display: inline-block;
        width: 100%;
        text-align: center;
        transition: all 0.5s;

        &:hover {
          color: aqua;
          border-bottom: 1px solid aqua
        }
      }
    }
  }

  @media (max-width: 1170px) {

  }
  @media (max-width: 992px) {

  }
  @media (max-width: 768px) {
    ul > li > a {
      font-size: 1.2rem;
    }
  }
  @media (max-width: 400px) {
    ul > li > a {
      font-size: 1rem;
    }
  }
`;
