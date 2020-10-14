import React from "react";
import SocialLogin from "react-social-login";
import Button from "react-bootstrap/Button";

function SocialButton({ children, triggerLogin, triggerLogout, ...props }) {
  return props.logged ? (
    <Button> onClick={triggerLogout}</Button>
  ) : (
    <Button onClick={triggerLogin} {...props}>
      {children}
    </Button>
  );
}

export default SocialLogin(SocialButton);
