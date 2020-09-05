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
  const [CLCreds, setCLCreds] = useState("");

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

  // fetch Cloudinary credentials
  useEffect(() => {
    fetch(urlBack + "/CLParams", options)
      .then((res) => res.json())
      .then((res) => {
        setCLCreds(res);
      });
  }, []);

  async function networkFirst(req, mycache) {
    const cache = await caches.open(mycache);
    try {
      const fresh = await fetch(req);
      cache.put(req, fresh.clone(req));
      return fresh;
    } catch (e) {
      const cachedResponse = await cache.match(req);
      return cachedResponse;
    }
  }

  // fetch Events from db
  useEffect(() => {
    async function fetchData() {
      //setLoading(true);
      // const query = window.addEventListener('fetch', e=> {
      //   const req = e.request;
      //   e.respondiWith(networkFirst(urlBack + "/events", "events-cache"))
      //   .then(res => setEvents(res))
      // })

      const req = new Request(urlBack + "/events", options);
      try {
        networkFirst(req, "events-cache")
          .then((res) => res.json())
          .then((res) => setEvents(res));
      } catch (err) {
        setEvents(null);
        throw new Error(err);
      }
    }
    fetchData().then((res) => setEvents(res));
  }, [user]);

  // fetch Users from db
  useEffect(() => {
    async function fetchData() {
      //setLoading(true);
      try {
        const responseUsers = await fetch(urlBack + "/users", options);
        const usersCache = await caches.open("users-cache");
        usersCache.put(urlBack + "/users", responseUsers.clone(responseUsers));
        return await responseUsers.json();
        // const responseUsers = await fetch(urlBack + "/users", options);
        // if (responseUsers.ok) {
        //   return await responseUsers.json();
        // }
      } catch (err) {
        setUsers(null);
        throw new Error(err);
      }
      // finally {
      //   setLoading(false);
      // }
    }
    fetchData().then((res) => {
      setUsers(res);
    });
  }, [user]);

  function handleToken(value) {
    setJwtToken(value);
  }

  function removeUser() {
    setUser("");
  }

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
