import {
  isBefore,
  addHours,
  isEqual,
  startOfDay,
  endOfDay,
  getHours
} from "date-fns/esm";

// MAP ---------------------------------------------------------
export const matchIconsToStations = (station, state) => {
  const protocol = window.location.protocol;
  const { network } = station;
  const { postalCode } = state;

  const newa = `${protocol}//newa2.nrcc.cornell.edu/gifs/newa_small.png`;
  const newaGray = `${protocol}//newa2.nrcc.cornell.edu/gifs/newa_smallGray.png`;
  const airport = `${protocol}//newa2.nrcc.cornell.edu/gifs/airport.png`;
  const airportGray = `${protocol}//newa2.nrcc.cornell.edu/gifs/airportGray.png`;
  const culog = `${protocol}//newa2.nrcc.cornell.edu/gifs/culog.png`;
  const culogGray = `${protocol}//newa2.nrcc.cornell.edu/gifs/culogGray.png`;

  if (
    network === "newa" ||
    network === "njwx" ||
    network === "miwx" ||
    network === "oardc" ||
    network === "nysm" ||
    ((network === "cu_log" || network === "culog") && station.state !== "NY")
  ) {
    return station.state === postalCode || postalCode === "ALL"
      ? newa
      : newaGray;
  }

  if (network === "cu_log" || network === "culog") {
    return station.state === postalCode || postalCode === "ALL"
      ? culog
      : culogGray;
  }

  if (network === "icao") {
    return station.state === postalCode || postalCode === "ALL"
      ? airport
      : airportGray;
  }
};

export const vXDef = {
  newa: {
    pcpn: 5,
    temp: 23,
    rhum: 24,
    lwet: 118,
    wspd: 128,
    wdir: 130,
    srad: 132,
    st4i: 120,
    sm4i: 65
  },
  icao: { pcpn: 5, temp: 23, rhum: 24, wspd: 28, wdir: 27, dwpt: 22 },
  cu_log: {
    pcpn: 5,
    temp: 126,
    rhum: 24,
    lwet: 118,
    wspd: 128,
    wdir: 130,
    srad: 132
  },
  culog: {
    pcpn: 5,
    temp: 126,
    rhum: 24,
    lwet: 118,
    wspd: 128,
    wdir: 130,
    srad: 132
  },
  njwx: { pcpn: 5, temp: 23, rhum: 24, wspd: 28, wdir: 27, srad: 149 },
  miwx: { pcpn: 5, temp: 126, rhum: 143, lwet: 118, srad: 132 },
  oardc: {
    pcpn: 5,
    temp: 23,
    rhum: 24,
    lwet: 118,
    wspd: 28,
    wdir: 27,
    srad: 132,
    st4i: 120
  },
  nysm: {
    pcpn: 5,
    temp: 23,
    rhum: 24,
    wspd: 28,
    wdir: 27,
    srad: 132,
    st4i: 120,
    sm2i: 104
  }
};

// Handling ID adjustment
export const idAdjustment = station => {
  // Michigan
  if (
    station.state === "MI" &&
    station.network === "miwx" &&
    station.id.slice(0, 3) === "ew_"
  ) {
    // example: ew_ITH
    return station.id.slice(3, 6);
  }

  // NY mesonet
  if (
    station.state === "NY" &&
    station.network === "nysm" &&
    station.id.slice(0, 5) === "nysm_"
  ) {
    // example: nysm_spra
    return station.id.slice(5, 9);
  }

  return station.id;
};

// Returns the average of two numbers.
export const avgTwoStringNumbers = (a, b) => {
  const aNum = parseFloat(a);
  const bNum = parseFloat(b);
  return ((aNum + bNum) / 2).toFixed(1);
};

const weightedMean = res => {
  // ex: [2,M,M,5] => [2,3,45]
  const arr = res.map(d => Number(d));
  const firstM = ((arr[0] + arr[0] + arr[3]) / 3).toPrecision(2);
  const secondM = ((arr[0] + arr[3] + arr[3]) / 3).toPrecision(2);
  return [firstM, secondM];
};

export const averageMissingValues = d => {
  // console.log(d);
  if (d.includes("M")) {
    if (d[0] === "M" && d[1] !== "M") d[0] = d[1];
    if (d[0] === "M" && d[1] === "M" && d[2] !== "M") {
      d[0] = d[2];
      d[1] = d[2];
    }

    const len = d.length - 1;
    if (d[len] === "M" && d[len - 1] !== "M") d[len] = d[len - 1];
    if (d[len] === "M" && d[len - 1] === "M" && d[len - 2] !== "M") {
      d[len] = d[len - 2];
      d[len - 1] = d[len - 2];
    }

    return d.map((t, i) => {
      if (d[i - 1] !== "M" && t === "M" && d[i + 1] !== "M") {
        return avgTwoStringNumbers(d[i - 1], d[i + 1]);
      }

      if (
        d[i - 1] !== "M" &&
        t === "M" &&
        d[i + 1] === "M" &&
        d[i + 2] !== "M"
      ) {
        const arr = [d[i - 1], d[i], d[i + 1], d[i + 2]];
        const rep = weightedMean(arr);
        t = rep[0];
        d[i + 1] = rep[1];
      }

      return t;
    });
  }
  return d;
};

export const flatten = arr => Array.prototype.concat(...arr);

export const unflatten = array => {
  let res = [];
  while (array.length > 0) res.push(array.splice(0, 24));
  return res;
};

// Convert Fahrenheit to Celcius
export const fahrenheitToCelcius = (t, missing) =>
  t === missing ? t : (((t - 32) * 5) / 9).toFixed(1);

// Convert Celcius to Fahrenheit
export const celciusToFahrenheit = (t, missing) =>
  t === missing ? t : (t * (9 / 5) + 32).toFixed(1);

// Returns average of all the values in array
export const average = data => {
  // handling the case for T and W
  if (data.length === 0) return 0;

  //  calculating average
  let results = data.map(e => parseFloat(e));
  return Math.round(results.reduce((acc, val) => acc + val, 0) / data.length);
};

export const dailyToHourlyDatesLST = (sdate, edate) => {
  let startDay = sdate;
  let endDay = edate;

  let results = [];
  results.push(startDay);

  while (isBefore(startDay, endDay)) {
    startDay = addHours(startDay, 1);
    if (isBefore(startDay, endDay) || isEqual(startDay, endDay)) {
      results.push(startDay);
    }
  }
  return results;
};

export const dailyToHourlyDates = date => {
  const numOfHours = dailyToHourlyDatesLST(startOfDay(date), endOfDay(date));
  const hoursArr = numOfHours.map(h => getHours(h));
  let results = hoursArr.map(hour => {
    if (hour >= 0 && hour <= 9) hour = `0${hour}`;
    return `${date} ${hour}:00`;
  });
  // console.log(results);
  return results;
};

// This formula is used to calculate the growing degree day
export const baskervilleEmin = (min, max, base) => {
  if (min >= base) {
    const avg = (max + min) / 2;
    return avg - base;
  } else if (max <= base) {
    return 0;
  } else {
    const avg = (max + min) / 2;
    const amt = (max - min) / 2;
    const t1 = Math.sin((base - avg) / amt);
    return avg < 0
      ? 0
      : (amt * Math.cos(t1) - (base - avg) * (3.14 / 2 - t1)) / 3.14;
  }
};

// Berries model ----------------------------------------------------------------------------
export const botrytisIndex = (W, T) => {
  const i = -4.268 + 0.0294 * W * T - 0.0901 * W - 0.0000235 * W * T ** 3;
  return (1 / (1 + Math.exp(-i))).toFixed(2);
};

export const anthracnoseIndex = (W, T) => {
  const i =
    -3.7 +
    0.33 * W -
    0.069 * W * T +
    0.005 * W * T ** 2 -
    0.000093 * W * T ** 3;
  return (1 / (1 + Math.exp(-i))).toFixed(2);
};
