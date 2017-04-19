import { observable, action, computed } from "mobx";
import { matchIconsToStations } from "../utils";
import { states } from "../states";
import format from "date-fns/format";

export default class AppStore {
  @observable current = false;
  @action setCurrent = () => this.current = !this.current;

  // logic------------------------------------------------------------------------------------
  @observable protocol = window.location.protocol;
  @observable isSubmitted = false;
  @action setIsSubmitted = d => this.isSubmitted = d;
  @observable isLoading = true;
  @action setIsLoading = d => this.isLoading = d;
  @observable missingValue = 0;
  @action setMissingValue = d => this.missingValue = d;
  @computed get areRequiredFieldsSet() {
    return (
      Object.keys(this.state && this.station).length !== 0 &&
      this.disease.length !== 0
    );
  }
  @observable isGraphDisplayed = false;
  @action setIsGraphDisplayed = d => this.isGraphDisplayed = d;
  @observable dailyGraph = true;
  @action setDailyGraph = () => this.dailyGraph = !this.dailyGraph;
  @observable barColor;
  @action setBarColor = d => this.barColor = d;

  // Router ------------------------------------------------------------------------------------
  @observable isMap = false;
  @action setIsMap = () => {
    this.isMap = true;
    this.isResults = false;
    this.isMoreInfo = false;
  };
  @observable isResults = false;
  @action setIsResults = () => {
    this.isMap = false;
    this.isResults = true;
    this.isMoreInfo = false;
  };
  @observable isMoreInfo = false;
  @action setIsMoreInfo = () => {
    this.isMap = false;
    this.isResults = false;
    this.isMoreInfo = true;
  };

  //Disease------------------------------------------------------------------------------------
  @observable disease = JSON.parse(localStorage.getItem("beet-disease")) || "";
  @action setDisease = d => {
    this.disease = d;
    localStorage.setItem("beet-disease", JSON.stringify(this.disease));
  };
  @observable selectDisease = this.disease ? true : false;
  @action setSelectDisease = d => this.selectDisease = d;
  @observable diseaseR = "";
  @action setDiseaseR = d => this.diseaseR = d;

  //State--------------------------------------------------------------------------------------
  @observable state = JSON.parse(localStorage.getItem("state")) || {};
  @action setState = stateName => {
    this.state = states.filter(state => state.name === stateName)[0];
    localStorage.setItem("state", JSON.stringify(this.state));
  };
  @observable selectState = this.state.name ? true : false;
  @action setSelectState = d => {
    this.selectState = d;
    if (this.isLoading) {
      this.setIsMap();
    }
  };
  @observable stateR = {};
  @action setStateR = d => this.stateR = d;

  //Station---------------------------------------------------------------------------------
  @observable stations = [];
  @action setStations = d => this.stations = d;
  @computed get stationsWithMatchedIcons() {
    return matchIconsToStations(this.protocol, this.stations, this.state);
  }
  @computed get getCurrentStateStations() {
    return this.stations.filter(
      station => station.state === this.state.postalCode
    );
  }
  @observable station = JSON.parse(localStorage.getItem("station")) || {};
  @action setStation = stationName => {
    this.station = this.stations.filter(
      station => station.name === stationName
    )[0];
    localStorage.setItem("station", JSON.stringify(this.station));
  };
  @observable selectStation = this.station.name ? true : false;
  @action setSelectStation = d => this.selectStation = d;
  @observable stationR = {};
  @action setStationR = d => this.stationR = d;

  // Dates-------------------------------------------------------------------------------------
  @observable currentYear = new Date().getFullYear().toString();
  @observable endDate = JSON.parse(localStorage.getItem("endDate")) ||
    format(new Date(), "YYYY-MM-DD");
  @action setEndDate = d => {
    this.endDate = format(d, "YYYY-MM-DD");
    localStorage.setItem("endDate", JSON.stringify(this.endDate));
  };
  @computed get startDate() {
    return `${format(this.endDate, "YYYY")}-01-01`;
  }
  @computed get startDateYear() {
    return format(this.endDate, "YYYY");
  }
  @observable endDateR = format(new Date(), "YYYY-MM-DD");
  @action setEndDateR = d => this.endDateR = format(d, "YYYY-MM-DD");
  @computed get startDateR() {
    return `${format(this.endDateR, "YYYY")}-01-01`;
  }

  // ACISData ---------------------------------------------------------------------------------
  @observable ACISData = [];
  @action setACISData = d => this.ACISData = d;
  @computed get dates() {
    return this.ACISData.map(e => e.date);
  }
  @computed get temps() {
    return this.ACISData.map(e => e.temp);
  }
  @computed get rhs() {
    return this.ACISData.map(e => e.rh);
  }
  @computed get lws() {
    return this.ACISData.map(e => e.lw);
  }
  @computed get pts() {
    return this.ACISData.map(e => e.pt);
  }
  @computed get botrytis() {
    return this.ACISData.map(e => e.botrytis);
  }
  @computed get anthracnose() {
    return this.ACISData.map(e => e.anthracnose);
  }
}
