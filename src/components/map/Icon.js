import { Icon } from "leaflet";
const greenIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [20, 33],
  iconAnchor: [12, 31],
  popupAnchor: [1, -34],
  shadowSize: [33, 33],
});
const blueIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [20, 33],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [33, 33],
});

const redIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [20, 33],
  iconAnchor: [12, 31],
  popupAnchor: [1, -34],
  shadowSize: [33, 33],
});
/*
const kiteIcon = new Icon({
  iconUrl: "../../assets/kitesurfing.svg",
  iconSize: [25, 25],
});
*/
export { redIcon, greenIcon, blueIcon };
