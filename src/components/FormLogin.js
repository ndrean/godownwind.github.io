import React, { useState } from "react";
import Button from "react-bootstrap/Button";

//import { UserContext } from "./UserContext";
import urlBack from "../helpers/urlBack";

import ReactModalLogin from "react-modal-login";

export default React.memo(function LoginForm({ user, ...props }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setError(null);
  }

  function onLogin() {
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    if (!email || !password) {
      setError(true);
    } else {
      onLoginSuccess("formIn", { email, password });
    }
  }

  function onRegister() {
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    if (!email || !password) {
      setError(true);
    } else {
      onLoginSuccess("formUp", { email, password });
    }
  }

  async function saveUser(jwt, user) {
    setLoggedIn(true);
    //localStorage.setItem("jwt", true);
    props.onhandleToken(jwt);
    //localStorage.setItem("user", user.email);
    alert(`Welcome ${user.email}`);
    props.onhandleAddUser(user);
    //setUserData({ email: user.email, jwt });
  }

  async function onLoginSuccess(method, response) {
    // console.log("__onLoginSuccess__");
    //setResult({ method, response });

    //1. if using facebook
    if (method === "facebook") {
      // console.log("__FB__");
      // 1.1 call Facebook to get user's credentials by response
      const {
        authResponse: { accessToken },
      } = response;
      const query = await fetch(`https://graph.facebook.com/me?access_token=${accessToken}&
fields=id,name,email,picture.width(640).height(640)`);
      const { id, email } = await query.json();

      // 1.2 call backend to FIND OR CREATE user and get Knock_token
      const queryAppToken = await fetch(urlBack + "/findCreateFbUser", {
        method: "POST",
        body: JSON.stringify({
          user: {
            email,
            uid: id,
          },
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (queryAppToken.ok) {
        const resp = await queryAppToken.json();
        // backend returns '201:created' only if created but mail not confirmed
        if (resp.status === 201) {
          onLoginFail("Check your mail to confirm password update");
        } else {
          // just created and mail sent
          const { access_token } = resp;
          try {
            const getCurrentUser = await fetch(urlBack + "/profile", {
              headers: { authorization: "Bearer " + access_token },
            });
            const currentUser = await getCurrentUser.json();
            if (currentUser.confirm_email && !currentUser.confirm_token) {
              saveUser(access_token, currentUser);
            } else {
              onLoginFail("Check your mail to confirm password update 2");
            }
          } catch (err) {
            throw new Error(err);
          }
        }
      }
    }
    // 2. using the form

    // 2.1 form sign-up
    if (method === "formUp") {
      const { email, password } = response;
      const authData = JSON.stringify({
        auth: { email, password },
      });
      // 1- check if user already exists with these credentials
      try {
        const getUserToken = await fetch(urlBack + "/getUserToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: authData,
        });
        if (getUserToken.ok) {
          const { jwt } = await getUserToken.json();
          const getCurrentUser = await fetch(urlBack + "/profile", {
            headers: { authorization: "Bearer " + jwt },
          });
          const currentUser = await getCurrentUser.json();
          if (currentUser.confirm_email && !currentUser.confirm_token) {
            // console.log("__confirmed__");
            saveUser(jwt, currentUser);
          } else {
            onLoginFail("Check your mails to confirm password update");
          }
        } else {
          // console.log("__update__");
          // credentials don't exist: update with received credentials via email
          const userData = JSON.stringify({
            user: { email: response.email, password: response.password },
          });
          const checkUser = await fetch(urlBack + "/createUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: userData,
          });

          if (checkUser.ok) {
            try {
              const getUserToken = await fetch(urlBack + "/getUserToken", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: authData,
              });

              if (getUserToken.ok) {
                // console.log("** updated in db, waiting for mail confirmation");
                const { jwt } = await getUserToken.json();
                // console.log(jwt);

                // check in db if email_confirmed with the token
                const getCurrentUser = await fetch(urlBack + "/profile", {
                  headers: { authorization: "Bearer " + jwt },
                });
                const currentUser = await getCurrentUser.json();

                if (currentUser.confirm_mail && !currentUser.confirm_token) {
                  // console.log("__updated__");
                  saveUser(jwt, currentUser);
                } else {
                  onLoginFail("Check your mail to confirm password update");
                }
              } else {
                onLoginFail("Not existing");
              }
            } catch (err) {
              throw new Error(err);
            }
          } else {
            onLoginFail("Bad input");
          }
        }
      } catch (err) {
        throw new Error(err);
      }
    }
    // 2.2 form sign-in
    if (method === "formIn") {
      // check user with the jwt token return from the backend
      const { email, password } = response;
      const authData = JSON.stringify({
        auth: { email, password },
      });
      try {
        const getUserToken = await fetch(urlBack + "/getUserToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: authData,
        });
        if (getUserToken.ok) {
          // need to have mail checked to enter
          const { jwt } = await getUserToken.json();
          const getCurrentUser = await fetch(urlBack + "/profile", {
            headers: { authorization: "Bearer " + jwt },
          });
          const currentUser = await getCurrentUser.json();
          if (currentUser.confirm_email && !currentUser.confirm_token) {
            saveUser(jwt, currentUser);
          } else {
            onLoginFail("Please confirm with your email");
          }
        } else {
          onLoginFail("Wrong credentials");
        }
      } catch (err) {
        throw new Error(err);
      }
    }
    closeModal();
    setLoading(false);
  }

  function onLoginFail(response) {
    alert(response);
    setError(response);
    setLoading(false);
    setLoggedIn(false);
    //({ error: response });
    props.onhandleToken("");
    props.onRemoveUser("");
  }

  function startLoading() {
    setLoading(true);
  }

  function finishLoading() {
    setLoading(false);
  }

  function logOut() {
    setLoggedIn(false);
    props.onhandleToken("");
    props.onRemoveUser("");
    //setResult("");
    window.alert("Bye");
  }

  return (
    <>
      <Button
        name="open"
        onClick={openModal}
        hidden={loggedIn}
        style={{
          padding: "10px",
          margin: "auto",
          border: "none",
          backgroundColor: "#1666C5", //"#3b5998",
          color: "white",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        Connect
      </Button>

      {user && (
        <Button
          name="login out"
          onClick={logOut}
          style={{
            padding: "1px",
            margin: "auto",
            width: "auto",
            border: "none",
            backgroundColor: "#1666C5",
            color: "white",
            fontSize: "10px",
          }}
        >
          {user.email}
        </Button>
      )}

      {props.fbConfig && (
        <ReactModalLogin
          visible={showModal}
          onCloseModal={closeModal}
          loading={loading}
          error={error}
          initialTab={"login"}
          loginError={{ label: "Couldn't sign in, please try again 1" }}
          registerError={{ label: "Couldn't sign up, please try again 2" }}
          startLoading={startLoading}
          finishLoading={finishLoading}
          providers={{
            facebook: {
              config: props.fbConfig,
              onLoginSuccess: onLoginSuccess,
              onLoginFail: onLoginFail,
              label: "Facebook login",
            },
          }}
          separator={{ label: "or" }}
          form={{
            onLogin: onLogin,
            onRegister: onRegister,
            loginBtn: {
              label: "Sign in",
            },
            registerBtn: {
              label: "Sign up",
            },
            loginInputs: [
              {
                containerClass: "RML-form-group",
                label: "Email",
                type: "email",
                inputClass: "RML-form-control",
                id: "email",
                name: "email",
                placeholder: "Email",
              },
              {
                containerClass: "RML-form-group",
                label: "Password",
                type: "password",
                inputClass: "RML-form-control",
                id: "password",
                name: "password",
                placeholder: "Password",
              },
            ],
            registerInputs: [
              {
                containerClass: "RML-form-group",
                label: "Email",
                type: "email",
                inputClass: "RML-form-control",
                id: "email",
                name: "email",
                placeholder: "Email",
              },
              {
                containerClass: "RML-form-group",
                label: "Password",
                type: "password",
                inputClass: "RML-form-control",
                id: "password",
                name: "password",
                placeholder: "Password",
              },
            ],
          }}
        />
      )}
    </>
  );
});
