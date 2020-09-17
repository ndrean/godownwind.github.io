// import React, { Suspense, lazy } from "react";

// // import App from "../../index.js";
// // const LazyMyNavBar = React.lazy(() => import("./MyNavBar"));
// const LazyLayout = lazy(() => import("./Layout"));
// const LazyHome = lazy(() => import("./Home"));
// const LazyCardList = lazy(() => import("../CardList"));
// const LazyMap = lazy(() => import("../map/MyMap"));

// export default [
//   {
//     path: "/",
//     name: "home",
//     async action({ props }) {
//       console.log("action-home", props);
//       return (
//         <>
//           <Suspense fallback={<span>Loading</span>}>
//             <LazyLayout>
//               <LazyHome val={props.nb} bool={props.bool} />
//             </LazyLayout>
//           </Suspense>
//         </>
//       );
//     },
//   },
//   {
//     path: "/List",
//     name: "events list",
//     async action() {
//       return (
//         <Suspense fallback={<span>Loading</span>}>
//           <LazyLayout>
//             <LazyCardList />
//           </LazyLayout>
//         </Suspense>
//       );
//     },
//   },
//   {
//     path: "/Map",
//     name: "map",
//     async action(props) {
//       return (
//         <Suspense fallback={<span>Loading</span>}>
//           <LazyLayout>
//             <LazyMap {...props} />
//           </LazyLayout>
//         </Suspense>
//       );
//     },
//   },
// ];
