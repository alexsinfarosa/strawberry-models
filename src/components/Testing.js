import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { acis } from "../dummyData";
import flatten from "lodash/flatten";

@inject("store")
@observer
class Testing extends Component {
  average = data => {
    if (data.length === 0) {
      return 0;
    }
    let results = data.map(e => parseFloat(e));
    return Math.round(results.reduce((acc, val) => acc + val, 0) / data.length);
  };

  leafWetnessAndTemps = data => {
    // Returns true if leaf wetness values are greater than 0
    const LW = flatten(data.map(day => day[3].map(e => e > 0)));
    // Returns true if relative humidity values are greater than or equal to 90
    const RH = flatten(data.map(day => day[2].map(e => e >= 90)));
    // Returns true if precipitation values are greater than 0
    const PT = flatten(data.map(day => day[4].map(e => e > 0)));

    let params = [LW, RH, PT];
    const transpose = m => m[0].map((x, i) => m.map(x => x[i]));
    // Returns a true values if there is at least one true value in the array
    const transposed = transpose(params).map(e => e.find(e => e === true));
    let indices = transposed.map((e, i) => e === true ? i : e);
    indices = indices.filter(e => typeof e === "number");

    let pairs = [];
    for (const [i, e] of indices.entries()) {
      if (i !== 0) {
        const L = indices[i - 1];
        const R = e;
        const T = R - L;
        const size = R - L + 1;
        if (T < 6) {
          pairs.push([L, R, size]);
        }
      }
    }

    for (const pair of pairs) {
      for (let i = 0; i < pair[2]; i++) {
        transposed.splice(pair[0] + i, 1, true);
      }
    }

    let filteredLW = [];
    while (transposed.length > 0) {
      filteredLW.push(transposed.splice(0, 24));
    }

    const dates = data.map(day => day[0]);

    let temps = filteredLW.map((day, d) => {
      return day.map((e, i) => {
        if (e === true) {
          return data[d][1][i];
        }
        return e;
      });
    });

    temps = temps.map(day => day.filter(e => e !== undefined && e !== "M"));
    temps = temps.map(day => this.average(day));

    filteredLW = filteredLW.map(day => day.filter(e => e === true).length);

    let results = [];
    for (const [i, d] of dates.entries()) {
      results.push([d, temps[i], filteredLW[i]]);
    }
    return results;
  };

  IndexBotrytis = data => {
    return data.map(day => {
      const T = day[1];
      const W = day[2];

      return -4.268 + 0.0294 * W * T - 0.0901 * W - 0.0000235 * W * T ** 3;
    });
  };

  render() {
    // console.log(this.leafWetnessAndTemps(acis));
    // console.log(this.IndexBotrytis(this.leafWetnessAndTemps(acis)));
    return <div />;
  }
}

export default Testing;
