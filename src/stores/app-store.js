import { observable, action, computed } from "mobx";
import { matchIconsToStations } from "../utils";
import { states } from "../states";
import format from "date-fns/format";

export default class AppStore {
  // logic--------------------------------------------------------------------------------
  @observable protocol = window.location.protocol;
  @computed get areRequiredFieldsSet() {
    return (
      Object.keys(this.disease).length !== 0 &&
      Object.keys(this.state).length !== 0 &&
      Object.keys(this.station).length !== 0
    );
  }
  @observable isVisible = true;
  @action setIsVisible = () => this.isVisible = !this.isVisible;

  @observable isCollapsed = false;
  @action setIsCollapsed = d => this.isCollapsed = !this.isCollapsed;

  @observable isLoading = false;
  @action setIsLoading = d => this.isLoading = d;

  // Berry disease------------------------------------------------------------------------
  @observable diseases = [
    { family: "Strawberries", name: ["botrytis", "anthracnose"] },
    { family: "Blueberries", name: ["blueberry Maggot"] }
  ];
  @observable disease = JSON.parse(localStorage.getItem("berry-diseases")) || {
  };
  @action setDisease = d => {
    this.disease = this.diseases.find(disease => disease.family === d);
    localStorage.setItem("berry-diseases", JSON.stringify(this.disease));
  };

  // State--------------------------------------------------------------------------------
  @observable state = JSON.parse(localStorage.getItem("state")) || {};
  @action setState = stateName => {
    localStorage.removeItem("station");
    this.station = {};
    this.state = states.filter(state => state.name === stateName)[0];
    localStorage.setItem("state", JSON.stringify(this.state));
  };

  // Station-------------------------------------------------------------------------------
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
  @computed get getStation() {
    return this.station;
  }
  @action setStation = stationName => {
    this.station = this.stations.filter(
      station => station.name === stationName
    )[0];
    localStorage.setItem("station", JSON.stringify(this.station));
  };

  // Dates----------------------------------------------------------------------------------
  @observable currentYear = new Date().getFullYear().toString();
  @observable endDate = JSON.parse(localStorage.getItem("endDate")) || null;
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

  // ACISData -------------------------------------------------------------------------------
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
