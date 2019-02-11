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
      // const countMissingValues = obj.temp.filter(t => t === "M").length;
      const countMissingValues = 2; // TODO: countMissingValues should be calculated...

      const { date, temp, rhum, lwet, pcpn } = obj;

      let p = {};
      p["date"] = date;

      let W, T;
      let atRisk = [];
      if (lwet.length > 0) {
        lwet.map((lw, i) => {
          let o = {};
          if ((lw === 0 && pcpn[i] > 0) || lw >= 1) {
            o["lw"] = +lw;
            o["pcpn"] = +pcpn[i];
            o["index"] = i;
            o["temp"] = +temp[i];
            atRisk.push(o);
          }
        });
      } else {
        rhum.map((rh, j) => {
          let o = {};
          if (+rh >= 90) {
            o["rhum"] = +rh;
            o["index"] = j;
            o["temp"] = +temp[j];
            atRisk.push(o);
          }
        });
      }

      p["atRisk"] = atRisk;
      console.log(p);

      if (countMissingValues < 5) {
        p["botrytis"] = 0.6;
        p["anthracnose"] = 0.7;
      } else {
        missingDays.push(date);
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
