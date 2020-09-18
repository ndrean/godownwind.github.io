import React, { useState } from "react";
import Button from "react-bootstrap/Button";

import { FormGroup, FormControl, ControlLabel } from "react-bootstrap/Form";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  function validateForm() {
    return email.length > 0 && pwd.length > 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
  }
  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>{" "}
          <FormControl
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>{" "}
          <FormControl
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            type="password"
          />
        </FormGroup>
        <Button block bsSize="large" disabled={!validateForm()} type="submit">
          {" "}
          Login
        </Button>
      </form>
    </div>
  );
}
