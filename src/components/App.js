import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

import CardList from "./CardList";
import urlBack from "../helpers/urlBack";
import MyNavBar from "./MyNavBar";

import "../index.css";

function App() {
  console.log("__App__");
  const [users, setUsers] = useState("");
  const [events, setEvents] = useState("");
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState("");
  const [fbConfig, setFbConfing] = useState("");

  const handleAddUser = (currentUser) => {
    setUser(currentUser);
    if (!users.find((user) => user.email === currentUser.email)) {
      setUsers((prev) => [...prev, currentUser]);
    }
  };

  // fetch Facebook appID from backend, in ENV variable
  useEffect(() => {
    fetch(urlBack + "/fbParams")
      .then((res) => res.json())
      .then((res) =>
        setFbConfing({
          appId: res.fb_id,
          cookie: true,
          xfbml: true,
          version: "v8.0",
          scope: "email",
        })
      );
  }, []);

  // fetch Events from db
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const responseEvents = await fetch(urlBack + "/events");
        if (responseEvents.ok) {
          return await responseEvents.json();
        }
      } catch (err) {
        setEvents(null);
        throw new Error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData().then((res) => setEvents(res));
  }, [user]);

  // fetch Users from db
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const responseUsers = await fetch(urlBack + "/users");
        if (responseUsers.ok) {
          return await responseUsers.json();
        }
      } catch (err) {
        setUsers(null);
        throw new Error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData().then((res) => {
      setUsers(res);
    });
  }, [user]);

  function handleToken(value) {
    setJwtToken(value);
  }

  function removeToken() {
    setJwtToken("");
    setUser("");
  }

  const settingUser = (obj) => {
    setUser(obj);
  };

  const handleRemoveEvent = (event) => {
    // console.log("*removeEvt*");
    setEvents((prev) => [...prev].filter((ev) => ev.id !== event.id));
  };

  function handleModifyEvent(event) {
    setEvents((prev) => {
      const newEvents = prev.filter((evt) => evt.id !== event.id);
      setEvents([...newEvents, event]);
    });
  }

  function handleAddEvent(event) {
    // console.log("*AddEvt*");
    setEvents((prev) => [...prev, event]);
  }

  return (
    <>
      <MyNavBar
        onhandleToken={handleToken}
        onhandleAddUser={handleAddUser}
        onRemoveToken={removeToken}
        onSettingUser={settingUser}
        fbConfig={fbConfig}
        user={user}
      />
      {loading ? <p>Loading...</p> : ""}
      {!loading ? <Container /> : ""}

      <CardList
        user={user}
        users={users}
        events={events}
        token={jwtToken}
        onhandleRemoveEvent={handleRemoveEvent}
        onhandleAddEvent={handleAddEvent}
        onhandleModifyEvent={handleModifyEvent}
      />
    </>
  );
}

export default App;
