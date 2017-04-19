import flatten from "lodash/flatten";

// Returns an array of objects. Each object is a station with the following
export const matchIconsToStations = (protocol, stations, state) => {
  const arr = [];
  const newa = `${protocol}//newa2.nrcc.cornell.edu/gifs/newa_small.png`;
  const newaGray = `${protocol}//newa2.nrcc.cornell.edu/gifs/newa_smallGray.png`;
  const airport = `${protocol}//newa2.nrcc.cornell.edu/gifs/airport.png`;
  const airportGray = `${protocol}//newa2.nrcc.cornell.edu/gifs/airportGray.png`;
  const culog = `${protocol}//newa2.nrcc.cornell.edu/gifs/culog.png`;
  const culogGray = `${protocol}//newa2.nrcc.cornell.edu/gifs/culogGray.png`;

  stations.forEach(station => {
    if (
      station.network === "newa" ||
      station.network === "njwx" ||
      station.network === "miwx" ||
      ((station.network === "cu_log" || station.network === "culog") &&
        station.state !== "NY")
    ) {
      const newObj = station;
      station.state === state.postalCode || state.postalCode === "ALL"
        ? (newObj["icon"] = newa)
        : (newObj["icon"] = newaGray);
      arr.push(newObj);
    } else if (station.network === "cu_log" || station.network === "culog") {
      const newObj = station;
      station.state === state.postalCode || state.postalCode === "ALL"
        ? (newObj["icon"] = culog)
        : (newObj["icon"] = culogGray);
      newObj["icon"] = culog;
      arr.push(newObj);
    } else if (station.network === "icao") {
      const newObj = station;
      station.state === state.postalCode || state.postalCode === "ALL"
        ? (newObj["icon"] = airport)
        : (newObj["icon"] = airportGray);
      arr.push(newObj);
    }
  });
  return arr;
};

// Returns the average of two numbers.
export const avgTwoStringNumbers = (a, b) => {
  const aNum = parseFloat(a);
  const bNum = parseFloat(b);
  return Math.round((aNum + bNum) / 2).toString();
};

// Handling Temperature parameter and Michigan network id adjustment
export const networkTemperatureAdjustment = network => {
  // Handling different temperature parameter for each network
  if (network === "newa" || network === "icao" || network === "njwx") {
    return "23";
  } else if (
    network === "miwx" || (network === "cu_log" || network === "culog")
  ) {
    return "126";
  }
};

// Handling Relative Humidity Adjustment
export const networkHumidityAdjustment = network =>
  network === "miwx" ? "143" : "24";

// Handling Michigan state network adjustment
export const michiganIdAdjustment = station => {
  if (
    station.state === "MI" &&
    station.network === "miwx" &&
    station.id.slice(0, 3) === "ew_"
  ) {
    // example: ew_ITH
    return station.id.slice(3, 6);
  }
  return station.id;
};

// It replaces non consecutive values in data with the average
// of the left and the right values
export const replaceNonConsecutiveMissingValues = data => {
  return data.map(day => {
    return day.map(param => {
      if (Array.isArray(param)) {
        return param.map((e, i) => {
          if (i === 0 && e === "M") {
            return param[i + 1];
          } else if (i === param.length - 1 && e === "M") {
            return param[i - 1];
          } else if (
            e === "M" && param[i - 1] !== "M" && param[i + 1] !== "M"
          ) {
            return avgTwoStringNumbers(param[i - 1], param[i + 1]);
          } else {
            return e;
          }
        });
      }
      return param;
    });
  });
};

// Returns acis with replaced consecutive values
export const replaceConsecutiveMissingValues = (
  fromStation,
  currentStation
) => {
  return currentStation.map((day, d) => {
    return day.map((param, p) => {
      if (Array.isArray(param)) {
        return param.map((e, i) => {
          if (e === "M") {
            return fromStation[d][p][i];
          } else {
            return e;
          }
        });
      }
      return param;
    });
  });
};

// Returns true if the there are Missing values in the sub arrays (TP, RH, LW, PT)
export const containsMissingValues = data => {
  const TPandRH = data
    .map(day => day[1].filter(e => e === "M").length)
    .reduce((acc, val) => acc + val, 0);

  return TPandRH > 0 ? true : false;
};

// Returns an array similar to ACIS with the rh sub array containing new values.
// The new values are calculated according to the equation below.
export const RHAdjustment = data => {
  return data.map(day => {
    return day.map((param, i) => {
      // Modify only RH array
      if (i === 2) {
        return param.map(e => {
          if (e !== "M") {
            return Math.round(
              parseFloat(e) / (0.0047 * parseFloat(e) + 0.53)
            ).toString();
          } else {
            return e;
          }
        });
      }
      return param;
    });
  });
};

// Returns an array with cumulative Daily Infection Critical Values
export const cumulativeDICV = dicv => {
  const arr = [];
  dicv.reduce((prev, curr, i) => arr[i] = prev + curr, 0);
  return arr;
};

// Returns average of all the values in array
export const average = data => {
  if (data.length === 0) {
    return 0;
  }
  let results = data.map(e => parseFloat(e));
  return Math.round(results.reduce((acc, val) => acc + val, 0) / data.length);
};

// Convert Fahrenheit to Celcius
export const fahrenheitToCelcius = data => {
  return (data - 32) * 5 / 9;
};

// This function will shift data from (0, 23) to (12, 24)
export const noonToNoon = data => {
  let results = [];

  // get all dates
  const dates = data.map(day => day[0]);

  // shifting Temperature array
  const TP = data.map(day => day[1]);
  const TPFlat = [].concat(...TP);
  let TPShifted = [];
  while (TPFlat.length > 24) {
    TPShifted.push(TPFlat.splice(12, 24));
  }

  // shifting relative humidity array
  let RH = data.map(day => day[2]);
  const RHFlat = [].concat(...RH);
  let RHShifted = [];
  while (RHFlat.length > 24) {
    RHShifted.push(RHFlat.splice(12, 24));
  }

  // shifting leaf wetness array
  const LW = data.map(day => day[3]);
  const LWFlat = [].concat(...LW);
  let LWShifted = [];
  while (LWFlat.length > 24) {
    LWShifted.push(LWFlat.splice(12, 24));
  }

  // shifting precipitation array
  const PT = data.map(day => day[4]);
  const PTFlat = [].concat(...PT);
  let PTShifted = [];
  while (PTFlat.length > 24) {
    PTShifted.push(PTFlat.splice(12, 24));
  }

  for (const [i, el] of dates.entries()) {
    results[i] = [el, TPShifted[i], RHShifted[i], LWShifted[i], PTShifted[i]];
  }

  return results;
};

// Returns an array of arrays. Each array has a date (String), a temp (Array) and a LW array
export const leafWetnessAndTemps = data => {
  // Returns true if leaf wetness values are greater than 0
  const LW = flatten(data.map(day => day[3].map(e => e > 0)));
  // Returns true if relative humidity values are greater than or equal to 90
  const RH = flatten(data.map(day => day[2].map(e => e >= 90)));
  // Returns true if precipitation values are greater than 0
  const PT = flatten(data.map(day => day[4].map(e => e > 0)));

  const params = [LW, RH, PT];
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
      if (T < 5) {
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
  temps = temps.map(day => average(day));

  filteredLW = filteredLW.map(day => day.filter(e => e === true).length);

  let results = [];
  for (const [i, d] of dates.entries()) {
    results.push([d, temps[i], filteredLW[i]]);
  }
  return results;
};

export const indexBotrytis = data => {
  return data.map(day => {
    const T = fahrenheitToCelcius(day[1]);
    const W = day[2];
    const i = -4.268 + 0.0294 * W * T - 0.0901 * W - 0.0000235 * W * T ** 3;
    return (1 / (1 + Math.exp(-i))).toFixed(2);
  });
};

export const indexAnthracnose = data => {
  return data.map(day => {
    const T = fahrenheitToCelcius(day[1]);
    const W = day[2];
    const i = -3.70 +
      0.33 * W -
      0.069 * W * T +
      0.0050 * W * T ** 2 -
      0.000093 * W * T ** 3;
    return (1 / (1 + Math.exp(-i))).toFixed(2);
  });
};

// Returns an array of objects. Current application model
export const currentModel = (station, data) => {
  // shift the data to (1,24)
  let results = noonToNoon(data);
  results = results.slice(0, -1);

  // If station is 'icao' adjust RH values
  if (station.network === "icao") {
    results = RHAdjustment(results);
  }

  const botrytis = indexBotrytis(leafWetnessAndTemps(results));
  const anthracnose = indexAnthracnose(leafWetnessAndTemps(results));

  // Build an array of objects with what you need...!
  let arr = [];
  for (const [i, day] of results.entries()) {
    arr.push({
      date: day[0],
      temp: day[1],
      rh: day[2],
      lw: day[3],
      pt: day[4],
      botrytis: botrytis[i],
      anthracnose: anthracnose[i]
    });
  }
  return arr;
};

// Returns styled console.logs
export const logData = data => {
  for (const day of data) {
    const M = day
      .filter(d => Array.isArray(d))
      .map(e => e.filter(d => d === "M").length);

    console.log(`%c${day[0]}`, `color: red; font-size: 12px`);
    console.log(
      `TP -> %c${M[0]} %c${day[1]}`,
      `color: red;
        font-size: 12px;
        margin-right: 10px;
      `,
      `background: #FFA8A8`
    );
    console.log(
      `RH -> %c${M[1]} %c${day[2]}`,
      `color: red;
        font-size: 12px;
        margin-right: 10px;
      `,
      `background: #D8D8D8`
    );
  }
};
