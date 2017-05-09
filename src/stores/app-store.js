import { observable, action, computed } from "mobx";
import { matchIconsToStations } from "../utils";
import { states } from "../states";
import format from "date-fns/format";

export default class AppStore {
  // logic--------------------------------------------------------------------------------
  @observable protocol = window.location.protocol;
  @computed get areRequiredFieldsSet() {
    return (
      Object.keys(this.subject).length !== 0 &&
      Object.keys(this.state).length !== 0 &&
      Object.keys(this.station).length !== 0
    );
  }
  @observable isVisible = true;
  @action setIsVisible = () => (this.isVisible = !this.isVisible);

  @observable isCollapsed = false;
  @action setIsCollapsed = d => (this.isCollapsed = !this.isCollapsed);

  @observable isLoading = false;
  @action setIsLoading = d => (this.isLoading = d);

  @observable model = "";
  @action setModel = d => (this.model = d.slice(1));

  // State--------------------------------------------------------------------------------
  @observable state = JSON.parse(localStorage.getItem("state")) || {};
  @action setState = stateName => {
    localStorage.removeItem("station");
    this.station = {};
    this.state = states.filter(state => state.name === stateName)[0];
    localStorage.setItem("state", JSON.stringify(this.state));
  };

  // Berry subject------------------------------------------------------------------------
  @observable subjects = {
    berry: [
      { name: "Strawberries", diseases: ["botrytis", "anthracnose"] },
      { name: "Blueberries", diseases: ["Blueberrie Maggot"] }
    ],
    beet: [{ name: "Cercospora Beticola", diseases: [] }]
  };
  @observable subject = {};
  @action resetSubject = () => (this.subject = {});
  @action setSubjectFromLocalStorage = d => (this.subject = d);
  @action setSubject = d => {
    this.subject = this.subjects[this.model].find(
      subject => subject.name === d
    );

    localStorage.setItem(`${this.model}`, JSON.stringify(this.subject));
  };

  // Station------------------------------------------------------------------------------
  @observable stations = [];
  @action setStations = d => (this.stations = d);
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
  @observable endDate = JSON.parse(localStorage.getItem("endDate")) ||
    new Date();
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
  @action setACISData = d => (this.ACISData = d);

}
