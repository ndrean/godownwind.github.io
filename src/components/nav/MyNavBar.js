import React, { Suspense } from "react";

import history from "./history";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

import { FaGlobe, FaAlignJustify } from "react-icons/fa";

const LazyFormLogin = React.lazy(() => import("../FormLogin"));

// fixed="top"
function MyNavBar(props) {
  console.log("_NavBar_");

  const handleClick = (e) => {
    e.preventDefault();
    // e.currentTarget.pathname === e.currentTarget.getAttribute('href)
    history.push({ pathname: e.currentTarget.getAttribute("href") });
  };

  return (
    <Navbar bg="primary" fixed="top">
      <Button>
        <Nav.Link href="/" onClick={(e) => handleClick(e)}>
          <Image
            loading="lazy"
            src={require("../../assets/kitesurfing.svg")}
            alt="logo"
            width="30px"
            height="30px"
          />
        </Nav.Link>
      </Button>

      <Suspense fallback={<span>Loading Login...</span>}>
        <LazyFormLogin {...props} />
      </Suspense>

      <Nav.Link href="/List" onClick={handleClick}>
        <Button variant="outline-light" type="submit" aria-label="show list">
          <FaAlignJustify size={22} />
        </Button>
      </Nav.Link>

      <Nav.Link href="/Map" onClick={handleClick}>
        <Button variant="outline-light" type="submit" aria-label="show map">
          <FaGlobe size={22} />
        </Button>
      </Nav.Link>
    </Navbar>
  );
}

export default React.memo(MyNavBar);
