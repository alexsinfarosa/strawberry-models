import { decorate, computed } from "mobx";
import { format } from "date-fns/esm";

export default class CurrentModel {
  paramsStore;
  constructor(appStore) {
    this.paramsStore = appStore.paramsStore;
  }

  // data from paramsStore -------------------------------------------------------
  get data() {
    return this.paramsStore.data;
  }

  get dailyData() {
    return this.data.dailyData;
  }

  get hourlyData() {
    return this.data.hourlyData;
  }

  // current model ---------------------------------------------------------------
  get modelData() {
    let missingDays = [];
    return this.dailyData.map(obj => {
      const { date, temp, rhum, lwet, pcpn } = obj;
      // const countMissingValues = obj.temp.filter(t => t === "M").length;
      const countMissingValues = 2;
      let p = {};
      if (countMissingValues < 5) {
        p["date"] = date;
        p["botrytis"] = 0.6;
        p["anthracnose"] = 0.7;
      } else {
        missingDays.push(date);
        p["date"] = date;
        p["botrytis"] = "N/A";
        p["anthracnose"] = "N/A";
      }
      // console.log(p);
      return { p, missingDays };
    });
  }

  get dataForTable() {
    const dateOfInterest = format(
      this.paramsStore.params.dateOfInterest,
      "YYYY-MM-DD"
    );
    const dates = this.modelData.map(d => d.p.date);
    const dateOfInterestIdx = dates.indexOf(dateOfInterest);

    // this.modelData.map(d => console.log(d));
    return this.modelData
      .slice(dateOfInterestIdx - 2, dateOfInterestIdx + 6)
      .map(d => d.p);
  }

  get missingDays() {
    return this.modelData[0].missingDays;
  }
}

decorate(CurrentModel, {
  data: computed,
  dailyData: computed,
  hourlyData: computed,
  modelData: computed,
  dataForTable: computed,
  missingDays: computed
});
