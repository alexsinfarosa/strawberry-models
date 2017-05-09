import { observable, action } from "mobx";

export default class BerryStore {
  @observable strawberry = [];
  @action setStrawberry = d => this.strawberry.push(d);
}
