import React, { useState, useEffect, Suspense, lazy } from "react";

// import { Switch, Route } from "react-router-dom";

// lodash available within CRA ;
import sortBy from "lodash/sortBy";

import Loader from "../helpers/Loader";
import urlBack from "../helpers/urlBack";

import "../index.css";

const LazyMyNavBar = lazy(() => import("./nav/MyNavBar"));
const LazyRoutes = lazy(() => import("./Routes"));
// const LazyMap = lazy(() => import("./map/MyMap"));
// const LazyHome = lazy(() => import("./nav/Home"));
// const LazyCardList = lazy(() => import("./CardList"));
// const LazyRouteError = lazy(() => import("./nav/RouteError"));

const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function App() {
  console.log("_App_");
  const [users, setUsers] = useState("");
  const [events, setEvents] = useState("");
  const [user, setUser] = useState("");
  const [jwtToken, setJwtToken] = useState("");

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
        // using lodash to sort by date and then by user's email
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

  const handleAddUser = (currentUser) => {
    setUser(currentUser);
    if (!users.find((user) => user.email === currentUser.email)) {
      setUsers((prev) => [...prev, currentUser]);
    }
  };

  // const removeUser = () => setUser("");

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
    <>
      <Suspense fallback={<Loader />}>
        <LazyMyNavBar
          fbConfig="366589421180047"
          handleAddUser={handleAddUser}
          handleToken={handleToken}
        />
        <LazyRoutes
          // handleToken={handleToken}
          handleUpdateEvents={handleUpdateEvents}
          handleRemoveEvent={handleRemoveEvent}
          handleUpdateEvent={handleUpdateEvent}
          handleAddEvent={handleAddEvent}
          users={users}
          events={events}
          user={user}
          jwtToken={jwtToken}
          cloudName="dd4eq9e3c"
        />
      </Suspense>
    </>
  );
}
