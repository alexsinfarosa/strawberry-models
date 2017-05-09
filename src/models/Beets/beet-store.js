import { observable, action } from "mobx";

export default class BeetStore {
  @observable cercosporaBeticola = [];
  @action setCercosporaBeticola = d => this.cercosporaBeticola.push(d);

  @observable barColor;
  @action setBarColor = d => (this.barColor = d);
}
