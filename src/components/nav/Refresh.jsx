import React from "react";
import Button from "react-bootstrap/Button";
import { BsArrowRepeat } from "react-icons/bs";

export default function Refresh() {
  const refreshPage = () => window.location.reload(false);
  return (
    <Button onClick={refreshPage} aria-label="refresh page">
      <BsArrowRepeat size={16} />
    </Button>
  );
}
