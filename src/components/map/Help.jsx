import React from "react";

import Badge from "react-bootstrap/Badge";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import { FaQuestion } from "react-icons/fa";
import { FaAlignJustify } from "react-icons/fa";

const popover = (
  <Popover id="popover-basic">
    <Popover.Content>
      Click on the map to define a point. A popup will appear with the address
      found. Then assign 'start' or 'end' or remove. To save, click on the [x]
      upright. Once you defined your 2 points start and end, submit to save the
      event. Navigate to the list menu (
      <FaAlignJustify size={10} /> ) to delete or invite buddies.
    </Popover.Content>
  </Popover>
);

export default function Help() {
  return (
    <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
      <Badge variant="success">
        <FaQuestion />
      </Badge>
    </OverlayTrigger>
  );
}
