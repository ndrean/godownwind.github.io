import React, {
  useRef,
  useEffect,
  useState,
  useContext,
  Suspense,
  lazy,
  useCallback,
} from "react";

// Leaflet //
import "../../index.css"; // to get #map
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

// Esri : github.com/Esri/esri-leaflet-geocoder //
import { geosearch, geocodeService } from "esri-leaflet-geocoder";
import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css";
// import * as EsriGeocode from "esri-leaflet-geocoder";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { redIcon, greenIcon, blueIcon, goldIcon } from "./Icon";

import { PositionContext } from "../nav/PositionContext";

import { html } from "./popupHtmlForm";
import convertToGeojson from "./convertToGeojson";
import fetchModif from "../../helpers/fetchModif";

const LazyMapForm = lazy(() => import("./MapForm"));
const LazyHelp = lazy(() => import("./Help"));

//// setup Icons (bug) ///
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default React.memo(function MyMap(props) {
  console.log("__Map__");
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [date, setDate] = useState("");
  const [tripLength, setTripLength] = useState(0);

  const mapRef = useRef();
  const markersLayerRef = useRef(L.layerGroup());

  const [gps] = useContext(PositionContext);
  const center = gps.Lat ? [gps.Lat, gps.Lng] : [45, 1];

  //////////// display the events //////////////////
  const onEachFeature = useCallback((feature = {}, layer) => {
    const { current: { leafletElement: mymap } = {} } = mapRef;
    const { current: setOfMarkers } = markersLayerRef;

    const {
      properties: { date, start, end, distance } = {},
      geometry: { coordinates },
    } = feature;
    if (coordinates) {
      // !! Geojson LineString is [lng, lat] and Leaflet needs [lat, lng] !!
      const startMarker = L.marker(invertArray(coordinates[0]), {
        icon: redIcon,
      }).addTo(setOfMarkers);
      const endMarker = L.marker(invertArray(coordinates[1]), {
        icon: greenIcon,
      }).addTo(setOfMarkers);

      const content = L.DomUtil.create("div");
      content.innerHTML = `
          <h6>${date} </h6>
          <p> From: ${start}</p>
          <p> To:  ${end} </p>
          <p> Distance: ${parseFloat(distance).toFixed(0)} km </p>
          `;
      startMarker.bindPopup(content);
      endMarker.bindPopup(content);
      setOfMarkers.addTo(mymap);
    }
  }, []);

  useEffect(() => {
    const { current: { leafletElement: mymap } = {} } = mapRef;
    const { current: setOfMarkers } = markersLayerRef;

    Promise.resolve(props.events)
      .then((res) => {
        if (res) {
          return convertToGeojson(res);
        } else return;
      })
      .then((data) => {
        L.geoJSON(data, {
          onEachFeature: onEachFeature,
        }).addTo(mymap);
      });

    return () => {
      setOfMarkers.remove();
    };
  }, [props.events, onEachFeature]);

  function invertArray([a, b]) {
    return [b, a];
  }

  /////////// put marker by searching a name ///////////////////

  const startEndIds = {};
  const startEndCoords = {};

  const handlePopup = useCallback(({ popup, place, coords, searchMarker }) => {
    let onOpenValue = "";
    //on popup open, catch the state (start/end) of the point if any
    const getOnOpenValue = () => {
      const typeRadio = document.body.querySelectorAll('input[type="radio"]');
      onOpenValue = [...typeRadio].find((t) => t.checked === true);
      if (onOpenValue) {
        onOpenValue = onOpenValue.value;
      }
    };
    popup.on("popupopen", getOnOpenValue);

    // on popup close, update a point to start/end and set state
    const getOnPopupClose = (e) => {
      console.log("_action_");
      const { current: markersSet = {} } = markersLayerRef;

      // === e.target._leaflet_id ===markersLayer.current.getLayerId(searchMarker)
      const getId = L.stamp(e.target);
      const typeRadio = document.body.querySelectorAll('input[type="radio"]');
      let getValue = [...typeRadio].find((t) => t.checked === true);
      if (getValue !== undefined) {
        getValue = getValue.value;
      }

      switch (getValue) {
        case "start":
          startEndIds.start = L.stamp(searchMarker);
          if (onOpenValue === "end" && startEndIds.end === getId) {
            setEndPoint("");
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
            startEndCoords.start = null;
            startEndIds.start = null;
            setStartPoint(null);
          } else if (onOpenValue === "end") {
            startEndCoords.end = null;
            startEndIds.end = null;
            setEndPoint(null);
          }
          return markersSet.removeLayer(searchMarker);

        default:
          return markersSet.removeLayer(searchMarker);
      }

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
    };
    popup.on("popupclose", getOnPopupClose);
    // remove listener, pass the same context as for 'on'
    return () => {
      popup.off("popupopen", getOnOpenValue);
      popup.off("popupclose", getOnPopupClose);
    };
  }, []);

  ///// Searchbox : type address and get gps & set marker
  const handleSearch = useCallback(
    (data) => {
      const { current: markersSet = {} } = markersLayerRef;
      if (!data.results || !data.latlng) return;

      const searchCtrlMarker = L.marker(data.latlng, { icon: blueIcon }).addTo(
        markersSet
      );
      const content = L.DomUtil.create("div");
      content.innerHTML = `<p>${data.text}</p> ${html}`;
      const popup = searchCtrlMarker.bindPopup(content);
      popup.openPopup();
      handlePopup({
        popup,
        place: data.text,
        coords: data.latlng,
        searchMarker: searchCtrlMarker,
      });
    },
    [handlePopup]
  );

  useEffect(() => {
    const { current: { leafletElement: mymap } = {} } = mapRef;
    if (!mymap) return;
    L.control.scale().addTo(mymap);
    const control = geosearch({
      position: "topright",
      placeholder: "Search City / address",
      title: "Search",
    });
    control.addTo(mymap);
    control.on("results", handleSearch);

    return () => {
      control.off("results", handleSearch);
    };
  }, [mapRef, handleSearch]);

  ////////// Click on map and find location : reverse geocoding /////////////
  const reverseGeocode = useCallback(
    function (coords, searchMarker) {
      const { current: markersSet = {} } = markersLayerRef;

      geocodeService()
        .reverse()
        .latlng(coords)
        .run((error, result) => {
          if (error) {
            return markersSet.removeLayer(searchMarker);
          }
          searchMarker.addTo(markersSet);
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
          handlePopup({
            popup,
            place,
            coords,
            searchMarker,
          });
        });
    },
    [handlePopup]
  );

  useEffect(() => {
    const { current: { leafletElement: mymap } = {} } = mapRef;

    const research = (e) => {
      const searchMarker = new L.marker(e.latlng, { icon: blueIcon });
      reverseGeocode(e.latlng, searchMarker);
    };
    mymap.on("click", research);

    return () => {
      mymap.off("click", research);
    };
  }, [reverseGeocode]);

  /////////////// the form ///////////////////////
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
      token: props.jwtToken,
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
          //markersLayer.current.clearLayers();
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
        <Map ref={mapRef} center={center} zoom={6}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&amp;copy <a href=&quote http://osm.org/copyright &quote> OpenStreetMap </a> contributors"
          />
          <Marker position={center} icon={goldIcon}>
            <Popup>I'm here!</Popup>
          </Marker>
        </Map>
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
});
