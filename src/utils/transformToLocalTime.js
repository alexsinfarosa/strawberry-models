///////////////////////////////////////////////////////////////////////////////////////
// transforming data to local time
// data comes form the ACIS call
// data = ['2018/12-31', Array(24), Array(24), Array(24), ...]
// ////////////////////////////////////////////////////////////////////////////////////

import { format, startOfDay, endOfDay } from "date-fns/esm";
import {
  averageMissingValues,
  dailyToHourlyDatesLST,
  dailyToHourlyDates
} from "./utils";

import flatten from "lodash.flatten";

export default (params, acisData) => {
  const { meta, data } = acisData;
  console.log(params, meta, data);

  const results = {};
  // an array containing dates (String) going from yyyy-12-31 to dateOfInterest + 5 days(yyyy-mm-dd)
  results.dates = data.map(arr => arr[0]);
  const elements = data.map(arr => arr.slice(1));
  params.eleNames.forEach((name, i) => {
    results[name] = flatten(elements.map(arr => arr[i]));
  });

  // hourlyDates in local time go from yyyy-12-31 00:00 to dateOfInterest + 5 days (yyyy-mm-dd 23:00)
  results.hourlyDatesLST = results.dates
    .map(date => dailyToHourlyDates(date))
    .reduce((acc, results) => [...acc, ...results], []);

  console.log(results);
  // array of indeces where the value must be shifted (DST)
  const indices = results.hourlyDatesLST.map((hour, i) => {
    const tzoFromDate = parseInt(format(new Date(hour), "Z"), 10);
    return tzoFromDate !== meta.tzo ? i : null;
  });

  console.log(indices);

  // // // generating the array of objects
  let hourlyData = [];
  let dailyData = [];

  // // // values go from yyyy-01-01 00:00 to dateOfInterest current hour
  // results.hourlyValues = params.elemsNames.forEach((name, i) => {
  //   const el = elements.map(arr => arr[i]);
  //   hourlyValues[name] = [el[23], ...el.slice(24, -1)];
  // });
  // console.log(hourlyValues);

  // const valuesHourly = [replaced[23], ...replaced.slice(24, -1)];

  // // the valuesShifted array has the hour shifted
  params.eleNames.forEach(name => {
    results[`${name}DST`] = results[name].map((v, i) =>
      v in indices ? results[name][i - 1] : v
    );
  });

  let left = 0;
  let right = 0;

  // results.dates.forEach((date, i) => {
  //   const numOfHours = dailyToHourlyDatesLST(startOfDay(date), endOfDay(date))
  //     .length;

  //   right = left + numOfHours;

  //   let p = {};
  //   p["date"] = date;
  //   p["temps"] = valuesHourlyShifted.slice(left, right);

  //   left += numOfHours;
  //   dailyData.push(p);
  // });

  // hourlyDates.forEach((hour, i) => {
  //   let p = {};
  //   p["date"] = new Date(hour);
  //   p["temp"] = valuesHourlyShifted[i];
  //   hourlyData.push(p);
  // });
};
