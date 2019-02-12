import { decorate, observable, computed, action, reaction, when } from "mobx";
import { allStates } from "../assets/states";
import axios from "axios";

// utils
import { idAdjustment, vXDef } from "../utils/utils";

// date-fns
import {
  isAfter,
  isBefore,
  format,
  getYear,
  startOfHour,
  addDays,
  isSameYear
} from "date-fns/esm";

// fetch
import fetchData from "../utils/fetchData";
// import currentModel from "../utils/currentModel";

// const
const url = `${
  window.location.protocol
}//newa2.nrcc.cornell.edu/newaUtil/stateStationList/all`;

export default class ParamsStore {
  constructor() {
    when(() => this.stations.length === 0, () => this.loadStations());

    when(
      () => !this.isLoading,
      () => {
        this.readFromLocalstorage();
        reaction(() => this.asJson, json => this.writeToLocalstorage(json));
      }
    );

    reaction(
      () => this.asJson,
      () =>
        this.stationID === "" || !this.dateOfInterest
          ? null
          : this.loadData(this.params)
    );
  }

  // logic --------------------------------------------------------------------------------
  isLoading = false;

  //   state ------------------------------------------------------------------------------
  postalCode = "ALL";
  setPostalCode = e => {
    this.postalCode = e.target.value;
    this.stationID = "";
  };
  get state() {
    return allStates.find(state => state.postalCode === this.postalCode);
  }

  //   station -----------------------------------------------------------------------------
  stationID = "";
  setStationID = e => {
    this.stationID = e.target.value;
    this.postalCode = this.station.state;
  };
  get station() {
    return this.stations.find(station => station.id === this.stationID);
  }
  stations = [];
  setStations = d => (this.stations = d);

  loadStations() {
    this.isLoading = true;
    return axios
      .get(url)
      .then(res => {
        // console.log(res.data.stations);
        this.setStations(res.data.stations);
        this.isLoading = false;
      })
      .catch(err => {
        console.log("Failed to load stations", err);
      });
  }

  get filteredStationList() {
    return this.postalCode === "ALL"
      ? this.stations
      : this.stations.filter(station => station.state === this.postalCode);
  }

  setStateStationFromMap = station => {
    this.postalCode = station.state;
    this.stationID = station.id;
  };

  //   date of interest -------------------------------------------------------------------
  dateOfInterest = new Date();
  get sdate() {
    return `${getYear(this.dateOfInterest) - 1}-12-31`;
  }
  setDateOfInterest = d => (this.dateOfInterest = d);

  //   localstorage ------------------------------------------------------------------------
  writeToLocalstorage = json => {
    localStorage.setItem("newa-strawberry-models", JSON.stringify(json));
  };

  readFromLocalstorage = () => {
    const localStorageRef = localStorage.getItem("newa-strawberry-models");
    if (localStorageRef) {
      const params = JSON.parse(localStorageRef);

      if (Object.keys(params).length !== 0) {
        this.postalCode = params.postalCode;
        this.stationID = params.stationID;
        this.dateOfInterest = new Date("2018-05-10 16:00");
      }
    }
  };

  // params ----------------------------------------------------------------------------------
  get asJson() {
    return {
      postalCode: this.postalCode,
      stationID: this.stationID,
      dateOfInterest: this.dateOfInterest
    };
  }

  get params() {
    if (this.station) {
      return {
        sid: `${idAdjustment(this.station)} ${this.station.network}`,
        sdate: this.sdate,
        edate: format(addDays(this.dateOfInterest, 5), "YYYY-MM-DD"),
        elems: [
          {
            vX: vXDef[this.station.network]["temp"],
            prec: 1,
            units: "degC"
          },
          { vX: vXDef[this.station.network]["rhum"], prec: 0 },
          { vX: vXDef[this.station.network]["lwet"], prec: 0 },
          { vX: vXDef[this.station.network]["pcpn"], prec: 2 }
        ],
        eleNames: ["temp", "rhum", "lwet", "pcpn"],
        meta: "tzo",
        janFirst: `${getYear(this.dateOfInterest)}-01-01 00:00`,
        dateOfInterest: format(
          startOfHour(this.dateOfInterest),
          "YYYY-MM-DD HH:00"
        ),
        isThisYear: isSameYear(new Date(), this.dateOfInterest)
      };
    }
  }

  get isSeason() {
    if (!isSameYear(new Date(), this.dateOfInterest)) {
      return true;
    }
    return (
      isAfter(
        this.dateOfInterest,
        new Date(`${getYear(this.dateOfInterest)}-03-01`)
      ) &&
      isBefore(
        this.dateOfInterest,
        new Date(`${getYear(this.dateOfInterest)}-10-01`)
      )
    );
  }

  // data model --------------------------------------------------------------------------------
  data = [];
  missingDays = [];
  loadData = params => {
    this.data = [];
    this.isLoading = true;
    // fetching data
    fetchData(params).then(res => (this.data = res));
    this.isLoading = false;
  };
}

decorate(ParamsStore, {
  isLoading: observable,
  postalCode: observable,
  setPostalCode: action,
  state: computed,
  stationID: observable,
  setStationID: action,
  station: computed,
  stations: observable,
  setStations: action,
  filteredStationList: computed,
  dateOfInterest: observable,
  sdate: computed,
  setDateOfInterest: action,
  asJson: computed,
  readFromLocalstorage: action,
  params: computed,
  setStateStationFromMap: action,
  data: observable,
  missingDays: observable,
  setData: action,
  isSeason: computed
});
