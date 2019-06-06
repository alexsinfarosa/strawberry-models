import { startOfDay, endOfDay } from "date-fns/esm";
import {
  averageMissingValues,
  flatten,
  dailyToHourlyDatesLST,
  dailyToHourlyDates,
  rhAdjustment
} from "./utils";

export default (acisData, params) => {
  // current station
  const currentStn = acisData.get("currentStn");

  // dates starts from december 31st up to dateOfInterest + 5 days
  const dates = currentStn.map(arr => arr[0]);

  let currentStnValues = {};
  const elements = currentStn.map(arr => arr.slice(1));

  params.eleNames.forEach((name, i) => {
    const arr = averageMissingValues(flatten(elements.map(arr => arr[i])));

    // shifting data from 00:00 to 23:00 -> 01:00 to 24:00
    currentStnValues[name] = arr.slice(0, -1);
  });

  // sister station
  const sisterStn = acisData.get("sisterStn");
  let sisterStnValues = {};
  if (sisterStn) {
    const elements = sisterStn.map(arr => arr.slice(1));
    params.eleNames.forEach((name, i) => {
      const arr = flatten(elements.map(arr => arr[i]));
      // shifting data from 00:00 to 23:00 -> 01:00 to 24:00
      sisterStnValues[name] = arr.slice(0, -1);
    });
  }

  let replacedMissingValuesWithSisterStn = {};
  params.eleNames.forEach(name => {
    replacedMissingValuesWithSisterStn[name] = currentStnValues[name].map(
      (value, i) => (value === "M" ? sisterStnValues[name][i] : value)
    );
  });

  // if date of interest is in current year get forecast data
  let forecastValues = {};
  let replacedMissingValuesWithForecast = {};

  if (params.isYearAfter2017) {
    const tempForecast = acisData.get("tempForecast");
    const rhumForecast = acisData.get("rhumForecast");
    const qpfForecast = acisData.get("qpfForecast");
    const pop12Forecast = acisData.get("pop12Forecast");

    const forecastValuesTemp = flatten(tempForecast.map(arr => arr[1]));
    const forecastValuesRhum = flatten(rhumForecast.map(arr => arr[1]));
    const forecastValuesQpf = flatten(qpfForecast.map(arr => arr[1]));
    const forecastValuesPop12 = flatten(pop12Forecast.map(arr => arr[1]));

    // filling missing values (amount of water) -------------
    // console.log(forecastValuesQpf);
    const indecesQpf = forecastValuesQpf
      .map((v, i) => {
        if (typeof v === "number") {
          return i;
        } else {
          return null;
        }
      })
      .filter(v => Boolean(v));

    let forecastValuesQpfClean = [];
    let indexQpf = 0;
    let tempArrQpf = [];
    indecesQpf.forEach((v, i) => {
      if (v === indecesQpf[indecesQpf.length - 1]) {
        tempArrQpf = forecastValuesQpf.slice(
          indexQpf,
          forecastValuesQpf.length
        );
      } else {
        tempArrQpf = forecastValuesQpf.slice(indexQpf, v);
      }
      indexQpf = v;
      const countMissing = tempArrQpf.map(v => v === "M").length;
      const newValue = tempArrQpf[0] / countMissing;
      const newArr = new Array(countMissing).fill(newValue);
      // console.log(i, arr, countMissing, newArr);

      forecastValuesQpfClean.push(...newArr);
    });
    // console.log(forecastValuesQpfClean);

    // filling missing values (probability of precip) ----------
    // console.log(forecastValuesPop12);
    const indecesPop12 = forecastValuesPop12
      .map((v, i) => {
        if (typeof v === "number") {
          return i;
        } else {
          return null;
        }
      })
      .filter(v => Boolean(v));

    let forecastValuesPop12Clean = [];
    let indexPop12 = 0;
    let tempArrPop12 = [];
    indecesPop12.forEach((v, i) => {
      if (v === indecesPop12[indecesPop12.length - 1]) {
        tempArrPop12 = forecastValuesPop12.slice(
          indexPop12,
          forecastValuesPop12.length
        );
      } else {
        tempArrPop12 = forecastValuesPop12.slice(indexPop12, v);
      }
      indexPop12 = v;
      const countMissing = tempArrPop12.map(v => v === "M").length;
      const newValue = tempArrPop12[0];
      const newArr = new Array(countMissing).fill(newValue);
      // console.log(i, arr, countMissing, newArr);

      forecastValuesPop12Clean.push(...newArr);
    });
    // console.log(forecastValuesPop12Clean);

    // water amount -----------------------------------------------------
    const pcpnForecast = forecastValuesPop12Clean.map((p, i) => {
      return p < 6 ? 0 : forecastValuesQpfClean[i];
    });

    // console.log(pcpnForecast);

    const lwForecast = forecastValuesRhum.map(rh => {
      if (rh !== "M") {
        return rhAdjustment(rh) >= 90 ? 60 : 0;
      } else {
        return rh;
      }
    });

    forecastValues["temp"] = forecastValuesTemp.slice(0, -1);
    forecastValues["rhum"] = forecastValuesRhum.slice(0, -1);
    forecastValues["pcpn"] = pcpnForecast.slice(0, -1);
    forecastValues["lwet"] = lwForecast.slice(0, -1);

    replacedMissingValuesWithForecast = {
      ...replacedMissingValuesWithSisterStn
    };

    // console.log(replacedMissingValuesWithSisterStn);
    Object.keys(forecastValues).forEach(key => {
      const arr = replacedMissingValuesWithSisterStn[key].map((value, i) =>
        value === "M" ? forecastValues[key][i].toString() : value
      );

      // shifting data from 00:00 to 23:00 -> 01:00 to 24:00
      replacedMissingValuesWithForecast[key] = arr;
    });
  }

  // Checking if current year
  const cleanedHourlyData = params.isYearAfter2017
    ? replacedMissingValuesWithForecast
    : replacedMissingValuesWithSisterStn;

  // hourlyDates go from yyyy-12-31 01:00 to dateOfInterest + 5 days (yyyy-mm-dd 23:00)
  const hourlyDates = dates
    .map(date => dailyToHourlyDates(date))
    .reduce((acc, res) => [...acc, ...res], [])
    .slice(1);

  let hourlyData = [];
  hourlyDates.forEach((hour, i) => {
    let p = {};
    p["date"] = new Date(hour);
    params.eleNames.forEach(name => {
      p[name] = cleanedHourlyData[name][i];
    });
    hourlyData.push(p);
  });
  // console.log(hourlyData);

  // Daily Data ----------------------------------------
  let dailyData = [];
  // left needs to start from 23 because December 31 has only 23 hours. The first hour
  // was removed when shifted left.
  let left = 12; // since we need to have a day from 13:00 to 12:00 of the day after
  let right = 0;
  dates.forEach((date, i) => {
    // 1 > 0 because we need to start from jannuary 1st
    if (i > 0) {
      const numOfHours = dailyToHourlyDatesLST(startOfDay(date), endOfDay(date))
        .length;

      right = left + numOfHours;

      let p = {};
      p["date"] = date;
      params.eleNames.forEach(name => {
        p[name] = cleanedHourlyData[name].slice(left, right);
      });

      left += numOfHours;
      dailyData.push(p);
    }
  });

  let results = {
    currentStnValues,
    sisterStnValues,
    replacedMissingValuesWithSisterStn,
    forecastValues,
    cleanedHourlyData,
    hourlyDates,
    hourlyData,
    dailyData
  };

  console.log(results);
  return results;
};
