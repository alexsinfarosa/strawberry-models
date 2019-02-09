import axios from "axios";
import { format, addDays } from "date-fns/esm";
import cleanFetchedData from "./cleanFetchedData";

const protocol = window.location.protocol;
const dateFormat = "YYYY-MM-DD";

// Fetch selected station hourly data ---------------------------------------------------
const url = `${protocol}//data.nrcc.rcc-acis.org/StnData`;
export const fetchCurrentStationHourlyData = params => {
  return axios
    .post(url, params)
    .then(res => res.data)
    .catch(err => console.log("Failed to load station data ", err));
};

// Fetch sister station Id and network -----------------------------------------------------
const sisterIdNetworkUrl = `${protocol}//newa2.nrcc.cornell.edu/newaUtil/stationSisterInfo`;
const fetchSisterStationIdAndNetwork = params => {
  const [id, network] = params.sid.split(" ");

  return axios(`${sisterIdNetworkUrl}/${id}/${network}`)
    .then(res => res.data.temp)
    .catch(err =>
      console.log("Failed to load sister station id and network", err)
    );
};

// Fetch sister station hourly data --------------------------------------------------------
const sisterUrl = `${protocol}//data.nrcc.rcc-acis.org/StnData`;
export const fetchSisterStationHourlyData = params => {
  return axios
    .post(sisterUrl, params)
    .then(res => res.data)
    .catch(err => console.log("Failed to load sister station data ", err));
};

// Fetch forecast hourly data --------------------------------------------------------------
const forecastUrl = `${protocol}//newa2.nrcc.cornell.edu/newaUtil/getFcstData`;
const fetchHourlyForcestData = (variable, params) => {
  // always need to add 5 days
  const plusFiveDays = format(addDays(new Date(), 5), dateFormat);
  const [id, network] = params.sid.split(" ");

  return axios
    .get(
      `${forecastUrl}/${id}/${network}/${variable}/${
        params.sdate
      }/${plusFiveDays}`
    )
    .then(res => res.data)
    .catch(err =>
      console.log(
        `Failed to load hourly ${variable.toUpperCase} forecast data`,
        err
      )
    );
};

// Main Function
export default async params => {
  const results = new Map();

  // get current station hourly data
  const currentStation = await fetchCurrentStationHourlyData(params);

  // get sister station id and network
  const sisterStationIdAndNetwork = await fetchSisterStationIdAndNetwork(
    params
  );

  // get sister station hourly data
  let sisParams = { ...params };
  sisParams.sid = sisterStationIdAndNetwork;
  const sisterStation = await fetchSisterStationHourlyData(sisParams);

  if (params.isThisYear) {
    // get forecast hourly data
    const tempForecast = await fetchHourlyForcestData("temp", params);
    const rhumForecast = await fetchHourlyForcestData("rhum", params);
    results.set("tempForecast", tempForecast.data);
    results.set("rhumForecast", rhumForecast.data);
  }

  results.set("currentStn", currentStation.data);
  results.set("tzo", currentStation.meta.tzo);
  results.set("sisterStn", sisterStation.data);

  // clean data
  // console.log(results, params);
  const cleaned = cleanFetchedData(results, params);

  // console.log(cleaned);
  return cleaned;
};
