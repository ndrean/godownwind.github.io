import React from "react";
import Button from "react-bootstrap/Button";
import { PositionContext } from "./PositionContext";

export default function Geoloc() {
  const [accept, setAccept] = React.useState(false);
  const [gps, setGps] = React.useContext(PositionContext);

  React.useEffect(() => {
    if (accept) {
      navigator.geolocation.getCurrentPosition(
        success,
        (error) => console.log("not available", error),
        {
          enableHighAccuracy: true,
          timeout: 10_000,
          maximumAge: 100_000,
        }
      );
    }
    function success({ coords: { latitude, longitude } }) {
      setGps((prev) => ({
        ...prev,
        Lat: latitude.toFixed(4),
        Lng: longitude.toFixed(4),
      }));
    }
  }, [accept, setGps]);

  return (
    <>
      {/* <PositionProvider value={[gps, setGps]}> */}
      <Button aria-label="gelocalisation" onClick={() => setAccept(true)}>
        Enable geolocalisation
      </Button>
      <br />
      {accept && gps ? (
        gps.Lat ? (
          <>
            <br />
            <p>
              Your position is: Latitude: {gps.Lat} et Longitude: {gps.Lng}
            </p>
          </>
        ) : (
          <>
            <br />
            <p>Geolocalizing...</p>
          </>
        )
      ) : null}
      {/* </PositionProvider> */}
    </>
  );
}
