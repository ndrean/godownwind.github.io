import React, { useState, useEffect, Suspense, lazy } from "react";

import { Switch, Route } from "react-router-dom";

// lodash available within CRA ;
import sortBy from "lodash/sortBy";

import Loader from "../helpers/Loader";
import urlBack from "../helpers/urlBack";

import "../index.css";

const LazyLayout = lazy(() => import("./nav/Layout"));
const LazyMap = lazy(() => import("./map/MyMap"));
const LazyHome = lazy(() => import("./nav/Home"));
const LazyCardList = lazy(() => import("./CardList"));
const LazyRouteError = lazy(() => import("./nav/RouteError"));

const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function App() {
  const [users, setUsers] = useState("");
  const [events, setEvents] = useState("");
  const [user, setUser] = useState("");

  //const [loading, setLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState("");
  const [fbConfig, setFbConfig] = useState("");
  const [CloudName, setCloudName] = useState("");

  const handleAddUser = (currentUser) => {
    setUser(currentUser);
    if (!users.find((user) => user.email === currentUser.email)) {
      setUsers((prev) => [...prev, currentUser]);
    }
  };

  // fetch Facebook appID from backend
  useEffect(() => {
    fetch(urlBack + "/fbParams", options)
      .then((res) => res.json())
      .then((res) =>
        setFbConfig({
          appId: res.fb_id,
          cookie: true,
          xfbml: true,
          version: "v8.0",
          scope: "email",
        })
      )
      .catch((err) => console.log(err));
  }, []);

  // fetch Cloudinary credentials: cloudname
  useEffect(() => {
    fetch(urlBack + "/CLParams", options)
      .then((res) => res.json())
      .then((res) => {
        setCloudName(res.CLOUD_NAME);
      })
      .catch((err) => console.log(err));
  }, []);

  // fetch Events from db
  useEffect(() => {
    async function fetchData() {
      try {
        const reqEvents = new Request(urlBack + "/events", options);
        const query = await fetch(reqEvents).catch((err) => {
          console.log(err);
        });
        if (!query) {
          return;
        }
        let result = await query.json();
        return sortBy(result, ["itinary.date", "user.email"]);
      } catch (err) {
        setEvents(null);
        console.log(err);
      }
    }
    fetchData().then((res) => setEvents(res));
  }, [user, setEvents]);

  // fetch Users from db
  useEffect(() => {
    async function fetchData() {
      try {
        const reqUsers = new Request(urlBack + "/users", options);
        const query = await fetch(reqUsers).catch((err) => {
          console.log(err);
        });
        if (!query) {
          return;
        }
        return await query.json();
      } catch (err) {
        setUsers(null);
        console.log(err);
      }
    }
    fetchData().then((res) => {
      setUsers(res);
    });
  }, [user]);

  const handleToken = (value) => setJwtToken(value);

  const removeUser = () => setUser("");

  const handleRemoveEvent = (newevents) => {
    // event
    setEvents(sortBy(newevents, ["itinary.date", "user.email"]));
    // setEvents((prev) => prev.filter((ev) => ev.id !== event.id));
  };

  function handleUpdateEvents(newevents) {
    // before event
    setEvents(sortBy(newevents, ["itinary.date", "user.email"]));
    // setEvents((prev) => {
    //   const filteredEvents = prev.filter((evt) => evt.id !== event.id);
    //   const newEvents = [...filteredEvents, event];
    //   return sortBy(newEvents, ["itinary.date", "user.email"]);
    // });
  }

  function handleUpdateEvent(event) {
    setEvents((prev) => {
      const filteredEvents = prev.filter((evt) => evt.id !== event.id);
      const newEvents = [...filteredEvents, event];
      return sortBy(newEvents, ["itinary.date", "user.email"]);
    });
  }
  function handleAddEvent(newevents) {
    // before event
    setEvents(sortBy(newevents, ["itinary.date", "user.email"]));
    // setEvents((prev) => {
    //   const newEvents = [...prev, event];
    //   return sortBy(newEvents, ["itinary.date", "user.email"]);
    // });
  }

  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <LazyLayout
              onhandleToken={handleToken}
              onhandleAddUser={handleAddUser}
              onRemoveUser={removeUser}
              fbConfig={fbConfig}
              user={user}
              token={jwtToken}
            >
              <LazyHome />
            </LazyLayout>
          )}
        />
        <Route
          exact
          path="/cardlist"
          render={() => (
            <LazyLayout
              onhandleToken={handleToken}
              onhandleAddUser={handleAddUser}
              onRemoveUser={removeUser}
              fbConfig={fbConfig}
              token={jwtToken}
              user={user}
            >
              <LazyCardList
                users={users}
                token={jwtToken}
                user={user}
                events={events}
                onhandleAddEvent={handleAddEvent}
                onhandleRemoveEvent={handleRemoveEvent}
                onhandleUpdateEvents={handleUpdateEvents}
                onhandleUpdateEvent={handleUpdateEvent}
                cloudname={CloudName}
              />
            </LazyLayout>
          )}
        />
        <Route
          exact
          path="/map"
          render={() => (
            <LazyLayout
              onhandleToken={handleToken}
              onhandleAddUser={handleAddUser}
              onRemoveUser={removeUser}
              fbConfig={fbConfig}
              user={user}
              token={jwtToken}
            >
              <LazyMap
                user={user}
                token={jwtToken}
                events={events}
                onhandleAddEvent={handleAddEvent}
                onhandleUpdateEvents={handleUpdateEvents}
              />
            </LazyLayout>
          )}
        />
        <Route>
          <LazyLayout>
            <LazyRouteError />
          </LazyLayout>
        </Route>
      </Switch>
    </Suspense>
  );
}
