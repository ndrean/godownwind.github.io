import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";

import { PositionProvider } from "./nav/PositionContext";

import Loader from "../helpers/Loader";

import "../index.css";

const LazyMap = lazy(() => import("./map/MyMap"));
const LazyHome = lazy(() => import("./nav/Home"));
const LazyCardList = lazy(() => import("./CardList"));
const LazyRouteError = lazy(() => import("./nav/RouteError"));

export default React.memo(function Routes(props) {
  console.log("_Routes_");

  return (
    <PositionProvider>
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route exact path="/" render={() => <LazyHome />} />
          <Route
            exact
            path="/cardlist"
            render={() => (
              <LazyCardList
                users={props.users}
                jwtToken={props.jwtToken}
                user={props.user}
                events={props.events}
                onhandleAddEvent={props.handleAddEvent}
                onhandleRemoveEvent={props.handleRemoveEvent}
                onhandleUpdateEvents={props.handleUpdateEvents}
                onhandleUpdateEvent={props.handleUpdateEvent}
                cloudName="dd4eq9e3c"
              />
            )}
          />
          <Route
            exact
            path="/map"
            render={() => (
              <LazyMap
                user={props.user}
                jwtToken={props.jwtToken}
                events={props.events}
                onhandleAddEvent={props.handleAddEvent}
                onhandleUpdateEvents={props.handleUpdateEvents}
              />
            )}
          />
          <Route>
            <LazyRouteError />
          </Route>
        </Switch>
      </Suspense>
    </PositionProvider>
  );
});
