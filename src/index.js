import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";

// material-ui picker
import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";
import enLocale from "date-fns/locale/en-US";
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";

// Mobx
import { Provider } from "mobx-react";
import AppStore from "./stores/AppStore";
const fetcher = url => window.fetch(url).then(response => response.json());
const appStore = new AppStore(fetcher);

ReactDOM.render(
  <Provider appStore={appStore}>
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={enLocale}>
      <App />
    </MuiPickersUtilsProvider>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
