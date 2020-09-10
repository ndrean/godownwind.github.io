import React from "react";
import Container from "react-bootstrap/Container";

import { FaGlobe, FaAlignJustify } from "react-icons/fa";

import { Link } from "react-router-dom";

import Geoloc from "./Geoloc";

const style = { fontSize: "12px" };

export default function Home() {
  return (
    <Container style={style}>
      <h5>How does this work?</h5>
      <p>
        This app lets anyone see the downwind events. You need to be logged in
        (Facebook or email) if you want to create/modify your event. You can
        then manage an event using:
      </p>
      <ul>
        <li>
          the map{" "}
          <span>
            <Link to="/Map">
              <FaGlobe size={16} />
            </Link>
          </span>{" "}
          where you visualize, create and geolocate an event with a start and
          end marker. Only the events created this way will be displayed.
        </li>
        <li>
          a list{" "}
          <span>
            <Link to="/cardlist">
              <FaAlignJustify size={16} />
            </Link>
          </span>{" "}
          where you can also create an event but with no geolocation. In the
          list, you can invite buddies, set a picture and ask to participate.
        </li>
      </ul>{" "}
      <p>You may want to enable geolocation to center the map </p>
      <Geoloc />
      <br />
      <p>
        About the map:{" "}
        <span>
          <Link to="/Map">
            <FaGlobe size={16} />
          </Link>
        </span>
        . An event has a start point and an end point. You click on the map and
        assign 'start' on 'end' in the popup. To save, close the popup (x). You
        can also remove the marker. You can also use the search-box.
      </p>
      <p>Only the events created with the map will be geolocated.</p>
      <p>
        About the list:{" "}
        <span>
          <Link to="/cardlist">
            <FaAlignJustify size={16} />
          </Link>
        </span>
        . You can delete your event there. You can select buddies and they will
        receive a mail. You can ask to participate to an event. When you click,
        the event owner will receive a mail. In this mail, the owner can click
        on the link to confirm your participation.
      </p>
    </Container>
  );
}
