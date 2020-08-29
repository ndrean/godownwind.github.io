import React, { Suspense } from "react";

//import FBLogin from "./FBLogin";
//import FormLogin from "./FormLogin";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faGlobeAmericas } from "@fortawesome/react-fontawesome";
import { FaGlobe } from "react-icons/fa";
const LazyFormLogin = React.lazy(() => import("./FormLogin"));

// fixed="top"
function MyNavBar(props) {
  // console.log("_NavBar_");
  return (
    <Navbar bg="primary" fixed="top">
      <Navbar.Brand>
        <Image
          loading="lazy"
          src={require("../assets/kitesurfing.svg")}
          alt="logo"
          width="40px"
          height="40px"
        />
      </Navbar.Brand>
      <Nav className="mr-auto">
        <Suspense fallback={<span>Loading...</span>}>
          <LazyFormLogin {...props} />
        </Suspense>
      </Nav>
      <Nav.Link href="#mapping">
        <Button variant="outline-light" type="submit" aria-label="show map">
          <FaGlobe size={22} />
        </Button>
      </Nav.Link>
      <Form inline></Form>
    </Navbar>
  );
}

export default React.memo(MyNavBar);
