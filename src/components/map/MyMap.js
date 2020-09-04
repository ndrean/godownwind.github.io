import React, { useRef, useEffect, useState, Suspense, lazy } from "react";

import "leaflet/dist/leaflet.css";
import L, { marker } from "leaflet";
import * as esriGeocode from "esri-leaflet-geocoder";
//as esriGeocode

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { redIcon, greenIcon, blueIcon, kiteIcon } from "./Icon";

import { FaAlignJustify } from "react-icons/fa";

import { PositionContext } from "../nav/PositionContext";
import { UserContext } from "../UserContext";

import convertToGeojson from "./convertToGeojson";
import fetchModif from "../../helpers/fetchModif";

import urlBack from "../../helpers/urlBack";

const LazyGeoloc = lazy(() => import("../nav/Geoloc"));

const LazyMapForm = lazy(() => import("./MapForm"));

const html = `<p>
      <hr/>
      <label for="start">Start
      <input type="radio" name="place_type" value="start"/>
      </label>
      <label for="start">End
      <input type="radio" name="place_type" value="end"/>
      </label><br/>
      <hr/>
      <label for="start" style="font-weight:bold" >Remove
      <input type="radio" name="place_type" value="remove"/>
      </label>
    </p>`;

export default function MyMap(props) {
  console.log("_map_");
  // console.log("Map-props", props);
  const [gps] = React.useContext(PositionContext);

  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [date, setDate] = useState("");
  const [tripLength, setTripLength] = useState(0);

  const mapRef = useRef(null);
  const markersLayer = useRef(L.layerGroup([]));

  const [userData] = React.useContext(UserContext);
  // console.log("user", userData);

  let startEnd = [];

  let itinary = "";

  useEffect(() => {
    console.log("_draw map_");
    const center = gps.Lat ? [gps.Lat, gps.Lng] : [50, 0];
    mapRef.current = L.map("map", {
      center: center,
      zoom: 3,
      layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }),
      ],
    });
    L.control.scale().addTo(mapRef.current);
    return () => {
      mapRef.current.remove(markersLayer);
      console.log("removed");
    };
  }, [gps]);

  useEffect(() => {
    console.log("_ctrl_");
    const searchControl = new esriGeocode.geosearch({
      expanded: true,
      zoomToResult: true,
      position: "topright",
      placeholder: "Search City / address",
      title: "Search",
      collapseAfterResult: true,
      allowMultipleResults: true,
    }).addTo(mapRef.current);
    // https://github.com/Esri/esri-leaflet-geocoder

    searchControl.on("results", (e) => {
      if (!e.results) {
        alert("Not found");
        return;
      }
      const coords = e.latlng;
      const resultMarker = marker(coords, { icon: blueIcon }).addTo(
        markersLayer.current
      );
      const place = e.results[0].text;
      const content = L.DomUtil.create("div");
      content.innerHTML = `<p>${e.results[0].text}</p> ${html}`;
      const popup = resultMarker.bindPopup(content);
      popup.openPopup();
      if (popup) {
        handlePopupPlace(popup, place, coords, resultMarker);
      }
    });
  }, []);

  const reverseGeocode = React.useCallback((coords, mymarker) => {
    console.log("_reverse_");
    esriGeocode
      .geocodeService()
      .reverse()
      .latlng(coords)
      .run((error, result) => {
        if (error) {
          alert("not found");
          return mymarker.remove();
        }
        const {
          address: { CountryCode, ShortLabel, City },
        } = result;
        let place = [ShortLabel, City, CountryCode];
        if (Array.isArray(place)) {
          place = place.join(" ");
        }
        const content = L.DomUtil.create("div");
        content.innerHTML = `
          <p>${ShortLabel}</p>
          <p>${City}</p>
          <p>
          ${html}
          `;
        const popup = mymarker.bindPopup(content);
        popup.openPopup();
        return handlePopupPlace(popup, place, coords, mymarker);
      });
  }, []);

  // find address on click with reverseGeocode (ESRI)
  useEffect(() => {
    mapRef.current.on("click", (e) => {
      const mymarker = marker(e.latlng, { icon: blueIcon }).addTo(
        markersLayer.current
      );
      reverseGeocode(e.latlng, mymarker);
    });
  }, [reverseGeocode]);

  function handlePopupPlace(popup, place, coords, mymarker) {
    //on popup open, catch the state (start/end) of the point if any
    let preValue = "";
    popup.on("popupopen", () => {
      const typeRadio = document.body.querySelectorAll('input[type="radio"]');
      preValue = [...typeRadio].find((t) => t.checked === true);
      if (preValue) preValue = preValue.value;
    });
    // on popup close, update a point to start/end and set state
    popup.on("popupclose", (e) => {
      const getId = L.stamp(e.target); // === e.target._leaflet_id;
      const typeRadio = document.body.querySelectorAll('input[type="radio"]');
      let getValue = [...typeRadio].find((t) => t.checked === true);

      if (!getValue) {
        return markersLayer.current.removeLayer(mymarker);
      } else {
        getValue = getValue.value;
        if (getValue === "start") {
          if (preValue === "end") {
            setEndPoint("");
          }
          startEnd = { ...startEnd, start: coords };
          setStartPoint((prev) => ({
            ...prev,
            start: place,
            start_gps: coords,
            id: getId,
          }));
        } else if (getValue === "end") {
          if (preValue === "start") {
            setStartPoint("");
          }
          startEnd = { ...startEnd, end: coords };
          console.log(startEnd);
          setEndPoint((prev) => ({
            ...prev,
            end: place,
            end_gps: coords,
            id: getId,
          }));
        } else if (getValue === "remove") {
          markersLayer.current.removeLayer(mymarker);
          if (preValue === "start") {
            const { start, ...rest } = startEnd;
            startEnd = rest;
            setStartPoint("");
          } else if (preValue === "end") {
            const { end, ...rest } = startEnd;
            startEnd = rest;
            setEndPoint("");
          }
        }
        // calculate the distance between the 2 inputs
        const val = Object.values(startEnd);
        const keys = Object.keys(startEnd);
        if (keys.includes("start") && keys.includes("end")) {
          setTripLength(
            (L.latLng(val[0]).distanceTo(L.latLng(val[1])) / 1000).toFixed(0)
          );
        } else {
          setTripLength(0);
        }
        return;
      }
    });
  }

  const onEachFeature = React.useCallback((feature) => {
    if (feature.geometry.coordinates) {
      // Geojson is stored in [lng, lat] and Leaflet needs [lat, lng]....!
      const [lat0, long0] = feature.geometry.coordinates[0];
      const [lat1, long1] = feature.geometry.coordinates[1];
      const start = marker([long0, lat0], {
        icon: redIcon,
      }).addTo(markersLayer.current);
      const end = marker([long1, lat1], {
        icon: greenIcon,
      }).addTo(markersLayer.current);
      //L.polyline(feature.geometry.coordinates).addTo(markersLayer.current);
      const distance = Math.round(
        parseFloat(
          L.latLng(feature.geometry.coordinates[0]).distanceTo(
            L.latLng(feature.geometry.coordinates[1])
          ),
          0
        ) / 1000
      );
      const content = L.DomUtil.create("div");
      content.innerHTML = `
      <h6>${feature.properties.date} </h6>
      <p> From: ${feature.properties.start}</p>
      <p> To:  ${feature.properties.end} </p>
      <p> Distance: ${distance} km </p>`;
      start.bindPopup(content);
      end.bindPopup(content);
    }
  }, []);

  // display the events
  useEffect(() => {
    console.log("_Events_");

    const markersLayerRef = markersLayer.current;
    // fetch(urlBack + "/events")
    //   .then((res) => {
    //     if (!res) {
    //       return;
    //     } else {
    //       return res.json();
    //     }
    //   })
    Promise.resolve(props.events)
      .then((res) => {
        return convertToGeojson(res);
      })
      .then((data) => {
        L.geoJSON(data, {
          onEachFeature: onEachFeature,
        }).addTo(mapRef.current);

        markersLayerRef.addTo(mapRef.current);
      });

    return () => {
      console.log("clear");
      markersLayerRef.clearLayers();
    };
  }, [onEachFeature, props.events]);

  function handleSubmit(e) {
    e.preventDefault();
    // modif props.user => userData.email
    if (!userData.email) return window.alert("Please login");

    if (!startPoint || !endPoint)
      return window.alert("Please select two points");

    let distance = 0;
    if (startPoint.start_gps && endPoint.end_gps)
      distance = (
        L.latLng(startPoint.start_gps).distanceTo(L.latLng(endPoint.end_gps)) /
        1000
      ).toFixed(0);

    itinary = {
      date: date,
      start: startPoint.start,
      start_gps: [startPoint.start_gps.lat, startPoint.start_gps.lng],
      end: endPoint.end,
      end_gps: [endPoint.end_gps.lat, endPoint.end_gps.lng],
      distance: distance,
    };

    const formdata = new FormData();
    for (const key of ["date", "start", "end", "distance"]) {
      // console.log(key, itinary[key]);
      formdata.append(`event[itinary_attributes][${key}]`, itinary[key]);
    }
    // split in the frontend as Rails Postgres doesn't separate the array (instead of plistting in the backend)
    formdata.append(
      "event[itinary_attributes][start_gps][]",
      itinary.start_gps[0]
    );
    formdata.append(
      "event[itinary_attributes][start_gps][]",
      itinary.start_gps[1]
    );
    formdata.append("event[itinary_attributes][end_gps][]", itinary.end_gps[0]);
    formdata.append("event[itinary_attributes][end_gps][]", itinary.end_gps[1]);

    // !!!!! no headers "Content-type".. for formdata !!!!!
    fetchModif({
      method: "POST",
      index: "",
      body: formdata,
      token: props.user.access_token, //props.token,
    })
      .then((result) => {
        if (result) {
          props.onhandleUpdateEvents(result);
          window.alert(
            "Saved! If you want invite buddies, edit the new Event you created and select them. You can also add a picture and add comments."
          );
          setStartPoint("");
          setEndPoint("");
          setDate("");
          // mapRef.current.removeLayer(markersLayer.current);
        }
      })
      .catch((err) => console.log(err));
  }

  function handleDate(e) {
    setDate(e.target.value);
  }

  return (
    <Container fluid>
      <Suspense fallback={<span></span>}>
        <LazyGeoloc />
      </Suspense>

      <p>UserContext: {userData.email}</p>
      <Row>
        <div id="map"></div>
      </Row>
      <Suspense fallback={<span>Loading...</span>}>
        <LazyMapForm
          onhandleSubmit={handleSubmit}
          startPoint={startPoint}
          endPoint={endPoint}
          date={date}
          distance={tripLength}
          onhandleDate={handleDate}
        />
      </Suspense>
      <br />

      <p style={{ fontSize: "8px" }}>
        Click on the map or use the "Search City / address" box to define a
        point, and assign 'start' or 'end' or remove it. Once you defined the
        event, you can invite people by editing the event (the{" "}
        <FaAlignJustify size={10} /> menu ). You can delete the event there.
      </p>
    </Container>
  );
}
