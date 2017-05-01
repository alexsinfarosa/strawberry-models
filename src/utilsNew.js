import flatten from 'lodash/flatten';
import isBefore from 'date-fns/is_before';
import isAfter from 'date-fns/is_after';
import isToday from 'date-fns/is_today';
import format from 'date-fns/format';
import addDays from 'date-fns/add_days';

// api
import {
  fetchACISData,
  getSisterStationIdAndNetwork,
  fetchSisterStationData,
  fetchForecastData,
} from './api';

// PRE FETCHING ---------------------------------------------------------
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
      station.network === 'newa' ||
      station.network === 'njwx' ||
      station.network === 'miwx' ||
      ((station.network === 'cu_log' || station.network === 'culog') &&
        station.state !== 'NY')
    ) {
      const newObj = station;
      station.state === state.postalCode || state.postalCode === 'ALL'
        ? (newObj['icon'] = newa)
        : (newObj['icon'] = newaGray);
      arr.push(newObj);
    } else if (station.network === 'cu_log' || station.network === 'culog') {
      const newObj = station;
      station.state === state.postalCode || state.postalCode === 'ALL'
        ? (newObj['icon'] = culog)
        : (newObj['icon'] = culogGray);
      newObj['icon'] = culog;
      arr.push(newObj);
    } else if (station.network === 'icao') {
      const newObj = station;
      station.state === state.postalCode || state.postalCode === 'ALL'
        ? (newObj['icon'] = airport)
        : (newObj['icon'] = airportGray);
      arr.push(newObj);
    }
  });
  // console.log(arr);
  return arr;
};

// Handling Temperature parameter and Michigan network id adjustment
export const networkTemperatureAdjustment = network => {
  // Handling different temperature parameter for each network
  if (network === 'newa' || network === 'icao' || network === 'njwx') {
    return '23';
  } else if (
    network === 'miwx' ||
    (network === 'cu_log' || network === 'culog')
  ) {
    return '126';
  }
};

// Handling Relative Humidity Adjustment
export const networkHumidityAdjustment = network =>
  (network === 'miwx' ? '143' : '24');

// Handling Michigan state ID adjustment
export const michiganIdAdjustment = station => {
  if (
    station.state === 'MI' &&
    station.network === 'miwx' &&
    station.id.slice(0, 3) === 'ew_'
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
    station['sid'] = `${station.name} ${station.network}`;
    station['sdate'] = startDate;
    station['edate'] = format(addDays(endDate, 6), 'YYYY-MM-DD');
    station['id-adj'] = michiganIdAdjustment(station);
    station['elems'] = [
      // temperature
      networkTemperatureAdjustment(station.network),
      // relative humidity
      networkHumidityAdjustment(station.network),
      // leaf wetness
      '118',
      // precipitation
      '5',
    ];
  }
  // console.log(stationsWithIcons);
  return stationsWithIcons;
};

// POST FETCHING ---------------------------------------------------------------

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
    if (i === 0 && val === 'M') {
      return data[i + 1];
    } else if (i === data.length - 1 && val === 'M') {
      return data[i - 1];
    } else if (val === 'M' && data[i - 1] !== 'M' && data[i + 1] !== 'M') {
      return avgTwoStringNumbers(data[i - 1], data[i + 1]);
    } else {
      return val;
    }
  });
};

export const weightedAverage = arr => {
  const firstM = arr.findIndex(e => e === 'M');
  const lastM = arr.lastIndexOf('M');
  const missingValues = arr.filter(e => e === 'M').length;
};

export const compareAndReplace = (cStation, sStation) => {
  return cStation.map((e, i) => {
    if (e === 'M' && sStation[i] !== 'M') {
      return sStation[i].toString();
    }
    return e.toString();
  });
};

// Returns rh array containing new values.
// The new values are calculated according to the equation below.
export const RHAdjustment = arr => {
  return arr.map(e => {
    if (e !== 'M') {
      return Math.round(
        parseFloat(e) / (0.0047 * parseFloat(e) + 0.53)
      ).toString();
    } else {
      return e;
    }
  });
};

// Returns the data array (MAIN FUNCTION) --------------------------------------
export const Data = async (
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
      lw: replaceNonConsecutiveMissingValues(day[3]),
      pt: replaceNonConsecutiveMissingValues(day[4]),
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
    results[i]['tpSis'] = replaceNonConsecutiveMissingValues(day[1]);
    results[i]['rhSis'] = replaceNonConsecutiveMissingValues(day[2]);
    results[i]['lwSis'] = replaceNonConsecutiveMissingValues(day[3]);
    results[i]['ptSis'] = replaceNonConsecutiveMissingValues(day[4]);
  }

  // replacing temperature (tp) with sister station temperatures (tps)
  for (const [i, day] of results.entries()) {
    results[i]['tpDiff'] = compareAndReplace(day.tp, day.tpSis);
    results[i]['rhDiff'] = compareAndReplace(day.rh, day.rhSis);
    results[i]['lwDiff'] = compareAndReplace(day.lw, day.lwSis);
    results[i]['ptDiff'] = compareAndReplace(day.pt, day.ptSis);
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
    results[i]['tpFore'] = replaceNonConsecutiveMissingValues(day[1]);
    results[i]['rhFore'] = replaceNonConsecutiveMissingValues(day[2]);
    results[i]['lwFore'] = replaceNonConsecutiveMissingValues(day[3]);
    results[i]['ptFore'] = replaceNonConsecutiveMissingValues(day[4]);
  }

  // replacing tpDiff values with forecast station temperatures (tpf)
  for (const [i, day] of results.entries()) {
    results[i]['tpFinal'] = compareAndReplace(day.tpDiff, day.tpFore);
    results[i]['rhFinal'] = compareAndReplace(day.rhDiff, day.rhFore);
    // Forcast data needs to have relative humidity array adjusted
    results[i]['rhFinalAdj'] = RHAdjustment(day.rhFinal);
    results[i]['lwFinal'] = compareAndReplace(day.lwDiff, day.lwFore);
    results[i]['ptFinal'] = compareAndReplace(day.ptDiff, day.ptFore);
  }

  // MAKING CALCULATIONS -------------------------------------------------------
  let ciccio = [];
  const base = 50;
  let cdd = 0;
  for (const [i, day] of results.entries()) {
    const avg = average(day.tp);
    const dd = avg - base > 0 ? avg - base : 0;
    cdd += dd;

    // setup Past, Current or Forecast text
    let timeframe;
    const today = format(new Date(), 'YYYY-MM-DD');
    if (isBefore(day.date, today)) {
      timeframe = 'Past';
    }
    if (isToday(day.date, today)) {
      timeframe = 'Today';
    }
    if (isAfter(day.date, today)) {
      timeframe = 'Forecast';
    }

    ciccio.push({
      date: format(day.date, 'MMM D'),
      tp: currentYear === startDateYear ? day.tpFinal : day.tpDiff,
      rh: currentYear === startDateYear ? day.rhFinalAdj : day.rhDiff,
      lw: currentYear === startDateYear ? day.lwFinal : day.lwDiff,
      pt: currentYear === startDateYear ? day.ptFinal : day.ptDiff,
      time: timeframe,
      base: base,
      Tmin: Math.min(...day['tp']),
      Tmax: Math.max(...day['tp']),
      Tavg: avg,
      dd: dd,
      cdd: cdd,
    });
  }
  ciccio.map(e => console.log(e));
  return ciccio;
};

// Returns an array with cumulative Daily Infection Critical Values
export const cumulativeDICV = dicv => {
  const arr = [];
  dicv.reduce((prev, curr, i) => (arr[i] = prev + curr), 0);
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
  let indices = transposed.map((e, i) => (e === true ? i : e));
  indices = indices.filter(e => typeof e === 'number');

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

  temps = temps.map(day => day.filter(e => e !== undefined && e !== 'M'));
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
    const i =
      -3.70 +
      0.33 * W -
      0.069 * W * T +
      0.0050 * W * T ** 2 -
      0.000093 * W * T ** 3;
    return (1 / (1 + Math.exp(-i))).toFixed(2);
  });
};

// Returns an array of objects. Current application model
export const berryModel = (station, data, endDate) => {
  // shift the data to (1,24)
  let results = noonToNoon(data);
  results = results.slice(0, -1);

  // If station is 'icao' adjust RH values
  if (station.network === 'icao') {
    results = RHAdjustment(results);
  }

  const botrytis = indexBotrytis(leafWetnessAndTemps(results));
  const anthracnose = indexAnthracnose(leafWetnessAndTemps(results));

  // STRAWBERRY ------------------------------------------------------------------
  // botrytisIR, anthracnoseIR, dateTextDisplay are needed because of antd tables
  let arr = [];
  // let cdd = 0;
  for (const [i, day] of results.entries()) {
    // setup botrytis risk level
    let botrytisIR = '';
    if (botrytis[i] < 0.50) {
      botrytisIR = 'Low';
    } else if (botrytis[i] >= 0.50 && botrytis[i] < 0.70) {
      botrytisIR = 'Moderate';
    } else {
      botrytisIR = 'High';
    }

    // setup anthracnose risk level
    let anthracnoseIR = '';
    if (anthracnose[i] < 0.50) {
      anthracnoseIR = 'Low';
    } else if (anthracnose[i] >= 0.50 && anthracnose[i] < 0.70) {
      anthracnoseIR = 'Moderate';
    } else {
      anthracnoseIR = 'High';
    }

    // setup Past, Current or Forecast text
    let dateTextDisplay;
    const today = new Date();
    if (isBefore(day[0], today)) {
      dateTextDisplay = 'Past';
    }
    if (isToday(day[0], today)) {
      dateTextDisplay = 'Current';
    }
    if (isAfter(day[0], today)) {
      dateTextDisplay = 'Forecast';
    }

    // BLUBERRY MAGGOT --------------------------------------------------------------
    const base = 50;
    const avg = average(day[1]);
    const dd = avg - base > 0 ? avg - base : 0;
    // console.log(cdd);
    // cdd += dd;
    // console.log(cdd);

    // Build an array of objects with what you need...!
    arr.push({
      botrytis: {
        date: format(day[0], 'MMM D'),
        time: dateTextDisplay,
        temp: day[1],
        rh: day[2],
        lw: day[3],
        pt: day[4],
        index: botrytis[i],
        riskLevel: botrytisIR,
      },
      anthracnose: {
        date: format(day[0], 'MMM D'),
        time: dateTextDisplay,
        temp: day[1],
        rh: day[2],
        lw: day[3],
        pt: day[4],
        index: anthracnose[i],
        riskLevel: anthracnoseIR,
      },
      blueberryMaggot: {
        date: format(day[0], 'MMM D'),
        temp: day[1],
        time: dateTextDisplay,
        base: base,
        min: Math.min(...day[1]),
        max: Math.max(...day[1]),
        average: avg,
        dd: dd,
        // cdd: cdd,
      },
    });
  }
  // arr.map(e => console.log(e));
  return arr;
};

// Returns styled console.logs
export const logData = data => {
  for (const day of data) {
    const M = day
      .filter(d => Array.isArray(d))
      .map(e => e.filter(d => d === 'M').length);

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
