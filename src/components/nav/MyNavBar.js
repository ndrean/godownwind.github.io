import React, { Suspense } from "react";

//import history from "./history";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

import { Link } from "react-router-dom";

import { FaGlobe, FaAlignJustify } from "react-icons/fa";

import logo from "../../assets/kitesurfing.svg";

const LazyFormLogin = React.lazy(() => import("../FormLogin"));
const LazyRefresh = React.lazy(() => import("./Refresh"));

// fixed="top"
export default React.memo(function MyNavBar(props) {
  return (
    <Navbar bg="primary" fixed="top">
      <Nav className="mr-auto">
        <Button>
          <Link to="/">
            <Image
              loading="lazy"
              src={logo} //{require("../../assets/kitesurfing.svg")}
              alt="logo"
              aria-label="logo app"
              width="30px"
              height="30px"
            />
          </Link>
        </Button>

        <Suspense fallback={<span>Loading Login...</span>}>
          <LazyRefresh />
          <LazyFormLogin {...props} />
        </Suspense>
      </Nav>
      <Nav className="ml-auto">
        <Link to="/cardlist" style={{ padding: "5px" }}>
          <Button
            variant="outline-light"
            type="submit"
            aria-label="show list"
            // style={{ padding: "1px 2px" }}
          >
            <FaAlignJustify size={22} />
          </Button>
        </Link>
        <Link to="/Map" style={{ padding: "5px" }}>
          <Button
            variant="outline-light"
            type="submit"
            aria-label="show map"
            // style={{ padding: "1px 2px" }}
          >
            <FaGlobe size={22} />
          </Button>
        </Link>
      </Nav>
    </Navbar>
  );
});
