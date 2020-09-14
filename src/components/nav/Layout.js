import React from "react";
import Container from "react-bootstrap/Container";

import MyNavBar from "./MyNavBar";
import { PositionProvider } from "./PositionContext";
//import { UserProvider } from "./../UserContext";

function Layout(props) {
  return (
    <Container>
      <PositionProvider>
        {/* <UserProvider> */}
        <MyNavBar {...props} />
        {props.children}
        {/* </UserProvider> */}
      </PositionProvider>
    </Container>
  );
}

export default React.memo(Layout);
