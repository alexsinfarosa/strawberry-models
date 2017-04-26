import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
import { autorun } from "mobx";
import { fadeIn } from "react-animations";

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

  render() {
    const { isVisible } = this.props.store.app;
    return (
      <Flex column>
        <Header lg={12} md={12} sm={12} col={12}>
          {isVisible
            ? <a onClick={this.props.store.app.setIsVisible}>
                <Icon type="menu-fold" />
              </a>
            : <a onClick={this.props.store.app.setIsVisible}>
                <Icon type="menu-unfold" />
              </a>}
          <Link to="/">Home</Link>

          <p>Berry Model</p>
        </Header>
        <Flex debug style={{ height: "100vh" }}>
          {isVisible
            ? <fadeIn>
                <Sidebar
                  p={2}
                  lg={4}
                  md={3}
                  sm={3}
                  col={12}
                  style={{ background: "orange" }}
                >
                  Sidebar
                </Sidebar>
              </fadeIn>
            : null}
          <Content p={2} auto>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis optio, doloremque voluptates, modi accusantium natus eos, temporibus tenetur vitae enim quam nostrum accusamus? Veritatis explicabo eius suscipit, enim, eaque illum.
          </Content>
        </Flex>
      </Flex>
    );
  }
}
