import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Spinner from "react-spinkit";

// Images
import newaPic from "./images/newa_logo.jpg";
import acisPic from "./images/PoweredbyACIS_NRCC.jpg";

// Components
import ResultsHeader from "./ResultsHeader";
import ResultsTable from "./ResultsTable";

//  styled-components
import { Wrapper } from "../styles";
import { Centered, Images, Img } from "./styles";

@inject("store")
@observer
export default class Results extends Component {
  render() {
    if (this.props.store.app.isLoading) {
      return (
        <Centered>
          Loading
          {" "}
          <Spinner
            spinnerName="circle"
            noFadeIn
            style={{ marginLeft: "10px" }}
          />
        </Centered>
      );
    } else {
      return (
        <Wrapper>
          {/* HEADER */}
          <ResultsHeader />

          <br />

          {/* DATA */}
          <ResultsTable />

          {/* IMAGES */}
          <Images>
            <figure>
              <a href="http://newa.cornell.edu/">
                <Img src={newaPic} alt="newa" />
              </a>
            </figure>
            <figure>
              <a href="http://www.rcc-acis.org/">
                <Img src={acisPic} alt="acis" />
              </a>
            </figure>
          </Images>
        </Wrapper>
      );
    }
  }
}
