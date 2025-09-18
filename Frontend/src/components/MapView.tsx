import type { FeatureGroup as FeatureGroupType } from "leaflet";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import React, { useRef } from "react";
import {
  FeatureGroup,
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  useMapEvent,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import jeepIconUrl from "../assets/jeep.svg";
import type { GeoObject, GeoPolygon } from "../types/geo";

interface MapPanelProps {
  polygons: GeoPolygon[];
  pendingPolygons: GeoPolygon[];
  objects: GeoObject[];
  pendingObjects: GeoObject[];
  drawingMode: boolean;
  deleteMode: boolean;
  addObjectMode: boolean;
  deleteObjectMode: boolean;
  onDrawingComplete: (polygon: GeoPolygon) => void;
  onDeletePolygon: (polygonId: string) => void;
  onMapClickAddObject: (lat: number, lon: number) => void;
  onDeleteObject: (id: string) => void;
}

const israelCenter: [number, number] = [31.5, 34.8];

const jeepIcon = L.icon({
  iconUrl: jeepIconUrl,
  iconSize: [16, 16],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const MapView: React.FC<MapPanelProps> = ({
  polygons,
  pendingPolygons,
  objects,
  pendingObjects,
  drawingMode,
  deleteMode,
  addObjectMode,
  deleteObjectMode,
  onDrawingComplete,
  onDeletePolygon,
  onMapClickAddObject,
  onDeleteObject,
}) => {
  const featureGroupRef = useRef<FeatureGroupType | null>(null);

  // Handler for when a polygon is drawn
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDrawCreated = (e: { layerType: string; layer: any }) => {
    if (e.layerType === "polygon") {
      const layer = e.layer;
      const latlngs: { lat: number; lng: number }[] = layer.getLatLngs()[0];
      const coordinates: [number, number][] = latlngs.map((latlng) => [
        latlng.lat,
        latlng.lng,
      ]);
      const newPoly: GeoPolygon = {
        id: Date.now().toString(),
        name: `Polygon ${Date.now()}`,
        coordinates,
      };
      onDrawingComplete(newPoly);
      // Remove drawn layer from map (since state will re-render)
      if (featureGroupRef.current && "removeLayer" in featureGroupRef.current) {
        featureGroupRef.current.removeLayer(layer);
      }
    }
  };

  // Handler for polygon click in delete mode
  const handlePolygonClick = (polyId: string) => {
    if (deleteMode) {
      if (window.confirm("Delete this polygon?")) {
        onDeletePolygon(polyId);
      }
    }
  };

  // Handler for marker click in delete object mode
  const handleMarkerClick = (objId: string) => {
    if (deleteObjectMode) {
      if (window.confirm("Delete this object?")) {
        onDeleteObject(objId);
      }
    }
  };

  // Custom hook to handle map click for adding objects
  function AddObjectOnClick() {
    useMapEvent("click", (e) => {
      if (addObjectMode) {
        const { lat, lng } = e.latlng;
        onMapClickAddObject(lat, lng);
      }
    });
    return null;
  }

  return (
    <MapContainer
      center={israelCenter}
      zoom={8}
      style={{ height: "100%", width: "100%" }}
    >
      <AddObjectOnClick />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup ref={featureGroupRef}>
        {drawingMode && (
          <EditControl
            position="topright"
            onCreated={handleDrawCreated}
            draw={{
              polygon: true,
              polyline: false,
              rectangle: false,
              circle: false,
              marker: false,
              circlemarker: false,
            }}
            edit={{ edit: false, remove: false }}
          />
        )}
        {polygons.map((poly) => (
          <Polygon
            key={poly.id}
            positions={poly.coordinates}
            eventHandlers={
              deleteMode ? { click: () => handlePolygonClick(poly.id) } : {}
            }
          >
            {deleteMode && <Popup>Click polygon to delete</Popup>}
          </Polygon>
        ))}
        {pendingPolygons.map((poly) => (
          <Polygon
            key={poly.id}
            positions={poly.coordinates}
            pathOptions={{ color: "#888", dashArray: "4 4" }}
            opacity={0.6}
          />
        ))}
      </FeatureGroup>
      {objects.map((obj) => (
        <Marker
          key={obj.id}
          position={[obj.lat, obj.lon]}
          icon={jeepIcon}
          eventHandlers={
            deleteObjectMode ? { click: () => handleMarkerClick(obj.id) } : {}
          }
        >
          {deleteObjectMode && <Popup>Click marker to delete</Popup>}
        </Marker>
      ))}
      {pendingObjects.map((obj) => (
        <Marker
          key={obj.id}
          position={[obj.lat, obj.lon]}
          icon={jeepIcon}
          opacity={0.6}
        />
      ))}
    </MapContainer>
  );
};

export default MapView;
