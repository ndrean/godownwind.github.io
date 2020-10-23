import React from "react";
import Container from "react-bootstrap/Container";

import MyNavBar from "./MyNavBar";
import { PositionProvider } from "./PositionContext";

function Layout(props) {
  console.log("_layout_");
  return (
    <Container>
      <PositionProvider>
        <MyNavBar {...props} />
        {props.children}
      </PositionProvider>
    </Container>
  );
}

export default React.memo(Layout);
