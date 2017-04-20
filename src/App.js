import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { when } from "mobx";
// antd-components
import { Row, Col, Icon } from "antd";

// styled-components
import { Page, MRow, LeftMenu, Main } from "./styles";

// components
import Nav from "./components/Layout/Nav";
import Subject from "./components/Subject";
import State from "./components/State";
import Station from "./components/Station";
import DatePicker from "./components/DatePicker";
import Button from "./components/Button";

// api
import { fetchAllStations } from "./fetchData";

@inject("store")
@observer
class App extends Component {
  constructor(props) {
    super(props);
    const protocol = this.props.store.app.protocol;
    when(
      // once...
      () => this.props.store.app.stations.length === 0,
      // ... then
      () =>
        fetchAllStations(protocol).then(allStations =>
          this.props.store.app.setStations(allStations)
        )
    );
  }

  render() {
    return (
      <Page>
        <Row type="flex" style={{ padding: "20px" }}>
          <Col xs={24} sm={6} md={6} lg={6} xl={6}>
            <Icon type="menu-unfold" style={{ fontSize: "20px" }} />
          </Col>
          <Col xs={24} sm={18} md={18} lg={18} xl={18}>
            <Nav />
          </Col>
        </Row>

        <MRow>
          <LeftMenu>
            <Subject />
            <br />
            <State />
            <br />
            <Station />
            <br />
            <DatePicker />
            <br />
            <Button />
          </LeftMenu>

          <Main>
            Content
          </Main>
        </MRow>
      </Page>
    );
  }
}

export default App;
