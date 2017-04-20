import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { when } from "mobx";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// antd-components
// import { Row, Col } from "antd";

// styled-components
import { Page, Main } from "./styles";

// components
import Home from "./Home";
import Nav from "./Nav";

// Models
import Berry from "./Berry";
import Onion from "./Onion";

// import Subject from "./components/Subject";
// import State from "./components/State";
// import Station from "./components/Station";
// import DatePicker from "./components/DatePicker";
// import Button from "./components/Button";

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
      <div>
        <Router>
          <Page>
            <Nav />
            <Main>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/berry" component={Berry} />
                <Route path="/onion" component={Onion} />
                <Route render={() => <h1>Not Found</h1>} />
              </Switch>
            </Main>
          </Page>
        </Router>
      </div>
    );
  }
}

export default App;
