import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";
// import ResultsGraph from "./ResultsGraph";

// utility functions
import takeRight from "lodash/takeRight";
import format from "date-fns/format";
import isBefore from "date-fns/is_before";
import subDays from "date-fns/sub_days";

// styled-components
import { Low, Caution, High } from "./styles";

@inject("store")
@observer
export default class ResultsTable extends Component {
  render() {
    const {
      dates,
      station,
      endDate,
      currentYear,
      startDateYear,
      botrytis,
      anthracnose
    } = this.props.store.app;

    const months = dates.map(date => {
      if (true) {
        if (isBefore(subDays(date, 1), endDate)) {
          return (
            <td className="months before" key={date}>
              {format(date, "MMM D")}
            </td>
          );
        } else {
          return (
            <td className="months after" key={date}>{format(date, "MMM D")}</td>
          );
        }
      }
      return <td key={date} />;
    });

    let HeaderTable = null;
    if (currentYear === startDateYear) {
      HeaderTable = (
        <th className="after" colSpan="5">
          {" "}5 Days forecasts
          <a
            target="_blank"
            href={`http://forecast.weather.gov/MapClick.php?textField1=${station.lat}&textField2=${station.lon}`}
            className="forecast-details"
          >
            Forecast Details
          </a>
        </th>
      );
    } else {
      HeaderTable = (
        <th className="after" colSpan="5">
          {" "}Ensuing 5 Days
        </th>
      );
    }

    const displayBotrytis = botrytis.map((e, i) => {
      if (true) {
        if (e < 0.50) {
          return <Low key={i}>{e}</Low>;
        } else if (e >= 0.50 && e < 0.70) {
          return <Caution key={i}>{e}</Caution>;
        }
        return <High key={i}>{e}</High>;
      }
      return <th key={i} />;
    });

    const botrytisInfectionRisk = botrytis.map((e, i) => {
      if (true) {
        if (e < 0.50) {
          return <Low key={i}><small>Low</small></Low>;
        } else if (e >= 0.50 && e < 0.70) {
          return <Caution key={i}><small>Moderate</small></Caution>;
        }
        return <High key={i}><small>High</small></High>;
      }
      return <th key={i} />;
    });

    const displayAnthracnose = anthracnose.map((e, i) => {
      if (true) {
        if (e < 0.50) {
          return <Low key={i}>{e}</Low>;
        } else if (e >= 0.50 && e < 0.70) {
          return <Caution key={i}>{e}</Caution>;
        }
        return <High key={i}>{e}</High>;
      }
      return <th key={i} />;
    });

    const anthracnoseInfectionRisk = anthracnose.map((e, i) => {
      if (true) {
        if (e < 0.50) {
          return <Low key={i}><small>Low</small></Low>;
        } else if (e >= 0.50 && e < 0.70) {
          return <Caution key={i}><small>Moderate</small></Caution>;
        }
        return <High key={i}><small>High</small></High>;
      }
      return <th key={i} />;
    });

    return (
      <table>
        <thead>
          <tr>
            <th className="th-label" rowSpan="2" />
            <th className="before">Past</th>
            <th className="before">Past</th>
            <th className="before">Current</th>
            {HeaderTable}
          </tr>
          <tr>
            {takeRight(months, 8)}
          </tr>
        </thead>
        <tbody>
          <tr rowSpan="9" />
          <tr>
            <th className="th-label">Botrytis</th>
            {takeRight(displayBotrytis, 8)}
          </tr>
          <tr>
            <th className="th-label">Risk Levels</th>
            {takeRight(botrytisInfectionRisk, 8)}
          </tr>
          <tr rowSpan="9" />
          <tr>
            <th className="th-label">Anthracnose</th>
            {takeRight(displayAnthracnose, 8)}
          </tr>
          <tr>
            <th className="th-label">Risk Levels</th>
            {takeRight(anthracnoseInfectionRisk, 8)}
          </tr>
        </tbody>
      </table>
    );
  }
}
