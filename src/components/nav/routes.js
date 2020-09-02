import React, { Suspense } from "react";

// import App from "../../index.js";
// const LazyMyNavBar = React.lazy(() => import("./MyNavBar"));
const LazyLayout = React.lazy(() => import("./Layout"));
const LazyHome = React.lazy(() => import("./Home"));
const LazyCardList = React.lazy(() => import("../CardList"));
const LazyMap = React.lazy(() => import("../map/MyMap"));

export default [
  {
    path: "/",
    name: "home",
    async action({ props }) {
      return (
        <>
          <Suspense fallback={<span>Loading</span>}>
            <LazyLayout>
              <LazyHome val={props.nb} bool={props.bool} />
            </LazyLayout>
          </Suspense>
        </>
      );
    },
  },
  {
    path: "/List",
    name: "events list",
    async action({ props }) {
      return (
        <Suspense fallback={<span>Loading</span>}>
          <LazyLayout>
            <LazyCardList />
          </LazyLayout>
        </Suspense>
      );
    },
  },
  {
    path: "/Map",
    name: "map",
    async action({ props }) {
      return (
        <Suspense fallback={<span>Loading</span>}>
          <LazyLayout>
            <LazyMap warning={props} />
          </LazyLayout>
        </Suspense>
      );
    },
  },
];
