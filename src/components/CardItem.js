import React from "react";
import { Container, Row, Card, Button } from "react-bootstrap";

//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

import backimage from "../assets/beach2.webp";

function CardItem({ event, ...props }) {
  return (
    <Container>
      <Row>
        <Card border="primary" key={props.key}>
          <Card.Img
            variant="top"
            loading="lazy"
            src={event.directCLurl || backimage}
            alt="background image"
            style={{ height: "270px", width: "330px", opacity: "0.6" }}
          />
          <Card.ImgOverlay>
            <Card.Title>{event.itinary.date}</Card.Title>

            <Card.Text style={{ fontWeight: "bold", fontSize: "12px" }}>
              Organizer: {event.user.email} <br />
              From: {event.itinary.start} <br />
              To: {event.itinary.end} <br />
              Distance: {event.itinary.distance}
            </Card.Text>

            <Card.Footer>
              {props.children}

              <Button
                variant="outline-danger"
                onClick={props.onhandleRemove}
                style={{ fontSize: "15px", margin: "15px" }}
                aria-label="delete"
              >
                <FaTrashAlt size={28} />
              </Button>

              <Button
                variant="outline-dark"
                onClick={props.onhandleEdit}
                style={{ fontSize: "15px", margin: "10px" }}
                aria-label="edit"
              >
                <FaEdit size={28} />
              </Button>
            </Card.Footer>
          </Card.ImgOverlay>
        </Card>
      </Row>
      <br />
    </Container>
  );
}

export default React.memo(CardItem);
