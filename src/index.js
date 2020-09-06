import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import App from "./components/App";

import "./index.css"; // important for Leaflet.js

import * as serviceWorker from "./serviceWorker";

/*
import UniversalRouter from "universal-router";
import history from "./components/nav/history";
import routes from "./components/nav/routes";

const options = {
  resolveRoute(context, _) {
    if (typeof context.route.action === "function") {
      // console.log(context);
      return context.route.action(context);
    }
    return undefined;
  },
  errorHandler(error) {
    return error.status === 404 ? (
      <Suspense fallback={<span>Routing error</span>}>
        <LazyLayout>
          <LazyRouteError />
        </LazyLayout>
      </Suspense>
    ) : (
      "<h1>Oops! Something went wrong</h1>"
    );
  },
};

const router = new UniversalRouter(routes, options);

async function renderRoute() {
  const path = window.location.pathname;
  router
    .resolve({
      pathname: path
    })
    .then((component) => {
      ReactDOM.render(component, document.getElementById("root"));
    })
    .catch((error) => {
      options.errorHandler(error);
    });
}


// listening for the history changes to the current location
history.listen(renderRoute);
history.listen(({ location }) => console.log(`${location.pathname}`));

// initial Rendering for the initial location
renderRoute(history.location);
*/

ReactDOM.render(
  // <React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  // </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
