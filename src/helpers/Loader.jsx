import React from "react";

import Spinner from "react-bootstrap/Spinner";

export default function Loader() {
  // const style = {
  //   position: "fixed",
  //   top: "50%",
  //   left: "50%",
  //   transform: "translate(-50%, -50%)",
  // };
  const style = { textAlign: "center" };
  return (
    <div style={style}>
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
}
