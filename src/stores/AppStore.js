import ParamsStore from "./ParamsStore";
import CurrentModel from "./CurrentModel";

export default class AppStore {
  constructor() {
    this.paramsStore = new ParamsStore();
    this.currentModel = new CurrentModel(this);
  }
}
