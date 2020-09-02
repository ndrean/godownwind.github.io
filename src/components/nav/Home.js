import React from "react";
import Container from "react-bootstrap/Container";

import Geoloc from "./Geoloc";

export default function Home(props) {
  return (
    <Container>
      <p>
        To find, create or participate to a downwind, please login or create an
        account.
      </p>
      <br />
      {props.bool && <p>Props 'val' is: {JSON.parse(props.val)}</p>}
      <p>
        You may also want to enable geolocalisation to position yourself on the
        map.
      </p>
      <Geoloc />
    </Container>
  );
}
