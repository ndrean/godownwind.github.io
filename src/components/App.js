import React, { useState, useEffect, Suspense, lazy } from "react";
// lodash available within CRA ;
import sortBy from "lodash/sortBy";

import Loader from "../helpers/Loader";
import urlBack from "../helpers/urlBack";

import "../index.css";

const LazyMyNavBar = lazy(() => import("./nav/MyNavBar"));
const LazyRoutes = lazy(() => import("./Routes"));

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
        // using lodash:sortBy to sort by date and then by user's email
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

  ////// using Server Sent Events from backend: use EventSource API //////
  useEffect(() => {
    const stream = new EventSource(urlBack + "/sse/updateEvt");
    const action = (e) => {
      if (e.origin !== "https://godwd-api.herokuapp.com") return;
      const event = JSON.parse(e.data);
      console.log("** stream: updateEvents **", event.id);
      setEvents((prev) => {
        const filteredEvents = prev.filter((evt) => evt.id !== event.id);
        const newEvents = [...filteredEvents, event];
        return sortBy(newEvents, ["itinary.date", "user.email"]);
      });
    };
    stream.addEventListener("new", action);

    return () => {
      stream.removeEventListener("new", action);
      stream.close();
    };
  }, []);

  // useEffect(() => {
  //   const stream = new EventSource(urlBack + "/sse/redisDeleteEvent");
  //   stream.onmessage = function (e) {
  //     console.log("action: ", e.data);
  //   };
  // }, []);

  useEffect(() => {
    const stream = new EventSource(urlBack + "/sse/deleteEvent");
    const action = (e) => {
      if (e.origin !== "https://godwd-api.herokuapp.com") return;
      let delId = JSON.parse(e.data).id;
      if (delId) {
        let ids = [];
        delId = parseInt(delId, 10);
        events.map((evt) => ids.push(evt.id));
        if (!ids.includes(parseInt(delId, 10))) return;
        console.log("**action**: ", delId);
        setEvents(
          sortBy(
            events.filter((ev) => ev.id !== delId),
            ["itinary.date", "user.email"]
          )
        );
      }
    };
    stream.addEventListener("delEvt", action);

    return () => {
      stream.removeEventListener("delEvt", action);
      stream.close();
    };
  });

  ///////////////////////////////////////////////////////////////////////

  const handleToken = (value) => setJwtToken(value);

  const handleAddUser = (currentUser) => {
    setUser(currentUser);
    if (!users.find((user) => user.email === currentUser.email)) {
      setUsers((prev) => [...prev, currentUser]);
    }
  };

  const handleRemoveEvent = (id) => {
    console.log("** RemoveEvent **");
    // newevents & CardList => arg: reponse
    // setEvents(sortBy(newevents, ["itinary.date", "user.email"]));
    // event
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  function handleUpdateEvents(newevents) {
    // before event
    // setEvents(sortBy(newevents, ["itinary.date", "user.email"]));
    // setEvents((prev) => {
    //   const filteredEvents = prev.filter((evt) => evt.id !== event.id);
    //   const newEvents = [...filteredEvents, event];
    //   return sortBy(newEvents, ["itinary.date", "user.email"]);
    // });
  }

  function handleUpdateEvent(event) {
    console.log("** UpdateEvent **");
    setEvents((prev) => {
      const filteredEvents = prev.filter((evt) => evt.id !== event.id);
      const newEvents = [...filteredEvents, event];
      return sortBy(newEvents, ["itinary.date", "user.email"]);
    });
  }
  function handleAddEvent(event) {
    // after arg: newevents
    // setEvents(sortBy(newevents, ["itinary.date", "user.email"]));
    console.log("** AddEvent **");
    // before event
    setEvents((prev) => {
      const newEvents = [...prev, event];
      return sortBy(newEvents, ["itinary.date", "user.email"]);
    });
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
