import { startOfDay, endOfDay } from "date-fns/esm";
import {
  averageMissingValues,
  flatten,
  dailyToHourlyDatesLST,
  dailyToHourlyDates
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
  if (params.isThisYear) {
    const tempForecast = acisData.get("tempForecast");
    const rhumForecast = acisData.get("rhumForecast");

    forecastValues["temp"] = flatten(tempForecast.map(arr => arr[1]));
    forecastValues["rhum"] = flatten(rhumForecast.map(arr => arr[1]));

    replacedMissingValuesWithForecast = {
      ...replacedMissingValuesWithSisterStn
    };
    Object.keys(forecastValues).forEach(key => {
      const arr = replacedMissingValuesWithSisterStn[key].map((value, i) =>
        value === "M" ? forecastValues[key][i].toString() : value
      );

      // shifting data from 00:00 to 23:00 -> 01:00 to 24:00
      replacedMissingValuesWithForecast[key] = arr.slice(0, -1);
    });
  }

  // Checking if current year
  const cleanedHourlyData = params.isThisYear
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

  // Daily Data -----------------------------------------------------------------
  let dailyData = [];
  // left needs to start from 23 because December 31 has only 23 hours. The first hour
  // was removed when shifted left.
  let left = 23;
  left = 36; // since we need to have a day from 13:00 to 12:00 of the day after
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
