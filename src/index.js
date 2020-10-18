import React from "react";
import ReactDOM from "react-dom";

// import { ActionCableProvider } from "react-actioncable-provider";

import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css"; // use cdn as already in cache

import App from "./components/App";

import "./index.css"; // important for Leaflet.js

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  // <ActionCableProvider url={"ws://localhost:8080/cable"}>
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  // </ActionCableProvider>,
  document.getElementById("root")
);

// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
