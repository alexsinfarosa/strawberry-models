import React, { Component } from "react";
import { inject, observer } from "mobx-react";

// import "./Test.styl";

// const data = [
//   "0",
//   "M",
//   "M",
//   "M",
//   "4",
//   "5",
//   "6",
//   "7",
//   "8",
//   "M",
//   "M",
//   "M",
//   "M",
//   "13",
//   "14",
//   "15",
//   "16",
//   "17",
//   "18",
//   "19",
//   "20",
//   "21",
//   "22",
//   "23"
// ];

@inject("store")
@observer
export default class Test extends Component {
  linspace = (a, b, n) => {
    if (typeof n === "undefined") n = Math.max(Math.round(b - a) + 1, 1);
    if (n < 2) {
      return n === 1 ? [a] : [];
    }
    var i, ret = Array(n);
    n--;
    for (i = n; i >= 0; i--) {
      ret[i] = (i * b + (n - i) * a) / n;
    }
    return ret;
  };
  deleteMissingValues = data => {
    let results = data;
    while (results.findIndex(e => e === "M") !== -1) {
      const firstIndex = data.findIndex(e => e === "M");
      const valuesToReplace = data.slice(firstIndex).findIndex(e => e !== "M");
      const lastIndex = firstIndex + valuesToReplace - 1;
      const startRange = firstIndex - 1;
      const endRange = lastIndex + 1;
      const range = this.linspace(startRange, endRange, valuesToReplace);

      for (let i = 0; i < valuesToReplace; i++) {
        results.splice(firstIndex + i, 1, range[i].toString());
      }
    }
    return results;
  };
  render() {
    // this.deleteMissingValues(data);
    return <div />;
  }
}
