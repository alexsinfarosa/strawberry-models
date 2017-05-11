import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
import { autorun } from "mobx";

// antd
// import { Layout, Menu, Icon } from "antd";
import Layout from "antd/lib/layout";
import "antd/lib/layout/style/css";
import Menu from "antd/lib/menu";
import "antd/lib/menu/style/css";
import Icon from "antd/lib/icon";
import "antd/lib/icon/style/css";

const { Header, Sider, Content } = Layout;

// components
import Subject from "../components/Subject";
import State from "../components/State";
import Station from "../components/Station";
import DatePicker from "../components/DatePicker";

import TheMap from "../components/TheMap";
import Strawberries from "./Strawberries";
import BluberryMaggot from "./BluberryMaggot/BluberryMaggot";

// utility functions
import { getData } from "../../utils";

@inject("store")
@observer
export default class Berry extends Component {
  constructor(props) {
    super(props);
    this.props.store.app.setModel(this.props.location.pathname);
    this.props.store.app.setSubjectFromLocalStorage(
      JSON.parse(localStorage.getItem(`${this.props.store.app.model}`)) || {}
    );
    autorun(() => this.runMainFunction());
  }
  runMainFunction = () => {
    const {
      protocol,
      getStation,
      startDate,
      endDate,
      currentYear,
      startDateYear,
      areRequiredFieldsSet
    } = this.props.store.app;
    if (areRequiredFieldsSet) {
      this.props.store.app.setACISData([]);
      return getData(
        protocol,
        getStation,
        startDate,
        endDate,
        currentYear,
        startDateYear
      ).then(data => this.props.store.app.setACISData(data));
    }
  };

  render() {
    const { areRequiredFieldsSet, subject } = this.props.store.app;
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

        <Layout style={{ background: "#fff" }}>
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
              <Menu.Item
                disabled
                key="2"
                style={{ fontSize: ".8rem", pointerEvents: "none" }}
              >
                Berry Model
              </Menu.Item>

            </Menu>
          </Header>
          <Content
            // overflow="initial"
            style={{
              margin: "62px auto",
              padding: 48,
              minHeight: 280,
              width: "100%",
              maxWidth: 1200,
              background: "#fff"
            }}
          >
            <TheMap />
            {areRequiredFieldsSet &&
              <div>
                {subject.name === "Strawberries"
                  ? <Strawberries />
                  : <BluberryMaggot />}
              </div>}

          </Content>
        </Layout>
      </Layout>
    );
  }
}
