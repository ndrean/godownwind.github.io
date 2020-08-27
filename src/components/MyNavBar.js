import React from "react";

//import FBLogin from "./FBLogin";
import FormLogin from "./FormLogin";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import "../index.css";

// fixed="top"
function MyNavBar(props) {
  // console.log("_NavBar_");
  return (
    <Navbar bg="primary" fixed="top">
      <Navbar.Brand>
        <Image
          src={require("../assets/kitesurfing.svg")}
          alt="logo"
          width="40px"
          height="40px"
        />
      </Navbar.Brand>
      <Nav className="mr-auto">{/* <FBLogin {...props} /> */}</Nav>
      <Nav className="mr-auto">
        <FormLogin {...props} />
      </Nav>
      <Nav.Link href="#mapping">
        <Button variant="outline-light" type="submit">
          <FontAwesomeIcon icon="globe-americas" size="2x" />
        </Button>
      </Nav.Link>
      <Form inline></Form>
    </Navbar>
  );
}

export default React.memo(MyNavBar);
