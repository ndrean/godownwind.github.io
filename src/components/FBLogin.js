import React, { useState } from "react";
import FacebookLogin from "react-facebook-login";
import { Container, Card, Image, Button } from "react-bootstrap";
import urlBack from "../helpers/urlBack";
//import "./App.css";

function FBLogin(props) {
  console.log("__FB__");
  const [login, setLogin] = useState(false);
  const [data, setData] = useState({});
  const [picture, setPicture] = useState("");

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
    console.log(queryAppToken);
    if (queryAppToken.ok) {
      const { access_token } = await queryAppToken.json();
      if (access_token) {
        try {
          const getCurrentUser = await fetch(urlBack + "/profile", {
            headers: { authorization: "Bearer " + access_token },
          });
          const currentUser = await getCurrentUser.json();
          console.log(currentUser);
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
    localStorage.setItem("jwt", true);
    props.onhandleToken(jwt);
    localStorage.setItem("user", user.email);
    alert(`Welcome ${user.email}`);
    // take user up tp App
    props.handleAddUser(user);
  }

  const responseFacebook = (response) => {
    console.log(response);
    setData(response);
    setPicture(response.picture.data.url);
    if (response.accessToken) {
      setLogin(true);
      checkUser(response);
      props.onSettingUser({
        email: response.email,
        fbId: response.id,
        fbAccessToke: response.accessToken,
        name: response.name,
      });
    } else {
      setLogin(false);
    }
  };

  return (
    <Card style={{ width: "100%", justifyContent: "center" }}>
      <Card.Header>
        {!login && props.appID && (
          <FacebookLogin
            appId={props.appID} //"310921126753108"
            autoLoad={false}
            fields="name,email,picture"
            scope="public_profile"
            callback={responseFacebook}
            icon="fa-facebook"
            textButton={"Login"}
            size="small"
          />
        )}
        {login && <Card.Text>{data.name}</Card.Text>}
      </Card.Header>
    </Card>
  );
}

export default FBLogin;
