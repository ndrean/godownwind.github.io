import React, { useState, useEffect, Suspense, lazy } from "react";

import { Switch, Route } from "react-router-dom";

import Loader from "../helpers/Loader";
import urlBack from "../helpers/urlBack";

import "../index.css";

const LazyLayout = lazy(() => import("./nav/Layout"));
const LazyMap = lazy(() => import("./map/MyMap"));
const LazyHome = lazy(() => import("./nav/Home"));
const LazyCardList = lazy(() => import("./CardList"));

const options = {
  method: "GET",
  headers: new Headers({
    "Content-Type": "application/json",
  }),
};

export default function App() {
  console.log("__App__");
  const [users, setUsers] = useState("");
  const [events, setEvents] = useState("");
  const [user, setUser] = useState("");

  //const [loading, setLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState("");
  const [fbConfig, setFbConfig] = useState("");
  //const [CLCreds, setCLCreds] = useState("");

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
      );
  }, []);

  /* fetch Cloudinary credentials
  useEffect(() => {
    fetch(urlBack + "/CLParams", options)
      .then((res) => res.json())
      .then((res) => {
        setCLCreds(res);
      });
  }, []);
  */

  // fetch Events from db
  useEffect(() => {
    async function fetchData() {
      try {
        const reqEvents = new Request(urlBack + "/events", options);
        const query = await fetch(reqEvents);
        return await query.json();
      } catch (err) {
        setEvents(null);
        console.log(err);
      }
    }
    fetchData().then((res) => setEvents(res));
  }, [user]);

  // fetch Users from db
  useEffect(() => {
    async function fetchData() {
      try {
        const reqUsers = new Request(urlBack + "/users", options);
        const query = await fetch(reqUsers);
        return await query.json();
      } catch (err) {
        setUsers(null);
        throw new Error(err);
      }
    }
    fetchData().then((res) => {
      setUsers(res);
    });
  }, [user]);

  const handleToken = (value) => setJwtToken(value);

  const removeUser = () => setUser("");

  const handleRemoveEvent = (event) => {
    setEvents((prev) => [...prev].filter((ev) => ev.id !== event.id));
  };

  function handleUpdateEvents(event) {
    setEvents((prev) => {
      const newEvents = prev.filter((evt) => evt.id !== event.id);
      setEvents([...newEvents, event]);
    });
  }

  function handleAddEvent(event) {
    setEvents((prev) => [...prev, event]);
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
              />
            </LazyLayout>
          )}
        />
        <Route
          path="/Map"
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
                // users={users}
                token={jwtToken}
                events={events}
                onhandleAddEvent={handleAddEvent}
                onhandleUpdateEvents={handleUpdateEvents}
              />
            </LazyLayout>
          )}
        />
      </Switch>
    </Suspense>
  );
}
