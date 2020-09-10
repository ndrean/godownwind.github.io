import React, {
  useRef,
  useEffect,
  useState,
  Suspense,
  lazy,
  useCallback,
} from "react";

import "leaflet/dist/leaflet.css";
import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css";
import L from "leaflet";
import * as esriGeocode from "esri-leaflet-geocoder";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { redIcon, greenIcon, blueIcon } from "./Icon";

import { PositionContext } from "../nav/PositionContext";

import { html } from "./popupHtmlForm";
import convertToGeojson from "./convertToGeojson";
import fetchModif from "../../helpers/fetchModif";

const LazyMapForm = lazy(() => import("./MapForm"));
const LazyHelp = lazy(() => import("./Help"));

export default function MyMap(props) {
  const [gps] = React.useContext(PositionContext);
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [date, setDate] = useState("");
  const [tripLength, setTripLength] = useState(0);

  const mapRef = useRef(null);
  const markersLayer = useRef(L.layerGroup([]));
  const searchCtrlRef = useRef();

  React.useLayoutEffect(() => {
    console.log("_draw_");
    const center = gps.Lat ? [gps.Lat, gps.Lng] : [45, 1];
    mapRef.current = L.map("map", {
      center: center,
      zoom: 4,
      layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }),
      ],
    });

    L.control.scale().addTo(mapRef.current);

    //github.com/Esri/esri-leaflet-geocoder
    searchCtrlRef.current = esriGeocode
      .geosearch({
        expanded: true,
        zoomToResult: true,
        position: "topright",
        placeholder: "Search City / address",
        title: "Search",
        collapseAfterResult: true,
        allowMultipleResults: true,
      })
      .addTo(mapRef.current);

    return () => {
      mapRef.current.remove();
      console.log("removed");
    };
  }, [gps]);

  let startEndIds = {};
  let startEndCoords = [];

  const actionMarker = React.useCallback(
    ({ searchMarker, getId, getValue, onOpenValue, place, coords }) => {
      //console.log(startEndIds, startEndCoords);
      switch (getValue) {
        case "start":
          startEndIds.start = L.stamp(searchMarker);
          if (onOpenValue === "end" && startEndIds.end === getId) {
            setEndPoint("");
            startEndIds.end = null;
            startEndCoords.end = null;
          }
          startEndCoords.start = coords;
          setStartPoint((prev) => ({
            ...prev,
            start: place,
            start_gps: coords,
            id: getId,
          }));
          break;

        case "end":
          startEndIds.end = L.stamp(searchMarker);
          if (onOpenValue === "start" && startEndIds.start === getId) {
            setStartPoint("");
            startEndIds.start = null;
            startEndCoords.start = null;
          }
          startEndCoords.end = coords;
          setEndPoint((prev) => ({
            ...prev,
            end: place,
            end_gps: coords,
            id: getId,
          }));
          break;

        case "remove":
          if (onOpenValue === "start") {
            //console.log("rm start");
            startEndCoords.start = null;
            startEndIds.start = null;
            setStartPoint(null);
          } else if (onOpenValue === "end") {
            //console.log("rm end");
            startEndCoords.end = null;
            startEndIds.end = null;
            setEndPoint(null);
          }
          return markersLayer.current.removeLayer(searchMarker);

        default:
          console.log("default");
          return markersLayer.current.removeLayer(searchMarker);
      }
      console.log(startEndIds);
      const keys = Object.keys(startEndCoords);
      const values = Object.values(startEndCoords);
      if (
        keys.includes("start") &&
        keys.includes("end") &&
        values[0] &&
        values[1]
      ) {
        setTripLength(
          (startEndCoords.start.distanceTo(startEndCoords.end) / 1000).toFixed(
            0
          )
        );
      } else {
        setTripLength(0);
      }
      return;
    },
    []
  );

  const handlePopup = React.useCallback(
    ({ popup, place, coords, searchMarker }) => {
      console.log("handle");
      let onOpenValue = "";
      //on popup open, catch the state (start/end) of the point if any
      popup.on("popupopen", () => {
        const typeRadio = document.body.querySelectorAll('input[type="radio"]');
        onOpenValue = [...typeRadio].find((t) => t.checked === true);
        if (onOpenValue) onOpenValue = onOpenValue.value;
      });

      // on popup close, update a point to start/end and set state
      popup.on("popupclose", (e) => {
        const getId = L.stamp(e.target); // === e.target._leaflet_id;
        const typeRadio = document.body.querySelectorAll('input[type="radio"]');
        let getValue = [...typeRadio].find((t) => t.checked === true);
        if (getValue !== undefined) getValue = getValue.value;
        actionMarker({
          searchMarker,
          getId,
          getValue,
          onOpenValue,
          coords,
          place,
        });
      });
    },
    [actionMarker]
  );

  useEffect(() => {
    searchCtrlRef.current.on("results", (e) => {
      if (!e.results) {
        alert("Not found");
        return;
      }
      const coords = e.latlng;

      const resultMarker = L.marker(coords, { icon: blueIcon }).addTo(
        markersLayer.current
      );
      markersLayer.current.addTo(mapRef.current);
      const place = e.results[0].text;
      const content = L.DomUtil.create("div");
      content.innerHTML = `<p>${e.results[0].text}</p> ${html}`;
      const popup = resultMarker.bindPopup(content);
      popup.openPopup();
      if (popup) {
        console.log("pop");
        handlePopup({ popup, place, coords, searchMarker: resultMarker });
      }
    });
  }, [handlePopup]);

  const reverseGeocode = useCallback(
    function (coords, searchMarker) {
      esriGeocode
        .geocodeService()
        .reverse()
        .latlng(coords)
        .run((error, result) => {
          if (error) {
            alert("not found");
            return markersLayer.current.removeLayer(searchMarker);
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

          const popup = searchMarker.bindPopup(content);
          popup.openPopup();
          handlePopup({ popup, place, coords, searchMarker });
        });
    },
    [handlePopup]
  );

  useEffect(() => {
    mapRef.current.on("click", (e) => {
      const searchMarker = L.marker(e.latlng, { icon: blueIcon }).addTo(
        markersLayer.current
      );
      markersLayer.current.addTo(mapRef.current);
      reverseGeocode(e.latlng, searchMarker);
    });
  }, [reverseGeocode]);

  // find address on click with reverseGeocode (ESRI)

  const invertArray = ([a, b]) => [b, a];

  const onEachFeature = useCallback((feature) => {
    if (feature.geometry.coordinates) {
      // !! Geojson LinString is [lng, lat] and Leaflet needs [lat, lng] !!
      const startMarker = L.marker(
        invertArray(feature.geometry.coordinates[0]),
        {
          icon: redIcon,
        }
      ).addTo(mapRef.current);
      const endMarker = L.marker(invertArray(feature.geometry.coordinates[1]), {
        icon: greenIcon,
      }).addTo(mapRef.current);
      const content = L.DomUtil.create("div");
      content.innerHTML = `
        <h6>${feature.properties.date} </h6>
        <p> From: ${feature.properties.start}</p>
        <p> To:  ${feature.properties.end} </p>
        <p> Distance: ${parseFloat(feature.properties.distance).toFixed(
          0
        )} km </p>
        `;
      startMarker.bindPopup(content);
      endMarker.bindPopup(content);
    }
  }, []);

  // display the events
  useEffect(() => {
    Promise.resolve(props.events)
      .then((res) => {
        if (res) {
          return convertToGeojson(res);
        } else return;
      })
      .then((data) => {
        // with LineString => polyline, & markers to MapRef.current
        L.geoJSON(data, {
          onEachFeature: onEachFeature,
        }).addTo(mapRef.current);
      });
  }, [onEachFeature, props.events]);

  // the form
  let itinary = "";
  function handleSubmit(e) {
    e.preventDefault();
    if (!props.user.email) return window.alert("Please login");
    if (!startPoint || !endPoint)
      return window.alert("Please select two points");

    itinary = {
      date: date,
      start: startPoint.start,
      start_gps: [startPoint.start_gps.lat, startPoint.start_gps.lng],
      end: endPoint.end,
      end_gps: [endPoint.end_gps.lat, endPoint.end_gps.lng],
      distance: tripLength,
    };

    const formdata = new FormData();
    for (const key of ["date", "start", "end", "distance"]) {
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
      token: props.token,
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
          setTripLength(0);
        }
      })
      .catch((err) => console.log(err));
  }

  function handleDate(e) {
    setDate(e.target.value);
  }

  return (
    <Container fluid>
      <Row>
        <div id="map"></div>
      </Row>

      <Suspense fallback={<span>Loading...</span>}>
        <Row style={{ justifyContent: "center" }}>
          <LazyHelp />
        </Row>
        <LazyMapForm
          onhandleSubmit={handleSubmit}
          startPoint={startPoint}
          endPoint={endPoint}
          date={date}
          distance={tripLength}
          onhandleDate={handleDate}
        />
      </Suspense>
    </Container>
  );
}
