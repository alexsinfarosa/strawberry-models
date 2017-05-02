import format from "date-fns/format";
import addDays from "date-fns/add_days";

// table for the beet model
import { table } from "../src/models/Beets/table";

// api
import {
  fetchACISData,
  getSisterStationIdAndNetwork,
  fetchSisterStationData,
  fetchForecastData
} from "./api";

// PRE FETCHING ---------------------------------------------------------
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
  // console.log(arr);
  return arr;
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
  (network === "miwx" ? "143" : "24");

// Handling Michigan state ID adjustment
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

export const allStationsX = (
  protocol,
  acis,
  stations,
  state,
  startDate,
  endDate
) => {
  let stationsWithIcons = matchIconsToStations(protocol, stations, state);

  // building the station object with the things I might need
  for (const station of stationsWithIcons) {
    station["sid"] = `${station.name} ${station.network}`;
    station["sdate"] = startDate;
    station["edate"] = format(addDays(endDate, 6), "YYYY-MM-DD");
    station["id-adj"] = michiganIdAdjustment(station);
    station["elems"] = [
      // temperature
      networkTemperatureAdjustment(station.network),
      // relative humidity
      networkHumidityAdjustment(station.network),
      // leaf wetness
      "118",
      // precipitation
      "5"
    ];
  }
  // console.log(stationsWithIcons);
  return stationsWithIcons;
};

// POST FETCHING ----------------------------------------------------------------------------

// Returns the average of two numbers.
export const avgTwoStringNumbers = (a, b) => {
  const aNum = parseFloat(a);
  const bNum = parseFloat(b);
  return Math.round((aNum + bNum) / 2).toString();
};

// It replaces non consecutive values in data with the average
// of the left and the right values
export const replaceNonConsecutiveMissingValues = data => {
  return data.map((val, i) => {
    if (i === 0 && val === "M") {
      return data[i + 1];
    } else if (i === data.length - 1 && val === "M") {
      return data[i - 1];
    } else if (val === "M" && data[i - 1] !== "M" && data[i + 1] !== "M") {
      return avgTwoStringNumbers(data[i - 1], data[i + 1]);
    } else {
      return val;
    }
  });
};

// export const weightedAverage = arr => {
//   const firstM = arr.findIndex(e => e === "M");
//   const lastM = arr.lastIndexOf("M");
//   const missingValues = arr.filter(e => e === "M").length;
// };

// Replaces current station (cStation) missing values with compared station
export const compareAndReplace = (cStation, sStation) => {
  return cStation.map((e, i) => {
    if (e === "M" && sStation[i] !== "M") {
      return sStation[i];
    }
    return e;
  });
};

// Returns rh array containing new values.
// The new values are calculated according to the equation below.
export const RHAdjustment = arr => {
  return arr.map(e => {
    if (e !== "M") {
      return Math.round(parseFloat(e) / (0.0047 * parseFloat(e) + 0.53));
    } else {
      return e;
    }
  });
};

// Returns average of all the values in array
export const average = data => {
  if (data.length === 0) {
    return 0;
  }
  let results = data.map(e => parseFloat(e));
  return Math.round(results.reduce((acc, val) => acc + val, 0) / data.length);
};

// Returns array with elements above the second argument of the function
export const aboveValue = (data, value) => {
  return data.map(e => {
    if (e > value) {
      return e;
    }
    return false;
  });
};

// Returns array with elements equal to and above the second argument of the function
export const aboveEqualToValue = (data, value) => {
  return data.map(e => {
    if (e >= value) {
      return e;
    }
    return false;
  });
};

// Convert Fahrenheit to Celcius
export const fahrenheitToCelcius = data => {
  return (data - 32) * 5 / 9;
};

// Returns wetness interval (W) and average temperature at those intervals (T)
export const leafWetnessAndTemps = (day, currentYear, startDateYear) => {
  let RH, PT, LW, TP, params;
  if (currentYear === startDateYear) {
    RH = day.rhFinal.map(e => (e >= 90 ? e : false));
    PT = day.ptFinal.map(e => (e > 0 ? e : false));
    TP = day.tpFinal.map(e => (e > 0 ? e : false));
    params = [RH, PT];
  } else {
    RH = day.rhDiff.map(e => (e >= 90 ? e : false));
    PT = day.ptDiff.map(e => (e > 0 ? e : false));
    LW = day.lwDiff.map(e => (e > 0 ? e : false));
    TP = day.tpDiff.map(e => (e > 0 ? e : false));
    params = [RH, PT, LW];
  }
  // console.log(params);
  const transpose = m => m[0].map((x, i) => m.map(x => x[i]));

  // Returns true if there is at least one true value in the array
  const transposed = transpose(params).map(e => e.find(e => e !== false));
  // console.log(transposed);
  let indices = transposed.map((e, i) => (e !== undefined ? i : e));
  // console.log(indices);
  indices = indices.filter(e => typeof e === "number");
  // console.log(indices);
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
  // console.log(pairs);

  for (const pair of pairs) {
    for (let i = 0; i < pair[2]; i++) {
      transposed.splice(pair[0] + i, 1, true);
    }
  }

  // console.log(transposed);
  const W = transposed.filter(e => e === true).length;
  // console.log(W);

  const filteredTemps = TP.map((temp, i) => {
    if (transposed[i] === true) {
      return temp;
    }
    return undefined;
  });

  // console.log(filteredTemps);

  let T = average(filteredTemps.filter(e => e !== undefined));
  T = fahrenheitToCelcius(T);
  // console.log(W, T);
  return { W, T };
};

// Berries model ----------------------------------------------------------------------------
export const botrytis = data => {
  const W = data.W;
  const T = data.T;
  const i = -4.268 + 0.0294 * W * T - 0.0901 * W - 0.0000235 * W * T ** 3;
  return (1 / (1 + Math.exp(-i))).toFixed(2);
};

export const anthracnose = data => {
  const W = data.W;
  const T = data.T;
  const i =
    -3.70 +
    0.33 * W -
    0.069 * W * T +
    0.0050 * W * T ** 2 -
    0.000093 * W * T ** 3;
  return (1 / (1 + Math.exp(-i))).toFixed(2);
};

// Returns the data array (MAIN FUNCTION) ---------------------------------------------------
export const getData = async (
  protocol,
  station,
  startDate,
  endDate,
  currentYear,
  startDateYear
) => {
  // Cleaning and Adjustments
  let acis = [];
  acis = await fetchACISData(protocol, station, startDate, endDate);

  let results = [];
  for (const day of acis) {
    // creating a 'day' object with the returned params from ACIS
    results.push({
      date: day[0],
      tp: replaceNonConsecutiveMissingValues(day[1]),
      rh: replaceNonConsecutiveMissingValues(day[2]),
      // no lw for forecast data
      lw: currentYear === startDateYear
        ? null
        : replaceNonConsecutiveMissingValues(day[3]),
      pt: replaceNonConsecutiveMissingValues(day[4])
    });
  }

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

  // Adding to the 'day' object sister's data
  for (const [i, day] of sisterStationData.entries()) {
    results[i]["tpSis"] = replaceNonConsecutiveMissingValues(day[1]);
    results[i]["rhSis"] = replaceNonConsecutiveMissingValues(day[2]);
    results[i]["lwSis"] = currentYear === startDateYear
      ? null
      : replaceNonConsecutiveMissingValues(day[3]);
    results[i]["ptSis"] = replaceNonConsecutiveMissingValues(day[4]);
  }

  // replacing temperature (tp) with sister station temperatures (tps)
  for (const [i, day] of results.entries()) {
    results[i]["tpDiff"] = compareAndReplace(day.tp, day.tpSis);
    results[i]["rhDiff"] = compareAndReplace(day.rh, day.rhSis);
    results[i]["lwDiff"] = currentYear === startDateYear
      ? null
      : compareAndReplace(day.lw, day.lwSis);
    results[i]["ptDiff"] = compareAndReplace(day.pt, day.ptSis);
  }

  // fetching forecast data
  const forecastData = await fetchForecastData(
    protocol,
    station,
    startDate,
    endDate
  );

  // Adding to the 'day' object forecast data
  for (const [i, day] of forecastData.entries()) {
    results[i]["tpFore"] = replaceNonConsecutiveMissingValues(day[1]);
    results[i]["rhFore"] = replaceNonConsecutiveMissingValues(day[2]);
    results[i]["ptFore"] = replaceNonConsecutiveMissingValues(day[3]);
  }

  // replacing tpDiff values with forecast station temperatures (tpf)
  for (const [i, day] of results.entries()) {
    results[i]["tpFinal"] = compareAndReplace(day.tpDiff, day.tpFore);
    results[i]["rhFinal"] = compareAndReplace(day.rhDiff, day.rhFore);
    // Forcast data needs to have relative humidity array adjusted
    results[i]["rhFinalAdj"] = RHAdjustment(day.rhFinal);
    results[i]["ptFinal"] = compareAndReplace(day.ptDiff, day.ptFore);
  }

  // MAKING CALCULATIONS --------------------------------------------------------------------
  let ciccio = [];
  const base = 50;
  let cdd = 0;
  for (const day of results) {
    const avg = currentYear === startDateYear
      ? average(day.tpFinal)
      : average(day.tpDiff);

    const min = currentYear === startDateYear
      ? Math.min(...day.tpFinal)
      : Math.min(...day.tpDiff);

    const max = currentYear === startDateYear
      ? Math.max(...day.tpFinal)
      : Math.max(...day.tpDiff);

    // calculate dd (degree day)
    const dd = avg - base > 0 ? avg - base : 0;

    // calculate cdd (cumulative degree day)
    cdd += dd;

    // returns relative humidity above 90% (RH > 90)
    const rhAboveValues = currentYear === startDateYear
      ? aboveEqualToValue(day.rhFinal, 90)
      : aboveEqualToValue(day.rhDiff, 90);

    // returns leaf wetness above 0 (LW > 0)
    // const lwAboveValues = currentYear === startDateYear
    //   ? aboveValue(day.lwFinal, 0)
    //   : aboveValue(day.lwDiff, 0);

    // returns precipitation above 0 (PT > 0)
    // const ptAboveValues = currentYear === startDateYear
    //   ? aboveValue(day.ptFinal, 0)
    //   : aboveValue(day.ptDiff, 0);

    // Number of hours where relative humidity was above 90%
    const hrsRH = rhAboveValues.filter(e => e !== false).length;

    // calculate dicv ...
    let dicv = 0;
    if (avg >= 59 && avg <= 94 && hrsRH > 0) {
      dicv = table[hrsRH.toString()][avg.toString()];
    }

    const W_and_T = leafWetnessAndTemps(day, currentYear, startDateYear);

    const indexBotrytis = botrytis(W_and_T);
    const indexAnthracnose = anthracnose(W_and_T);

    // CREATE OBJECT WITH THINGS YOU NEED...
    ciccio.push({
      date: format(day.date, "MMM D"),
      tp: currentYear === startDateYear ? day.tpFinal : day.tpDiff,
      rh: currentYear === startDateYear ? day.rhFinalAdj : day.rhDiff,
      lw: currentYear === startDateYear ? "No data for forecast" : day.lwDiff,
      pt: currentYear === startDateYear ? day.ptFinal : day.ptDiff,
      base: base,
      Tmin: min,
      Tmax: max,
      Tavg: avg,
      dd: dd,
      cdd: cdd,
      W_and_T: W_and_T,
      hrsRH: hrsRH,
      dicv: dicv,
      botrytis: indexBotrytis,
      anthracnose: indexAnthracnose
    });
  }
  // ciccio.map(e => console.log(e));
  return ciccio;
};
