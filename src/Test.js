import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import "./Test.styl";

const data = {
  tp: [
    10,
    5,
    67,
    56,
    45,
    98,
    99,
    89,
    92,
    93,
    94,
    95,
    95,
    96,
    99,
    89,
    99,
    99,
    93,
    94,
    95,
    95,
    96,
    97
  ],
  lw: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0],
  rh: [
    91,
    92,
    93,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    94,
    95,
    96,
    97,
    98,
    99,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24
  ],
  pt: [0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};

@inject("store")
@observer
export default class Test extends Component {
  average = data => {
    if (data.length === 0) {
      return 0;
    }
    let results = data.map(e => parseFloat(e));
    return Math.round(results.reduce((acc, val) => acc + val, 0) / data.length);
  };

  leafWetnessAndTemps = day => {
    // Returns true if leaf wetness values are greater than 0
    const LW = day.lw.map(e => (e > 0 ? e : false));
    // Returns true if relative humidity values are greater than or equal to 90
    const RH = day.rh.map(e => (e >= 90 ? e : false));
    // Returns true if precipitation values are greater than 0
    const PT = day.pt.map(e => (e > 0 ? e : false));

    const params = [LW, RH, PT];
    params.map(e => console.log(e));
    const transpose = m => m[0].map((x, i) => m.map(x => x[i]));

    // Returns true if there is at least one true value in the array
    const transposed = transpose(params).map(e => e.find(e => e !== false));
    console.log(transposed);
    let indices = transposed.map((e, i) => (e !== undefined ? i : e));
    console.log(indices);
    indices = indices.filter(e => typeof e === "string");
    console.log(indices);
    let pairs = [];
    for (const [i, e] of indices.entries()) {
      if (i !== 0) {
        const L = indices[i - 1];
        const R = e;
        const T = R - L;
        const size = R - L + 1;
        if (T < 5) {
          pairs.push([L, R, size]);
        }
      }
    }
    console.log(pairs);

    for (const pair of pairs) {
      for (let i = 0; i < pair[2]; i++) {
        transposed.splice(pair[0] + i, 1, true);
      }
    }

    console.log(transposed);
    const W = transposed.filter(e => e === true).length;
    console.log(W);

    const filteredTemps = data.tp.map((temp, i) => {
      if (transposed[i] === true) {
        return temp;
      }
      return undefined;
    });

    console.log(filteredTemps);

    const WavgT = this.average(filteredTemps.filter(e => e !== undefined));
    console.log(WavgT);
    return { W, WavgT };
  };
  render() {
    this.leafWetnessAndTemps(data);
    return <div />;
  }
}
