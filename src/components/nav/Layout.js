import React from "react";
import Container from "react-bootstrap/Container";

import MyNavBar from "./MyNavBar";
import { PositionProvider } from "./PositionContext";
import { UserProvider } from "./../UserContext";

function Layout(props) {
  console.log("_Layout_");

  return (
    <Container>
      <PositionProvider>
        <UserProvider>
          <MyNavBar
            onhandleToken={props.onhandleToken}
            onhandleAddUser={props.onhandleAddUser}
            onRemoveToken={props.onRemoveToken}
            onSettingUser={props.onSettingUser}
            fbConfig={props.fbConfig}
            user={props.user}
            users={props.users}
            token={props.jwtToken}
          />
          {props.children}
        </UserProvider>
      </PositionProvider>
    </Container>
  );
}

export default React.memo(Layout);
