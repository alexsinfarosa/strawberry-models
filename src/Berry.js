import React, { Component } from "react";
import { inject, observer } from "mobx-react";

//styled-components
import { SideBar, Content, Wrapper, Block } from "./styles";

import Subject from "./components/Subject";
import State from "./components/State";
import Station from "./components/Station";
import DatePicker from "./components/DatePicker";
// import Button from "./components/Button";
import TheMap from "./components/TheMap";
import Results from "./components/Results";
import Graph from "./components/Graph/Graph";

@inject("store")
@observer
export default class Berry extends Component {
  render() {
    return (
      <Wrapper>
        <SideBar>

          <Subject />
          <State />
          <Station />
          <DatePicker />

        </SideBar>
        <Content>
          <Block>
            <TheMap />
          </Block>
          <Block>
            <h1>Results </h1>
            <br />
            <Results />
          </Block>
          <Block>
            <Graph />
          </Block>

        </Content>
      </Wrapper>
    );
  }
}
