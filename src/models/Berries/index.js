import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
import { autorun } from "mobx";

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
import Strawberries from "./Strawberries";
import BluberryMaggot from "./BluberryMaggot";

// api
import {
  fetchACISData,
  getSisterStationIdAndNetwork,
  fetchSisterStationData,
  fetchForecastData
} from "../../api";

// utility functions
import {
  berryModel,
  replaceNonConsecutiveMissingValues,
  containsMissingValues,
  replaceConsecutiveMissingValues,
  RHAdjustment
} from "../../utils";

@inject("store")
@observer
export default class Berry extends Component {
  constructor(props) {
    super(props);

    autorun(() => {
      if (this.props.store.app.areRequiredFieldsSet) {
        return this.getData(berryModel);
      }
    });
  }

  getData = async currentModel => {
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
    const { disease } = this.props.store.app;
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
            <Subject />
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
                Berry Model
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
            {disease.family === "Strawberries"
              ? <Strawberries />
              : <BluberryMaggot />}
          </Content>
        </Layout>
      </Layout>
    );
  }
}
