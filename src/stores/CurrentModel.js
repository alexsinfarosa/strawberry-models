import { decorate, computed, observable, action } from "mobx";
import { format } from "date-fns/esm";
import { botrytisIndex, anthracnoseIndex, rhAdjustment } from "../utils/utils";

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

  // current model -----------------------------------------------
  get modelData() {
    let missingDays = [];
    return this.dailyData.map(obj => {
      const { date, temp, rhum, lwet, pcpn } = obj;
      // console.log(date, [...temp]);
      // For now I check the missing values only on the temp array. Maybe we should check it for every array
      const countMissingValues = temp.filter(t => t === "M").length;

      let p = {};
      p["date"] = date;
      // const notForecast = isAfter(new Date(), new Date(date));
      // console.log(date, notForecast);

      if (countMissingValues > 5) {
        missingDays.push(date);
        p["botrytis"] = "N/A";
        p["anthracnose"] = "N/A";
      } else {
        let atRisk = [];
        if (!lwet.every(v => v === "M")) {
          // console.log("hasLwet");
          lwet.forEach((lw, i) => {
            p["pcpn"] = +pcpn[i];
            let o = {};
            if ((+lw === 0 && +pcpn[i] > 0) || +lw >= 1) {
              o["lw"] = +lw;
              o["pcpn"] = +pcpn[i];
              o["index"] = i;
              o["temp"] = +temp[i];
              atRisk.push(o);
            }
          });
        } else {
          rhum.forEach((rh, j) => {
            p["pcpn"] = +pcpn[j];
            let o = {};
            if ((+rh < 90 && +pcpn[j] > 0) || +rh >= 90) {
              o["lw"] = +lwet[j];
              o["pcpn"] = pcpn[j] === "M" ? "-" : +pcpn[j];
              o["rhum"] = rhAdjustment(+rh);
              o["index"] = j;
              o["temp"] = +temp[j];
              atRisk.push(o);
            }
          });
        }
        // console.log(atRisk);

        p["atRisk"] = atRisk;
        const dryHours = 4;
        let indeces = [];
        let arr = [];
        p.atRisk.forEach((obj, i) => {
          // console.log(p.date, obj, i);
          if (i === 0) {
            arr.push(obj);
          } else {
            if (obj.index - p.atRisk[i - 1].index <= dryHours) {
              arr.push(obj);
              if (i === p.atRisk.length - 1) indeces.push(arr);
            } else {
              indeces.push(arr);
              arr = [];
              arr.push(obj);
            }
          }
        });
        // console.log(arr);
        // console.log(indeces);
        p["indeces"] = indeces;

        let countLeafWetnesHoursAndAvgTemps = [];
        indeces.forEach(arr => {
          let p = {};
          p["w"] = arr.length;
          p["avgT"] =
            [...arr.map(o => o.temp)].reduce((acc, res) => acc + res, 0) /
            arr.length;
          p["pcpn"] =
            [...arr.map(o => o.pcpn)].reduce((acc, res) => acc + res, 0) /
            arr.length;
          countLeafWetnesHoursAndAvgTemps.push(p);
        });

        p["countLeafWetnesHoursAndAvgTemps"] = countLeafWetnesHoursAndAvgTemps;
        // console.log(p.date, countLeafWetnesHoursAndAvgTemps);
        let botrytis = 0;
        let anthracnose = 0;
        let obj = null;
        if (countLeafWetnesHoursAndAvgTemps.length > 1) {
          const wMax = Math.max(
            ...countLeafWetnesHoursAndAvgTemps.map(d => d.w)
          );
          obj = countLeafWetnesHoursAndAvgTemps.find(d => d.w === wMax);
          botrytis = botrytisIndex(obj.w, obj.avgT);
          anthracnose = anthracnoseIndex(obj.w, obj.avgT);
        }

        if (countLeafWetnesHoursAndAvgTemps.length === 1) {
          obj = countLeafWetnesHoursAndAvgTemps[0];
          botrytis = botrytisIndex(obj.w, obj.avgT);
          anthracnose = anthracnoseIndex(obj.w, obj.avgT);
        }

        p["obj"] = obj;
        p["botrytis"] = botrytis.toFixed(2);
        p["anthracnose"] = anthracnose.toFixed(2);
        p["pcpnAvg"] = [...arr.map(o => o.pcpn)].reduce(
          (acc, res) => acc + res,
          0
        );
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

    // console.log(this.modelData);
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
