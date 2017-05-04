import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
// import { autorun } from "mobx";

// styles
// import "./styles";

// antd
import { Layout, Menu, Icon } from "antd";
const { Header, Sider, Content } = Layout;

//  components
import Subject from "../components/Subject";
import State from "../components/State";
import Station from "../components/Station";
import DatePicker from "../components/DatePicker";

import TheMap from "../components/TheMap";

// utility functions
// import { getData } from "../../utils";

@inject("store")
@observer
export default class Beets extends Component {
  constructor(props) {
    super(props);
    this.props.store.app.setLocation(this.props.location.pathname);
  }
  render() {
    const { areRequiredFieldsSet } = this.props.store.app;

    return (
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth={0}
          onCollapse={(collapsed, type) => {
            this.props.store.app.setIsCollapsed(collapsed);
          }}
          style={{
            background: "white",
            padding: true ? 0 : 24
          }}
          width={248}
        >

          <Menu defaultSelectedKeys={["1"]}>
            <Subject model={this.props.location.pathname} />
            <State />
            <Station />
            <DatePicker />
          </Menu>
        </Sider>

        <Layout>
          <Header
            style={{
              position: "fixed",
              width: "100%",
              background: "#fff"
            }}
          >
            <Menu
              mode="horizontal"
              defaultSelectedKeys={["2"]}
              style={{
                display: "flex",
                justifyContent: "space-between",
                lineHeight: "62px"
              }}
            >
              <Menu.Item key="1" style={{ fontSize: ".8rem" }}>
                <Link to="/"><Icon type="home" />Home</Link>
              </Menu.Item>
              <Menu.Item disabled key="2" style={{ fontSize: ".8rem" }}>
                Beet Model
              </Menu.Item>

            </Menu>
          </Header>
          <Content
            // overflow="initial"
            style={{
              margin: "62px 0px 0px 0px",
              padding: 24,
              background: "#fff",
              minHeight: 280
            }}
          >
            <TheMap />
            {areRequiredFieldsSet &&
              <div>
                beets
              </div>}

          </Content>
        </Layout>
      </Layout>
    );
  }
}
