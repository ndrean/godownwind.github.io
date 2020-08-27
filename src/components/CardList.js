import React, { useState } from "react";

import { Container, Row, Button, Spinner } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import CardItem from "./CardItem";
import Details from "./Details";

import urlBack from "../helpers/urlBack";
import EventModal from "./EventModal";
import EventForm from "./EventForm";
import fetchModif from "../helpers/fetchModif"; // returns data after PATCH or POST depending upon endpoint
import cloudName from "../helpers/cloudName"; // for Cloudinary

function CardList({ user, users, events, ...props }) {
  // events= [event:{user, itinary, participants, url, publicID, comment}]
  const [itinary, setItinary] = useState(""); // array [date, start, end, startGSP, endGPS]
  const [fileCL, setFileCL] = useState("");
  const [previewCL, setPreviewCL] = useState(""); // preview photo
  const [directCLurl, setDirectCLurl] = useState("");
  const [publicID, setPublicID] = useState(""); // id for Cloudinary
  const [changed, setChanged] = useState(false); // boolean if file selected
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState([]); // array of users
  const [indexEdit, setIndexEdit] = useState(null); // :id for PATCH
  const [show, setShow] = useState(false); // modal
  const [modalId, setModalId] = useState(null);
  const [comment, setComment] = useState("");
  const [checkUser, setCheckUser] = useState(false);

  // console.log("_render CardList_");

  // modal in a list: use index boolean
  const handleCloseDetail = () => {
    setShow(false);
    setModalId(null);
    setCheckUser(false);
  };

  const handleShowDetail = (index) => {
    setModalId(index);
  };

  const handleShow = () => setShow(true);

  const returnUnauthorized = () => {
    alert("Error");
    throw new Error("not authorized");
  };

  const handleClose = () => {
    setShow(false);
    setItinary("");
    setParticipants([]);
    setPreviewCL("");
    setPublicID("");
    setIndexEdit("");
    setChanged(false);
    setModalId(null);
    setComment("");
  };

  // remove row from table
  const handleRemove = async (e, event) => {
    e.preventDefault();
    if (!user) return window.alert("Please login");

    if (window.confirm("Confirm removal?")) {
      try {
        const query = await fetch(urlBack + "/events/" + event.id, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: "Bearer " + props.token,
          },
        }); // then new updated rows
        if (query.status !== 200) {
          return returnUnauthorized();
        }
        if (query.status === 200) {
          const response = await query.json();
          if (response.status === 401) {
            return returnUnauthorized();
          }
          props.onhandleRemoveEvent(event);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  async function handleFormSubmit(e) {
    // console.log("*submit*");
    e.preventDefault();
    if (!user) {
      // keep the input in state if user forgot to login
      setShow(false);
      return window.alert("Please login");
    }

    // 1st promise to append non-async data to the FormData
    function init(fd) {
      fd.append("event[comment]", comment);
      for (const key of ["date", "start", "end", "distance"]) {
        // console.log(key, itinary[key]);
        fd.append(`event[itinary_attributes][${key}]`, itinary[key]);
      }

      // the back-end needs the arrays to be split (otherwise, to be done by the backend...)
      // fd.append(
      //   "event[itinary_attributes][start_gps][][0]",
      //   itinary.start_gps[0]
      // );
      // fd.append(
      //   "event[itinary_attributes][start_gps][][1]",
      //   itinary.start_gps[1]
      // );
      // fd.append("event[itinary_attributes][end_gps][][0]", itinary.end_gps[0]);
      // fd.append("event[itinary_attributes][end_gps][][1]", itinary.end_gps[1]);

      if (participants.length > 0) {
        participants.forEach((member) => {
          for (const key in member) {
            fd.append(`event[participants][][${key}]`, member[key]);
          }
        });
      } else {
        fd.append("event[participants][]", []);
      }
      return Promise.resolve(fd);
    }

    // 2d promise: POST photo to CL, receives link back , and append FormData
    async function upLoadToCL(ffd) {
      // boolean: changed <=> new file input for CL
      if (changed) {
        const newfd = new FormData();
        newfd.append("file", fileCL);
        newfd.append("upload_preset", "ml_default");
        return fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
          method: "POST",
          body: newfd,
        })
          .then((res) => res.json())
          .then((resCL) => {
            setDirectCLurl(resCL.secure_url);
            setPublicID(resCL.public_id);
            ffd.append("event[directCLurl]", resCL.secure_url);
            ffd.append("event[publicID]", resCL.public_id);
            return ffd;
          })
          .catch((err) => {
            throw new Error(err);
          });
      } else {
        return Promise.resolve(ffd);
      }
    }
    // chaining of promises 1 & 2
    init(new FormData())
      .then((res) => upLoadToCL(res))
      .then((data) => {
        if (!indexEdit) {
          // no index <=> POST to '/events'
          fetchModif({
            // !!!!! no headers "Content-type".. for formdata !!!!!
            method: "POST",
            index: "",
            body: data,
            token: props.token,
          })
            .then((result) => {
              if (result) {
                const {
                  id,
                  comment,
                  participants,
                  publicID,
                  directCLurl,
                } = result;
                const newEvent = {
                  id,
                  comment,
                  participants,
                  publicID,
                  directCLurl,
                  itinary,
                  user,
                };
                props.onhandleAddEvent(newEvent);
              }
            })
            .catch((err) => console.log(err));
        } else if (indexEdit) {
          // index <=> PATCH to 'events/:id'
          fetchModif({
            method: "PATCH",
            index: indexEdit,
            body: data,
            token: props.token,
          })
            .then((result) => {
              if (result) {
                const {
                  id,
                  comment,
                  participants,
                  publicID,
                  directCLurl,
                } = result;
                const newEvent = {
                  id,
                  comment,
                  participants,
                  publicID,
                  directCLurl,
                  itinary,
                  user,
                };
                props.onhandleModifyEvent(newEvent);
              }
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
    handleClose(); // reset
  }

  // Edit event
  async function handleEdit(event) {
    // console.log("*edit*");
    setIndexEdit(event.id); // get /api/v1/events/:id
    const data = events.find((ev) => ev.id === event.id);
    setItinary({
      date: new Date(data.itinary.date).toISOString().slice(0, 10),
      start: data.itinary.start,
      end: data.itinary.end,
      //start_gps: data.itinary.start_gps || "",
      //end_gps: data.itinary.end_gps || "",
      //distance: data.itinary.distance || "",
    });
    setParticipants(data.participants || []);
    setComment(data.comment || "");

    if (event.publicID) {
      setPublicID(event.publicID);
    }
    handleShow(); // open modal-form
  }

  function handleSelectChange(selectedOptions) {
    // console.log("*select*");
    if (selectedOptions) {
      const kiters = [];
      selectedOptions.forEach((selOpt) => {
        const participant = participants.find((p) => p.email === selOpt.value);
        if (participant) {
          return kiters.push({
            email: selOpt.value,
            notif: participant.notif,
            ptoken: "",
          });
        } else {
          return kiters.push({
            email: selOpt.value,
            notif: false,
            ptoken: "",
          });
        }
      });
      setParticipants(kiters);
    } else setParticipants([]);
  }

  // update dynamically key/value for date, start, end of itinary
  function handleItinaryChange(e) {
    // console.log("*itinary*");
    setItinary({
      ...itinary,
      [e.target.name]: e.target.value,
    });
  }

  function handleCommentChange(e) {
    setComment(e.target.value);
  }

  async function handlePictureCL(e) {
    console.log("*pic*");
    if (e.target.files[0]) {
      setPreviewCL(URL.createObjectURL(e.target.files[0]));
      setChanged(true);
      setFileCL(e.target.files[0]);
    }
  }

  // send mail to ask to join an event
  // added index, modaldId to args
  async function handlePush(index, modalId, event) {
    console.log("*push*");
    const check = checkUserDemand(index, modalId, event);
    console.log(check);
    //setCheckUser(check);
    if (user && !check) {
      const demand = JSON.stringify({
        user: user, //,currentUser,
        owner: event.user.email,
        event: event,
      });
      await fetch(urlBack + "/pushDemand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + props.token,
        },
        body: demand,
      });
      window.alert("Mail sent");

      const pushedParticipant = { email: user.email, notif: false };
      const pushedEvent = {
        ...event,
        participants: [...participants, pushedParticipant],
      };
      props.onhandleModifyEvent(pushedEvent);
      handleCloseDetail();
    } else {
      window.alert("Not authorized");
      handleCloseDetail();
    }
  }

  function checkUserDemand(index, modalId, event) {
    if (index !== modalId) return null;
    if (user) {
      if (user.email === event.user.email) {
        return true;
      }
      if (!(event.participants === null)) {
        const checkDemander = event.participants.find(
          (participant) => participant.email === user.email
        );
        if (checkDemander) {
          return true;
        }
      }
    }
    return false;
  }

  return (
    <Container>
      <Row style={{ justifyContent: "center" }}>
        <Button
          variant="outline-dark"
          onClick={handleShow}
          style={{ fontSize: "30px" }}
        >
          {loading ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : (
            <p>
              <FontAwesomeIcon icon={faCheck} /> <span> Create an event</span>
            </p>
          )}
        </Button>

        {!loading && (
          <EventModal show={show && !loading} onhandleClose={handleClose}>
            {/* this child goes into the body of the modal */}
            <EventForm
              users={users}
              participants={participants}
              date={itinary.date}
              start={itinary.start}
              end={itinary.end}
              comment={comment}
              previewCL={previewCL}
              publicID={publicID}
              onFormSubmit={handleFormSubmit}
              onhandleItinaryChange={handleItinaryChange}
              onSelectChange={handleSelectChange}
              onhandlePictureCL={handlePictureCL}
              onhandleCommentChange={handleCommentChange}
            />
          </EventModal>
        )}
      </Row>

      <br />

      {events &&
        events.map((event, index) => {
          return (
            <CardItem
              key={event.id}
              event={event}
              onhandleRemove={(e) => handleRemove(e, event)}
              onhandleEdit={() => handleEdit(event)}
            >
              <Details
                event={event}
                index={index}
                modalId={modalId}
                onhandleShowDetail={() => handleShowDetail(index)}
                onhandlePush={() => handlePush(index, modalId, event)}
                onhandleCloseDetail={() => handleCloseDetail(index)}
                checkUser={checkUser}
                // onCheckUserDemand={() =>
                //   checkUserDemand(index, modalId, event)
                // }
              />
            </CardItem>
          );
        })}
    </Container>
  );
}

export default React.memo(CardList);
