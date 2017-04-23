import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Link } from "react-router-dom";

// import { toJS } from "mobx";

//styled-components
import { SideBar, Vertical, Horizontal } from "./styles";

// styles
import "./styles";

// antd
// import { Icon } from "antd";
import { Layout, Menu, Icon } from "antd";
const { Header, Sider, Content } = Layout;

//  components
import Subject from "./components/Subject";
import State from "./components/State";
import Station from "./components/Station";
import DatePicker from "./components/DatePicker";
// import Button from "./components/Button";
import TheMap from "./components/TheMap";
import Results from "./components/Results";
// import Graph from "./components/Graph/Graph";

// api
import {
  fetchACISData,
  getSisterStationIdAndNetwork,
  fetchSisterStationData,
  fetchForecastData
} from "./api";

// utility functions
import {
  currentModel,
  replaceNonConsecutiveMissingValues,
  containsMissingValues,
  replaceConsecutiveMissingValues,
  RHAdjustment
} from "./utils";

@inject("store")
@observer
export default class Berry extends Component {
  constructor(props) {
    super(props);
    this.getData();
  }

  getData = async () => {
    const {
      protocol,
      station,
      startDate,
      endDate,
      currentYear,
      startDateYear
    } = this.props.store.app;
    let acis = [];

    // Fetch ACIS data
    acis = await fetchACISData(protocol, station, startDate, endDate);
    acis = replaceNonConsecutiveMissingValues(acis);

    if (!containsMissingValues(acis)) {
      acis = currentModel(station, acis);
      this.props.store.app.setACISData(acis);
      return;
    }

    // Get Id and network to fetch sister station data
    const idAndNetwork = await getSisterStationIdAndNetwork(protocol, station);
    const sisterStationData = await fetchSisterStationData(
      protocol,
      idAndNetwork,
      station,
      startDate,
      endDate,
      currentYear,
      startDateYear
    );
    acis = replaceConsecutiveMissingValues(sisterStationData, acis);
    if (currentYear !== startDateYear) {
      acis = currentModel(station, acis);
      this.props.store.app.setACISData(acis);
      return;
    }
    let forecastData = await fetchForecastData(
      protocol,
      station,
      startDate,
      endDate
    );

    // Forcast data needs to have relative humidity array adjusted
    forecastData = RHAdjustment(forecastData);
    acis = replaceConsecutiveMissingValues(forecastData, acis);
    acis = currentModel(station, acis);
    this.props.store.app.setACISData(acis);
    return;
  };

  state = {
    collapsed: false
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    const { isVisible } = this.props.store.app;
    return (
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
          style={{ background: "white", padding: 24 }}
          width={300}
        >

          <Menu defaultSelectedKeys={["1"]}>
            <Subject />
            <State />
            <Station />
            <DatePicker />
          </Menu>
        </Sider>
        <Layout>
          <Header
            style={{ position: "fixed", width: "100%", background: "#fff" }}
          >
            <Menu
              mode="horizontal"
              defaultSelectedKeys={["2"]}
              style={{ lineHeight: "64px" }}
            >
              <Menu.Item key="1">
                <Link exact to='/'>Home</Link>
              </Menu.Item>
              {/* <Menu.Item key="2">Tena</Menu.Item> */}
            </Menu>
          </Header>
          <Content
            overflow="initial"
            style={{
              margin: "24px 0px 0px 0px",
              padding: 24,
              background: "#fff",
              minHeight: 280
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
    );
  }
}
