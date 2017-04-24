import styled from "styled-components";
// import { opacify } from "polished";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  ${/* background-color: lightgreen; */ ""}
`;
export const Vertical = styled(Container)`
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;
export const Horizontal = styled(Container)`
  flex-direction: row;
`;
export const SideBar = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1, 1, calc(240px - padding);
  background-color: #F7F7F7;
`;

export const Block = styled(Container)`
  /*background-color: green;*/
`;

export const Centered = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  ${/* background-color: lightyellow; */ ""}
`;

export const Main = styled.div`
  display: flex;
  flex: 6;
  justify-content: center;
  align-items: center;
  ${/* background-color: lightyellow; */ ""}
`;

export const Content = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  ${/* background-color: lightyellow; */ ""}
`;

export const NavContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  ${/* background-color: lightyellow; */ ""}
`;

export const Header = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-around;
  align-items: center;
  ${/* background: pink; */ ""}

  & > div {
    font-size: 1.1rem;
    font-weight: bold
  }
`;

export const NavMenu = styled.div`
  display: flex;
  justify-content: center;
  ${/* background: aqua; */ ""}

  & > ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    ${/* background-color: orange; */ ""}

    & > li {
      margin-left: 1rem;
      margin-right: 1rem;
      ${/* background-color: pink */ ""}

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
        transition: all 0.4s;

        &:hover {
          color: black;
          text-decoration: underline;
          text-underline-position: under;
        }
      }
    }
  }

  @media (max-width: 1170px) {

  }
  @media (max-width: 992px) {
    ul > li > a {
      font-size: 1.3rem;
    }
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
