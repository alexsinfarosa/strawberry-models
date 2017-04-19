import React, { Component } from "react";
import { inject, observer } from "mobx-react";

// styled-components
import { Select, Selector } from "./styles";

@inject("store")
@observer
class Disease extends Component {
  handleChange = e => {
    this.props.store.app.setSelectDisease(true);
    this.props.store.app.setDisease(e.target.value);
  };

  render() {
    return (
      <Selector>
        <label>Disease:</label>
        <Select
          name="disease"
          autoFocus
          value={this.props.store.app.disease}
          onChange={this.handleChange}
        >
          {this.props.store.app.selectDisease
            ? null
            : <option>Select Disease</option>}
          <option value="Strawberries">Strawberries</option>
          {/* <option value="Blueberries">Blueberries</option> */}
        </Select>
      </Selector>
    );
  }
}

export default Disease;
