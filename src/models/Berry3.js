import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
import { autorun } from "mobx";
import Drawer from "react-motion-drawer";

// styles
import { Flex, Box } from "reflexbox";

//styled-components
import { Main } from "../appStyles";
import { Header, Sidebar, Content } from "./styles";

// antd
import { Icon } from "antd";
// const { Header, Sider, Content } = Layout;

//  components
import Subject from "./components/Subject";
import State from "./components/State";
import Station from "./components/Station";
import DatePicker from "./components/DatePicker";

// import TheMap from "./components/TheMap";
import RTable from "./components/RTable";
// import Graph from "./components/Graph";
// import Stage from "./components/Stage";

// api
import {
  fetchACISData,
  getSisterStationIdAndNetwork,
  fetchSisterStationData,
  fetchForecastData
} from "../api";

// utility functions
import {
  currentModel,
  replaceNonConsecutiveMissingValues,
  containsMissingValues,
  replaceConsecutiveMissingValues,
  RHAdjustment
} from "../utils";

const style = {
  background: "#F9F9F9",
  boxShadow: "rgba(0, 0, 0, 0.188235) 0px 10px 20px, rgba(0, 0, 0, 0.227451) 0px 6px 6px"
};

@inject("store")
@observer
export default class Berry extends Component {
  constructor(props) {
    super(props);

    autorun(() => {
      if (this.props.store.app.areRequiredFieldsSet) {
        return this.getData();
      }
    });
  }

  getData = async () => {
    // console.log("this.getData fired!");
    const {
      protocol,
      station,
      startDate,
      endDate,
      currentYear,
      startDateYear
    } = this.props.store.app;

    this.props.store.app.setACISData([]);
    let acis = [];

    // Fetch ACIS data
    acis = await fetchACISData(protocol, station, startDate, endDate);
    acis = replaceNonConsecutiveMissingValues(acis);

    if (!containsMissingValues(acis)) {
      acis = currentModel(station, acis, endDate);
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
      acis = currentModel(station, acis, endDate);
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
    acis = currentModel(station, acis, endDate);
    this.props.store.app.setACISData(acis);
    return;
  };

  state = {
    open: true,
    width: 300
  };

  render() {
    const { open } = this.state;
    const { isMobile } = this.props.store.app;
    const drawerProps = {
      overlayColor: "rgba(255,255,255,0.6)",
      drawerStyle: style
    };

    console.log(isMobile);

    return (
      <Flex column>
        <Header lg={12} md={12} sm={12} col={12}>
          {open
            ? <a onClick={() => this.setState({ open: false })}>
                <Icon type="menu-fold" />
              </a>
            : <a onClick={() => this.setState({ open: true })}>
                <Icon type="menu-unfold" />
              </a>}
          <Link to="/">Home</Link>

          <p>Berry Model</p>
        </Header>
        <Flex debug style={{ height: "100vh", background: "lightyellow" }}>
        
          <Sidebar p={2}>
            Sidebar
          </Sidebar>

          {/* <Drawer
                {...drawerProps}
                width={this.state.width}
                fadeOut={true}
                open={open}
                onChange={open => this.setState({ open: open })}
              >
                <div style={{ padding: "2em", background: "pink" }}>
                  <h3>Navigation</h3>
                </div>
              </Drawer> */}

          <Content p={2} auto>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis optio, doloremque voluptates, modi accusantium natus eos, temporibus tenetur vitae enim quam nostrum accusamus? Veritatis explicabo eius suscipit, enim, eaque illum.
          </Content>
        </Flex>
      </Flex>
    );
  }
}
