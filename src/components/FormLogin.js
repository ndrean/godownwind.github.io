import React from "react";
import ReactModalLogin from "react-modal-login";
import Button from "react-bootstrap/Button";

import urlBack from "../helpers/urlBack";

function LoginForm({ user, ...props }) {
  console.log("__form__");
  const [showModal, setShowModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [result, setResult] = React.useState("");
  const [avatar, setAvatar] = React.useState("");

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setError(null);
  }

  function onLogin() {
    console.log("_onLogin_");
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    if (!email || !password) {
      setError(true);
    } else {
      onLoginSuccess("formIn", { email, password });
    }
  }

  function onRegister() {
    console.log("_onRegister_");
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
    localStorage.setItem("jwt", true);
    props.onhandleToken(jwt);
    localStorage.setItem("user", user.email);
    //alert(`Welcome ${user.email}`);
    props.onhandleAddUser(user);
  }

  async function onLoginSuccess(method, response) {
    setResult({ method, response });
    const { email, password } = response;

    //1. using facebook
    if (method === "facebook") {
      // 1.1 call Facebook to get user's credentials
      const {
        authResponse: { accessToken },
      } = response;
      const query = await fetch(`https://graph.facebook.com/me?access_token=${accessToken}&
fields=id,name,email,picture.width(640).height(640)`);
      const {
        id,
        email,
        picture: {
          data: { url },
        },
      } = await query.json();
      setAvatar(url);

      // 1.2 call backend to FIND OR CREATE user and get API authentification Knock_token
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
        const { access_token } = await queryAppToken.json();
        try {
          const getCurrentUser = await fetch(urlBack + "/profile", {
            headers: { authorization: "Bearer " + access_token },
          });
          const currentUser = await getCurrentUser.json();
          if (currentUser.confirm_email && !currentUser.confirm_token) {
            saveUser(access_token, currentUser);
          } else {
            onLoginFail("Check your mail to confirm password update");
          }
        } catch (err) {
          throw new Error(err);
        }
      } else {
        onLoginFail("Please confirm with your email");
      }
    }
    // 2. using the form
    const authData = JSON.stringify({
      auth: { email, password },
    });

    // 2.1 form sign-up
    if (method === "formUp") {
      console.log("*up*");
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
            console.log("__confirmed__");
            saveUser(jwt, currentUser);
          } else {
            onLoginFail("Check your mails to confirm password update");
          }
        } else {
          console.log("__update__");
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
                console.log("updated in db, waiting for mail confirmation");
                const { jwt } = await getUserToken.json();

                // check in db if email_confirmed with the token
                const getCurrentUser = await fetch(urlBack + "/profile", {
                  headers: { authorization: "Bearer " + jwt },
                });
                const currentUser = await getCurrentUser.json();

                if (currentUser.confirm_mail && !currentUser.confirm_token) {
                  console.log("__updated__");
                  saveUser(jwt, currentUser);
                } else {
                  onLoginFail("Check your mail to confirm password update 2");
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
      console.log("*in*");
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
    setResult({ error: response });
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    props.onRemoveToken();
  }

  function startLoading() {
    setLoading(true);
  }

  function finishLoading() {
    setLoading(false);
  }

  function logOut() {
    props.onRemoveToken();
    setLoggedIn(false);
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setAvatar("");
    setResult("");
    window.alert("bye");
  }

  return (
    <>
      <Button
        onClick={openModal}
        hidden={loggedIn}
        style={{
          padding: "5px",
          margin: "auto",
          border: "none",
          backgroundColor: "#1666C5", //"#3b5998",
          color: "white",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        Connect
      </Button>

      {avatar && user ? (
        <Button
          onClick={() => logOut()}
          style={{
            padding: "5px",
            margin: "auto",
            border: "none",
            backgroundColor: "#1666C5",
            color: "white",
          }}
        >
          {user.email}
        </Button>
      ) : (
        localStorage.jwt &&
        result && (
          <Button
            onClick={() => logOut()}
            style={{
              padding: "5px",
              margin: "auto",
              border: "none",
              backgroundColor: "#1666C5",
              color: "white",
            }}
          >
            {result.response.email}
          </Button>
        )
      )}

      {props.fbConfig && (
        <ReactModalLogin
          visible={showModal}
          onCloseModal={closeModal}
          loading={loading}
          error={error}
          initialTab={"login"}
          loginError={{ label: "Couldn't sign in, please try again." }}
          registerError={{ label: "Couldn't sign up, please try again." }}
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
}

// export default LoginForm;
export default React.memo(LoginForm);
