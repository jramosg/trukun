import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { IonContent, IonPage } from "@ionic/react";
import Header from "../../components/header";

const ComponentResize = () => {
  const map = useMap();

  setTimeout(() => {
    map.invalidateSize();
  }, 0);

  return null;
};

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

type Position = {
  label: string;
  position: [number, number]; // Tuple of [latitude, longitude]
};

// Correcting positions to only include latitude and longitude
const positions: { [key: string]: Position } = {
  location1: {
    label: "Ex etxea 1",
    position: [43.06349783293448, -2.497265725442534],
  },
  location2: {
    label: "Ex etxea 2",
    position: [43.06553562643309, -2.494804102664364],
  },
  location3: {
    label: "Bittori 😍",
    position: [43.06161179048143, -2.4920221314999242],
  },
  location4: {
    label: "Musakola",
    position: [43.071262063682205, -2.476030887181688],
  },
  location5: {
    label: "Udalaitz",
    position: [43.09009416560299, -2.513456089385153],
  },
  location6: {
    label: "Nerean mendia",
    position: [43.05501212266869, -2.48159927382931],
  },
};

const Map: React.FC = () => {
  const center: [number, number] = [43.0657589, -2.492529];

  return (
    <IonPage>
      <IonContent>
        <Header title="Arrasate"></Header>
        <MapContainer
          style={{
            height: "100%",
            width: "100%",
          }}
          center={center}
          attributionControl={true}
          zoom={14}
          minZoom={3}
          scrollWheelZoom={true}
        >
          <ComponentResize />
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {Object.entries(positions).map(([key, { label, position }]) => (
            <Marker key={key} position={position}>
              <Popup>{label}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </IonContent>
    </IonPage>
  );
};

export default Map;