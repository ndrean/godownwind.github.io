import React, { useState } from "react";
import FacebookLogin from "react-facebook-login";
// /dist/facebook-login-render-props";
// import { FaFacebookF } from "react-icons/fa";
import { Button } from "react-bootstrap";
import urlBack from "../helpers/urlBack";
//import "./App.css";

export default function FBLogin(props) {
  console.log("__FB__");
  const [login, setLogin] = useState(false);
  const [data, setData] = useState({});

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
    if (queryAppToken.ok) {
      const { access_token } = await queryAppToken.json();
      if (access_token) {
        try {
          const getCurrentUser = await fetch(urlBack + "/profile", {
            headers: { authorization: "Bearer " + access_token },
          });
          const currentUser = await getCurrentUser.json();
          if (currentUser.confirm_email && !currentUser.confirm_token) {
            saveUser(access_token, currentUser);
          } else {
            window.alert("Check your mail to confirm password update");
          }
        } catch (err) {
          throw new Error(err);
        }
      } else {
        window.alert("Please confirm with your email");
      }
    } else {
      window.alert("Please confirm with your email");
    }
  };

  async function saveUser(jwt, user) {
    // localStorage.setItem("jwt", true);
    props.handleToken(jwt);
    // localStorage.setItem("user", user.email);
    alert(`Welcome ${user.email}`);
    props.handleAddUser(user);
  }

  const responseFacebook = (response) => {
    setData(response);
    if (response.accessToken) {
      setLogin(true);
      checkUser(response);
      // props.onSettingUser({
      //   email: response.email,
      //   fbId: response.id,
      //   fbAccessToke: response.accessToken,
      //   name: response.name,
      // });
    } else {
      setLogin(false);
    }
  };

  //style={{ width: "100%", justifyContent: "center" }}
  //{366589421180047}
  return (
    <>
      {!login && (
        <FacebookLogin
          appId={props.fbConfig.appId}
          autoLoad={false}
          fields="name,email, picture"
          scope="public_profile"
          //onClick={componentClicked}
          callback={responseFacebook}
          icon="fa-facebook"
          textButton="Login"
          size="small"
          // render={(renderProps) => (
          //   <button onClick={renderProps.onClick}>FB</button>
          // )}
        />
      )}
      {/* {login && <Image src={picture} roundedCircle />} */}

      {login && <Button>{data.name}</Button>}
    </>
  );
}
