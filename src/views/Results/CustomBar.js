import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { observable, action } from "mobx";

@inject("store")
@observer
export default class CustomBar extends Component {
  @observable hover;
  @action setHover = d => this.hover = d;

  setBarColor = e => {
    const fill = e.target.getAttribute("fill");
    if (fill === "#81C784") {
      this.setHover("#4CAF50");
    } else if (fill === "#FDD835") {
      this.setHover("#FFEB3B");
    } else {
      this.setHover("#f44336");
    }
    this.props.store.app.setBarColor(fill);
  };

  setDefaultColor = e => {
    this.setHover(null);
  };

  render() {
    const { x, y, height, width, a2Day } = this.props;
    // console.log(this.props);
    if (a2Day >= 0 && a2Day <= 3) {
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={this.hover ? this.hover : "#81C784"}
          onMouseOver={this.setBarColor}
          onMouseOut={this.setDefaultColor}
        />
      );
    } else if (a2Day >= 4 && a2Day <= 6) {
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={this.hover ? this.hover : "#FDD835"}
          onMouseOver={this.setBarColor}
          onMouseOut={this.setDefaultColor}
        />
      );
    }
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={this.hover ? this.hover : "#e57373"}
        onMouseOver={this.setBarColor}
        onMouseOut={this.setDefaultColor}
      />
    );
  }
}
