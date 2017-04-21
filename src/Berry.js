import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";

//styled-components
import { SideBar, Content, Wrapper, Block } from "./styles";

//  components
import Subject from "./components/Subject";
import State from "./components/State";
import Station from "./components/Station";
import DatePicker from "./components/DatePicker";
// import Button from "./components/Button";
import TheMap from "./components/TheMap";
import Results from "./components/Results";
import Graph from "./components/Graph/Graph";

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
  render() {
    this.props.store.app.ACISData.map(day => console.log(toJS(day)));
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
