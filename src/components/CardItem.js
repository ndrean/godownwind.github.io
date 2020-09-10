import React from "react";

// import { Image as CLImage } from "cloudinary-react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { FaEdit, FaTrashAlt } from "react-icons/fa";

import backimage from "../assets/beach2.webp";

function CardItem({ event, ...props }) {
  return (
    <Container>
      <Row>
        <Card
          border="primary"
          style={{ boxShadow: "1px 1px 1px rgba(0,0,0,0.2)" }}
        >
          {/* <CLImage cloudname={props.cloudName} publicID={props.publicID} width="330" height="270" crop="scale" alt="background image" loading="lazy"/> */}
          <Card.Img
            variant="top"
            loading="lazy"
            src={event.directCLurl || backimage}
            alt="background image"
            style={{ height: "270px", width: "300px", opacity: "0.6" }}
          />
          <Card.ImgOverlay>
            <Card.Title>{event.itinary.date}</Card.Title>

            <Card.Text style={{ fontWeight: "bold", fontSize: "12px" }}>
              Organizer: {event.user.email} <br />
              From: {event.itinary.start} <br />
              To: {event.itinary.end} <br />
              Distance: {parseFloat(event.itinary.distance).toFixed(0)}
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
