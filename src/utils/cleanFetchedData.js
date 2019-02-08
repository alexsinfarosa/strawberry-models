import { format, startOfDay, endOfDay } from "date-fns/esm";
import {
  averageMissingValues,
  flatten,
  dailyToHourlyDatesLST,
  dailyToHourlyDates
} from "./utils";

export default (acisData, params) => {
  // tzo
  const tzo = acisData.get("tzo");

  // current station
  const currentStn = acisData.get("currentStn");

  // dates starts from december 31st up to dateOfInterest + 5 days
  let dates = currentStn.map(arr => arr[0]);

  const currentStnValues = averageMissingValues(
    flatten(currentStn.map(arr => arr[1]))
  );

  let replaced = currentStnValues;

  // sister station
  const sisterStn = acisData.get("sisterStn");
  if (sisterStn) {
    // a station can have not data at all and return an error
    const sisterStnValues = flatten(sisterStn.map(arr => arr[1]));

    // replace current station values with sister station's
    replaced = replaced.map((t, i) => (t === "M" ? sisterStnValues[i] : t));
  }

  // if date of interest is in current year
  if (params.isThisYear) {
    const forecast = acisData.get("forecast");
    const forecastValues = flatten(forecast.map(arr => arr[1]));

    // replace missing values with forecast data
    replaced = replaced.map((t, i) =>
      t === "M" ? forecastValues[i].toString() : t
    );
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  // transforming data to local time
  // ////////////////////////////////////////////////////////////////////////////////////

  // dates go from yyyy-01-01 to dateOfInterest (yyyy-mm-dd)
  dates = dates.slice(1); // from Jan 1st

  // hourlyDates go from yyyy-01-01 00:00 to dateOfInterest (yyyy-mm-dd 23:00)
  const hourlyDates = dates
    .map(date => dailyToHourlyDates(date))
    .reduce((acc, results) => [...acc, ...results], []);

  // array of indeces where the hour must be shifted
  const arrOFIndeces = hourlyDates.map((hour, i) => {
    const tzoFromDate = parseInt(format(new Date(hour), "Z"), 10);
    return tzoFromDate !== tzo ? i : null;
  });

  // removing null values
  const indices = arrOFIndeces.filter(d => d);

  // generating the array of objects

  let hourlyData = [];
  let dailyData = [];

  // values go from yyyy-01-01 00:00 to dateOfInterest current hour
  const valuesHourly = [replaced[23], ...replaced.slice(24, -1)];

  // the valuesShifted array has the hour shifted
  const valuesHourlyShifted = valuesHourly.map((v, i) =>
    v in indices ? valuesHourly[i - 1] : v
  );

  let left = 0;
  let right = 0;
  // values go from yyyy-01-01 00:00 to dateOfInterest current hour
  const valuesDaily = [...replaced.slice(24)];

  // the valuesShifted array has the hour shifted
  const valuesDailysShifted = valuesDaily.map((v, i) =>
    v in indices ? valuesDaily[i - 1] : v
  );

  dates.forEach((date, i) => {
    const numOfHours = dailyToHourlyDatesLST(startOfDay(date), endOfDay(date))
      .length;

    right = left + numOfHours;

    let p = {};
    p["date"] = date;
    p["temps"] = valuesDailysShifted.slice(left, right);

    left += numOfHours;
    dailyData.push(p);
  });

  hourlyDates.forEach((hour, i) => {
    let p = {};
    p["date"] = new Date(hour);
    p["temp"] = valuesHourlyShifted[i];
    hourlyData.push(p);
  });

  // console.log(dailyData, hourlyData);
  return [dailyData, hourlyData];
};
