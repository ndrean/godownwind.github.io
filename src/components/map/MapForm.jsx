import React from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function MapForm(props) {
  return (
    <Form onSubmit={props.onhandleSubmit}>
      <Form.Group controlId="formPlaintextStart">
        <Form.Label>Starting point:</Form.Label>
        <Form.Control
          as="textarea"
          rows="2"
          aria-label="start point address"
          readOnly
          required
          value={props.startPoint ? props.startPoint.start : ""}
        />
      </Form.Group>

      <Form.Group controlId="formPlaintextEnd">
        <Form.Label>Ending point:</Form.Label>
        <Form.Control
          as="textarea"
          aria-label="end point addresss"
          rows="2"
          readOnly
          required
          value={props.endPoint ? props.endPoint.end : ""}
        />
      </Form.Group>

      <Form.Group controlId="formPlaintextDistance">
        <Form.Label>Calculated distance:</Form.Label>
        <Form.Control
          type="number"
          aria-label="calculated distance"
          value={props.distance}
          name="trip length"
          readOnly
        />
      </Form.Group>

      <Form.Control
        type="date"
        value={props.date || ""}
        name="date"
        aria-label="date event"
        required
        onChange={props.onhandleDate}
        isInvalid={!props.date}
      />

      <Form.Control.Feedback type="invalid">
        {!props.date}
      </Form.Control.Feedback>
      <br />
      <Form.Group style={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="primary"
          type="submit"
          size="lg"
          aria-label="submit event"
        >
          Submit
        </Button>
      </Form.Group>
    </Form>
  );
}
