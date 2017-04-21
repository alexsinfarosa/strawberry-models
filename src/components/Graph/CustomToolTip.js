import React, { Component } from "react";

export default class CustomToolTip extends Component {
  render() {
    const { active, payload, label } = this.props;
    if (active) {
      return (
        <div>
          <p>
            {`${format(label, "MMMM Do")} : ${payload[0].value}`}
          </p>
          <p>{this.getIntroOfPage(label)}</p>
          <p>Anything you want can be displayed here.</p>
        </div>
      );
    }

    return null;
  }
}
