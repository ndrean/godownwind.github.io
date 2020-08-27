import React from "react";
import { Container, Row, Card, Button } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

function CardItem({ event, ...props }) {
  return (
    <Container>
      <Row>
        <Card border="primary" key={props.key}>
          <Card.Img
            variant="top"
            src={event.directCLurl || require("../assets/pointreyes.jpg")}
            alt="Card image"
            style={{ height: "270px", opacity: "0.6" }}
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
              >
                <FontAwesomeIcon icon={faTrash} size="2x" />
              </Button>

              <Button
                variant="outline-dark"
                onClick={props.onhandleEdit}
                style={{ fontSize: "15px", margin: "10px" }}
              >
                <FontAwesomeIcon icon={faEdit} size="2x" />
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
