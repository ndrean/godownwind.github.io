import React, { Suspense } from "react";

import history from "./history";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

import { Link } from "react-router-dom";

import { FaGlobe, FaAlignJustify } from "react-icons/fa";

import logo from "../../assets/kitesurfing.svg";

const LazyFormLogin = React.lazy(() => import("../FormLogin"));

// fixed="top"
export default React.memo(function MyNavBar(props) {
  console.log("_NavBar_");

  // const handleClick = (e) => {
  //   e.preventDefault();
  //   // e.currentTarget.pathname === e.currentTarget.getAttribute('href)
  //   history.push({ pathname: e.currentTarget.getAttribute("href") });
  // };

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
          {/* <Nav.Link href="/" onClick={(e) => handleClick(e)}></Nav.Link> */}
        </Button>

        <Suspense fallback={<span>Loading Login...</span>}>
          <LazyFormLogin {...props} />
        </Suspense>
      </Nav>
      <Nav className="ml-auto">
        <Link to="/cardlist">
          <Button variant="outline-light" type="submit" aria-label="show list">
            <FaAlignJustify size={22} />
          </Button>
        </Link>

        <Link to="/Map">
          <Button variant="outline-light" type="submit" aria-label="show map">
            <FaGlobe size={22} />
          </Button>
        </Link>
      </Nav>
    </Navbar>
  );
});
