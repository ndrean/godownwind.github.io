import React, { useState } from "react";

import { FaFacebook } from "react-icons/fa";

import { Image } from "react-bootstrap";
import urlBack from "../helpers/urlBack";

const LazySocialButton = React.lazy(() => import("./SocialButton"));

export default React.memo(function FBLogin(props) {
  console.log("__FB__");
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState({});

  const handleSocialLogin = (user) => {
    const {
      profile: { id, email },
      // token: { accessToken },
    } = user;
    setUser(user);
    checkUser({ email, id });
  };

  const handleSocialLogout = () => {
    setUser({});
    setLogged(false);
  };

  const handleSocialLoginFailure = (err) => {
    console.error(err);
    setUser({});
    setLogged(false);
  };

  const checkUser = async (response) => {
    const fbUserData = {
      user: {
        email: response.email,
        uid: response.id,
      },
    };

    const queryAppToken = await fetch(urlBack + "/findCreateFbUser", {
      method: "POST",
      body: JSON.stringify(fbUserData),
      headers: { "Content-Type": "application/json" },
    });
    if (queryAppToken.status === 200) {
      return alert(
        "Thanks for registering. Check your mail, click on the link and reload"
      );
    } else if (queryAppToken.status === 201) {
      return alert("Please check mail and confirm with the link, then reload ");
    } else if (queryAppToken.status === 202) {
      const { access_token } = await queryAppToken.json();
      saveUser(access_token, fbUserData.user);
    }
  };

  async function saveUser(jwt, user) {
    props.handleToken(jwt);
    setLogged(true);
    alert(`Welcome ${user.email}`);
    props.handleAddUser(user);
  }

  return (
    <p style={{ marginTop: "15px" }}>
      {!logged && (
        <>
          <LazySocialButton
            provider="facebook"
            appId={props.fbConfig}
            onLoginSuccess={handleSocialLogin}
            onLoginFailure={handleSocialLoginFailure}
            onLogoutSuccess={handleSocialLogout}
            key="facebook"
            style={{
              backgroundColor: "#3b5998",
              color: "white",
              padding: "6px",
            }}
          >
            <FaFacebook /> Login
          </LazySocialButton>
        </>
      )}
      {logged && <Image src={user.profile.profilePicURL} roundedCircle fluid />}
    </p>
  );
});
