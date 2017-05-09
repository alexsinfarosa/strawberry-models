import format from "date-fns/format";
import addDays from "date-fns/add_days";
import isAfter from "date-fns/is_after";

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
    network === "miwx" ||
    (network === "cu_log" || network === "culog")
  ) {
    return "126";
  }
};

// Handling Relative Humidity Adjustment
export const networkHumidityAdjustment = network =>
  network === "miwx" ? "143" : "24";

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

export const allStations = (
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
// export const replaceNonConsecutiveMissingValues = data => {
//   return data.map((val, i) => {
//     if (i === 0 && val === "M") {
//       return data[i + 1];
//     } else if (i === data.length - 1 && val === "M") {
//       return data[i - 1];
//     } else if (val === "M" && data[i - 1] !== "M" && data[i + 1] !== "M") {
//       return avgTwoStringNumbers(data[i - 1], data[i + 1]);
//     } else {
//       return val;
//     }
//   });
// };

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
            e === "M" &&
            param[i - 1] !== "M" &&
            param[i + 1] !== "M"
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

// export const weightedAverage = arr => {
//   const firstM = arr.findIndex(e => e === "M");
//   const lastM = arr.lastIndexOf("M");
//   const missingValues = arr.filter(e => e === "M").length;
// };

// Replaces current station (cStation) missing values with compared station
export const replaceMissingValues = (cStation, sStation) => {
  return cStation.map((e, i) => {
    if (e === "M" && sStation[i] !== "M") {
      return sStation[i].toString();
    }
    return e.toString();
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
  // handling the case for T and W
  if (data.length === 0) return 0;

  // handling the case when data is null or has 24 Missing values
  const missingValues = data.filter(e => e === "M").length;
  if (data.length === 0 || missingValues === 24) return "No Data";

  //  calculating average
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
    TP = day.tpFinal;
    RH = day.rhFinal.map(e => (e >= 90 ? e : false));
    PT = day.ptFinal.map(e => (e > 0 ? e : false));
    params = [RH, PT];
  } else {
    TP = day.tpFinal;
    RH = day.rhFinal.map(e => (e >= 90 ? e : false));
    LW = day.lwFinal.map(e => (e > 0 ? e : false));
    PT = day.ptFinal.map(e => (e > 0 ? e : false));
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
export const botrytisModel = data => {
  const W = data.W;
  const T = data.T;
  const i = -4.268 + 0.0294 * W * T - 0.0901 * W - 0.0000235 * W * T ** 3;
  return (1 / (1 + Math.exp(-i))).toFixed(2);
};

export const anthracnoseModel = data => {
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

  // Since to shift data we requested one day more from the server, we slice to get rid of
  // the extra day
  return results.slice(0, -1);
};

// From numeric.js
const linspace = (a, b, n) => {
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

// Returns an array with all missing values replace by the linspace function
export const linspaceMissingValues = data => {
  const checkIfAllMValues = data.filter(e => e === "M").length;
  if (checkIfAllMValues === 24) {
    return "No data available for this day";
  } else if (checkIfAllMValues < 12) {
    let results = data;
    while (results.findIndex(e => e === "M") !== -1) {
      const firstIndex = data.findIndex(e => e === "M");
      const valuesToReplace = data.slice(firstIndex).findIndex(e => e !== "M");
      const lastIndex = firstIndex + valuesToReplace - 1;
      const startRange = firstIndex - 1;
      const endRange = lastIndex + 1;
      const range = linspace(startRange, endRange, valuesToReplace);

      for (let i = 0; i < valuesToReplace; i++) {
        results.splice(firstIndex + i, 1, range[i].toString());
      }
    }
    return results;
  } else {
    return data;
  }
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
  acis = replaceNonConsecutiveMissingValues(acis);
  acis = noonToNoon(acis);
  // acis.slice(0, 3).map(e => e.map(d => console.log(d)));

  // currentYear !== startDateYear means it is not this year, hence no forecast
  let results = [];
  if (currentYear !== startDateYear) {
    for (const day of acis) {
      // creating a 'day' object with the returned params from ACIS
      results.push({
        date: day[0],
        tp: day[1],
        rh: day[2],
        lw: day[3],
        pt: day[4]
      });
    }

    const idAndNetwork = await getSisterStationIdAndNetwork(protocol, station);
    let sisterStationData = await fetchSisterStationData(
      protocol,
      idAndNetwork,
      station,
      startDate,
      endDate,
      currentYear,
      startDateYear
    );
    sisterStationData = replaceNonConsecutiveMissingValues(sisterStationData);
    sisterStationData = noonToNoon(sisterStationData);

    // Adding to the 'day' object, sister's data
    for (const [i, day] of sisterStationData.entries()) {
      results[i]["tpSis"] = day[1];
      results[i]["rhSis"] = day[2];
      results[i]["lwSis"] = day[3];
      results[i]["ptSis"] = day[4];
    }

    // replacing missing values with sister station
    for (const [i, day] of results.entries()) {
      results[i]["tpFinal"] = replaceMissingValues(day.tp, day.tpSis);
      results[i]["rhFinal"] = replaceMissingValues(day.rh, day.rhSis);
      results[i]["lwFinal"] = replaceMissingValues(day.lw, day.lwSis);
      results[i]["ptFinal"] = replaceMissingValues(day.pt, day.ptSis);
    }
    console.log("We are in past year");
    // results.map(e => console.log(e.date, e.tp, e.tpSis, e.tpFinal));
  } else {
    // currentYear === startDateYear means it is forecast
    for (const day of acis) {
      // creating a 'day' object with the returned params from ACIS
      results.push({
        date: day[0],
        tp: day[1],
        rh: day[2],
        pt: day[4]
      });
    }

    const idAndNetwork = await getSisterStationIdAndNetwork(protocol, station);
    let sisterStationData = await fetchSisterStationData(
      protocol,
      idAndNetwork,
      station,
      startDate,
      endDate,
      currentYear,
      startDateYear
    );
    sisterStationData = replaceNonConsecutiveMissingValues(sisterStationData);
    sisterStationData = noonToNoon(sisterStationData);

    // Adding to the 'day' object, sister's data
    for (const [i, day] of sisterStationData.entries()) {
      results[i]["tpSis"] = day[1];
      results[i]["rhSis"] = day[2];
      results[i]["ptSis"] = day[4];
    }

    // replacing missing values with sister station
    for (const [i, day] of results.entries()) {
      results[i]["tpCurrentAndSiter"] = replaceMissingValues(day.tp, day.tpSis);
      results[i]["rhCurrentAndSiter"] = replaceMissingValues(day.rh, day.rhSis);
      results[i]["ptCurrentAndSiter"] = replaceMissingValues(day.pt, day.ptSis);
    }
    // fetching forecast data
    let forecastData = await fetchForecastData(
      protocol,
      station,
      startDate,
      endDate
    );
    forecastData = replaceNonConsecutiveMissingValues(forecastData);
    forecastData = noonToNoon(forecastData);

    // forecastData.map(day => day.map(p => console.log(p)));

    // Adding to the 'day' object, forecast data
    for (const [i, day] of forecastData.entries()) {
      results[i]["tpForecast"] = day[1];
      results[i]["rhForecast"] = day[2];
      results[i]["ptForecast"] = day[3];
    }

    // replacing tpDiff values with forecast station temperatures (tpf)
    for (const [i, day] of results.entries()) {
      results[i]["tpFinal"] = replaceMissingValues(
        day.tpCurrentAndSiter,
        day.tpForecast
      );
      // Forcast data needs to have relative humidity array adjusted
      results[i]["rhFinal"] = RHAdjustment(
        replaceMissingValues(day.rhCurrentAndSiter, day.rhForecast)
      );
      results[i]["ptFinal"] = replaceMissingValues(
        day.ptCurrentAndSiter,
        day.ptForecast
      );
    }
  }

  // results.map(e => console.log(e));

  // MAKING CALCULATIONS --------------------------------------------------------------------
  let ciccio = [];
  const base = 50;
  let cdd = 0;
  for (const [i, day] of results.entries()) {
    let date = format(day.date, "MMM D");
    const today = new Date();
    if (isAfter(day.date, today)) {
      date = `${date} - Forecast`;
    }

    const Tavg = average(day.tpFinal);
    const Tmin = Math.min(...day.tpFinal);
    const Tmax = Math.max(...day.tpFinal);

    // calculate dd (degree day)
    const dd = Tavg - base > 0 ? Tavg - base : 0;

    // calculate cdd (cumulative degree day)
    cdd += dd;

    // returns relative humidity above or equal to 90% (RH >= 90)
    const rhAboveValues = aboveEqualToValue(day.rhFinal, 90);

    // Number of hours where relative humidity was above 90%
    const hrsRH = rhAboveValues.filter(e => e !== false).length;

    // calculate dicv..
    let dicv = 0;
    if (Tavg >= 59 && Tavg <= 94 && hrsRH > 0) {
      dicv = table[hrsRH.toString()][Tavg.toString()];
    }

    let cercosporaBeticola = { date, dicv };

    // Returns an object {W: Int, T: Int}
    const W_and_T = leafWetnessAndTemps(day, currentYear, startDateYear);

    let indexBotrytis = botrytisModel(W_and_T);
    if (indexBotrytis === "NaN") {
      indexBotrytis = "No Data";
    }
    let indexAnthracnose = anthracnoseModel(W_and_T);
    if (indexAnthracnose === "NaN") {
      indexAnthracnose = "No Data";
    }

    // setup botrytis risk level
    let botrytis = { date: date, index: indexBotrytis };
    if (indexBotrytis !== "No Data") {
      if (indexBotrytis < 0.50) {
        botrytis["riskLevel"] = "Low";
        botrytis["color"] = "low";
      } else if (indexBotrytis >= 0.50 && indexBotrytis < 0.70) {
        botrytis["riskLevel"] = "Moderate";
        botrytis["color"] = "moderate";
      } else {
        botrytis["riskLevel"] = "High";
        botrytis["color"] = "high";
      }
    }

    // setup anthracnose risk level
    let anthracnose = {
      date: date,
      index: indexAnthracnose
    };
    if (indexAnthracnose !== "No Data") {
      if (indexAnthracnose < 0.50) {
        anthracnose["riskLevel"] = "Low";
        anthracnose["color"] = "low";
      } else if (indexAnthracnose >= 0.50 && indexAnthracnose < 0.70) {
        anthracnose["riskLevel"] = "Low";
        anthracnose["color"] = "low";
      } else {
        anthracnose["riskLevel"] = "Low";
        anthracnose["color"] = "low";
      }
    }

    // CREATE OBJECT WITH THINGS YOU NEED...
    ciccio.push({
      date,
      graphDate: format(day.date, "MMM D"),
      tp: day.tpFinal,
      rh: day.rhFinal,
      lw: day.lwFinal,
      pt: day.ptFinal,
      base,
      Tmin,
      Tmax,
      Tavg,
      dd,
      cdd,
      W_and_T,
      hrsRH,
      botrytis,
      anthracnose,
      cercosporaBeticola
    });
  }
  // ciccio.map(e => console.log(e));
  return ciccio;
};

// Returns an array with cumulative Daily Infection Critical Values
export const cumulativeDICV = dicv => {
  const arr = [];
  dicv.reduce((prev, curr, i) => (arr[i] = prev + curr), 0);
  return arr;
};
