import React, { useState, useEffect, Suspense } from "react";

//import CardList from "./CardList";
import urlBack from "../helpers/urlBack";
import MyNavBar from "./MyNavBar";

import "../index.css";

const LazyCardList = React.lazy(() => import("./CardList"));
const options = {
  method: "GET",
  headers: new Headers({
    "Content-Type": "application/json",
  }),
};

function App() {
  console.log("__App__");
  const [users, setUsers] = useState("");
  const [events, setEvents] = useState("");
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState("");
  const [fbConfig, setFbConfing] = useState("");
  const [CLCreds, setCLCreds] = useState("");

  const handleAddUser = (currentUser) => {
    setUser(currentUser);
    if (!users.find((user) => user.email === currentUser.email)) {
      setUsers((prev) => [...prev, currentUser]);
    }
  };

  // fetch Facebook appID from backend, in ENV variable
  useEffect((user) => {
    fetch(urlBack + "/fbParams", options)
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

  useEffect((user) => {
    fetch(urlBack + "/CLParams", options)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
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
      setLoading(true);
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
      {!loading && (
        <Suspense fallback={<span>Loading...</span>}>
          <LazyCardList
            user={user}
            users={users}
            events={events}
            token={jwtToken}
            onhandleRemoveEvent={handleRemoveEvent}
            onhandleAddEvent={handleAddEvent}
            onhandleModifyEvent={handleModifyEvent}
            clSecret={CLCreds}
          />
        </Suspense>
      )}
    </>
  );
}

export default App;
