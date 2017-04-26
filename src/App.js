import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { when } from "mobx";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// styled-components
import { Centered } from "./site/styles";

// components
import Home from "./site/Home";
// import Nav from "./Nav";

// Models
import Berry from "./models/Berry";
import Beet from "./models/Beet";
import Test from "./Test";

// api
import { fetchAllStations } from "./api";

@inject("store")
@observer
class App extends Component {
  constructor(props) {
    super(props);
    const protocol = this.props.store.app.protocol;
    when(
      // once...
      () => this.props.store.app.stations.length === 0,
      // ... then
      () =>
        fetchAllStations(protocol).then(allStations =>
          this.props.store.app.setStations(allStations)
        )
    );
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/berry" component={Berry} />
          <Route path="/beet" component={Beet} />
          <Route path="/test" component={Test} />
          <Route render={() => <Centered><h1>Not Found!</h1></Centered>} />
        </Switch>
      </Router>
    );
  }
}

export default App;
