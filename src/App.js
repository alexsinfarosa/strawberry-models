import React, { Component } from "react";
import { inject, observer } from "mobx-react";

// antd-components
import { Row, Col, Icon } from "antd";

// styled-components
import { Page, MRow } from "./styles";

// components
import Nav from "./components/Layout/Nav";
@inject("store")
@observer
class App extends Component {
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
          <Col
            style={{ padding: "20px", borderRight: "1px solid #eee" }}
            xs={24}
            sm={6}
            md={6}
            lg={6}
            xl={6}
          >
            Col
          </Col>
          <Col
            style={{ padding: "20px" }}
            xs={24}
            sm={18}
            md={18}
            lg={18}
            xl={18}
          >
            Col
          </Col>
        </MRow>
      </Page>
    );
  }
}

export default App;
