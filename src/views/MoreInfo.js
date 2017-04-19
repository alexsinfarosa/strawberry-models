import React, { Component } from "react";
import { inject, observer } from "mobx-react";

//  styled-components
import { Wrapper, Link } from "./styles";

@inject("store")
@observer
export default class MoreInfo extends Component {
  componentDidMount() {
    this.props.store.app.setIsSubmitted(false);
  }
  render() {
    return (
      <Wrapper>
        <h3>Helpful Information</h3>
        <br />
        <h5>Links</h5>
        <Link
          href="http://apsjournals.apsnet.org/doi/pdfplus/10.1094/PDIS-03-11-0181"
          target="_blank"
        >
          - MacKenzie, S. J., and N. A. Peres. 2012b. “Use of leaf wetness and temperature to time fungicide applications to control Botrytis fruit rot of strawberry in Florida.” Plant Dis. 96: 529–36.

        </Link>
        <br />
        <h5>Length Wetness Interval</h5>
        <p>
          Time accumulation (hour) and temperature measurements (˚C) during intermittent dry periods of less than 4 hours were included in the determintation of the length of a wetness interval.

        </p>
      </Wrapper>
    );
  }
}
