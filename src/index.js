import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import App from "./components/App";

import "./index.css"; // important for Leaflet.js

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  // <React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  // </React.StrictMode>,
  document.getElementById("root")
);

// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
