import React from "react";
import Container from "react-bootstrap/Container";

import MyNavBar from "./MyNavBar";
import { PositionProvider } from "./PositionContext";
//import { UserProvider } from "./../UserContext";

function Layout(props) {
  console.log("_Layout_");

  return (
    <Container>
      <PositionProvider>
        {/* <UserProvider> */}
        <MyNavBar
          {...props}
          // onhandleToken={props.onhandleToken}
          // onhandleAddUser={props.onhandleAddUser}
          // onRemoveUser={props.onRemoveUser}
          // fbConfig={props.fbConfig}
          // user={props.user}
          // token={props.token}
        />
        {props.children}
        {/* </UserProvider> */}
      </PositionProvider>
    </Container>
  );
}

export default React.memo(Layout);
