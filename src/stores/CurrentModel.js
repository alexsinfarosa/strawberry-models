import { decorate, computed, observable, action } from "mobx";
import { format } from "date-fns/esm";
import { botrytisIndex, anthracnoseIndex } from "../utils/utils";

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
    console.log(this.dailyData.slice());
    return this.dailyData.map(obj => {
      const { date, temp, rhum, lwet, pcpn } = obj;
      // For now I check the missing values only on the temp array. Maybe we should check it for every array
      const countMissingValues = temp.filter(t => t === "M").length;

      let p = {};
      p["date"] = date;

      if (countMissingValues > 5) {
        missingDays.push(date);
        p["botrytis"] = "N/A";
        p["anthracnose"] = "N/A";
      } else {
        let atRisk = [];
        if (lwet.length > 0) {
          lwet.forEach((lw, i) => {
            let o = {};
            if ((lw === 0 && pcpn[i] >= 0.01) || lw >= 1) {
              o["lw"] = +lw;
              o["pcpn"] = +pcpn[i];
              o["index"] = i;
              o["temp"] = +temp[i];
              atRisk.push(o);
            }
          });
        } else {
          rhum.forEach((rh, j) => {
            let o = {};
            if ((+rh < 90 && pcpn[j] >= 0.01) || +rh >= 90) {
              o["rhum"] = +rh;
              o["index"] = j;
              o["temp"] = +temp[j];
              atRisk.push(o);
            }
          });
        }
        console.log(date, atRisk);

        p["atRisk"] = atRisk;
        const dryHours = 4;
        let indeces = [];
        let arr = [];
        p.atRisk.forEach((obj, i) => {
          // console.log(obj, i);
          if (i === 0) {
            arr.push(obj);
          } else {
            if (obj.index - p.atRisk[i - 1].index >= dryHours) {
              indeces.push(arr);
              arr = [];
              arr.push(obj);
            } else {
              arr.push(obj);
              if (i === p.atRisk.length - 1) {
                indeces.push(arr);
              }
            }
          }
        });
        console.log(indeces);
        p["indeces"] = indeces;

        let countLeafWetnesHoursAndAvgTemps = [];
        indeces.forEach(arr => {
          let p = {};
          p["w"] = arr.length;
          p["avgT"] =
            [...arr.map(o => o.temp)].reduce((acc, res) => acc + res, 0) /
            arr.length;
          countLeafWetnesHoursAndAvgTemps.push(p);
        });

        p["countLeafWetnesHoursAndAvgTemps"] = countLeafWetnesHoursAndAvgTemps;

        let botrytis = 0;
        let anthracnose = 0;
        countLeafWetnesHoursAndAvgTemps.forEach(arr => {
          const w = arr.w;
          const t = arr.avgT;
          botrytis += botrytisIndex(w, t);
          anthracnose += anthracnoseIndex(w, t);
        });

        p["botrytis"] = botrytis.toFixed(2);
        p["anthracnose"] = anthracnose.toFixed(2);
      }

      // console.log(p, missingDays);
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

  CSVData = [];
  setCSVData = () => {
    this.CSVData = [];
    // console.log(this.CSVData.length);
    this.modelData.forEach((obj, i) => {
      // const patchedDay = format(, "YYYY-MM-DD");

      const date = obj["p"].date;
      const anthracnose = obj["p"].anthracnose;
      const botrytis = obj["p"].botrytis;

      this.CSVData.push({
        date,
        anthracnose,
        botrytis
      });
    });
  };
}

decorate(CurrentModel, {
  CSVData: observable,
  setCSVData: action,
  data: computed,
  dailyData: computed,
  hourlyData: computed,
  modelData: computed,
  dataForTable: computed,
  missingDays: computed
});
