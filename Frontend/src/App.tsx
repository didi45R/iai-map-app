import { Divider } from "@mui/material";
import { useEffect, useState } from "react";
import "./App.css";
import DataTable from "./components/DataTable";
import MapView from "./components/MapView";
import ObjectsPanel from "./components/ObjectsPanel";
import PolygonPanel from "./components/PolygonPanel";
import { useObjects } from "./hooks/useObjects";
import { usePolygons } from "./hooks/usePolygons";
import { GeoService } from "./services/GeoService";

const App: React.FC = () => {
  // Cancel delete mode handlers
  const handleCancelDeleteMode = () => {
    polygonLogic.setDeleteMode(false);
  };
  const handleCancelDeleteObjectMode = () => {
    objectLogic.setDeleteObjectMode(false);
  };
  // Helper to refresh backend data
  const refreshGeoData = async () => {
    try {
      const res = await GeoService.getAllGeo();
      const data = res.data;
      const loadedPolygons = [];
      const loadedObjects = [];
      if (Array.isArray(data)) {
        data.forEach((item) => {
          if (item.coordinates && Array.isArray(item.coordinates)) {
            loadedPolygons.push(item);
          } else if (item.lat !== undefined && item.lon !== undefined) {
            loadedObjects.push(item);
          }
        });
      }
      setPolygons(loadedPolygons);
      setObjects(loadedObjects);
    } catch (err) {
      console.error("Failed to fetch geo data", err);
    }
  };
  // Backend state
  const [polygons, setPolygons] = useState([]);
  const [objects, setObjects] = useState([]);

  // Fetch backend data once
  useEffect(() => {
    const fetchGeo = async () => {
      try {
        const res = await GeoService.getAllGeo();
        const data = res.data;
        const loadedPolygons = [];
        const loadedObjects = [];
        if (Array.isArray(data)) {
          data.forEach((item) => {
            if (item.coordinates && Array.isArray(item.coordinates)) {
              loadedPolygons.push(item);
            } else if (item.lat !== undefined && item.lon !== undefined) {
              loadedObjects.push(item);
            }
          });
        }
        setPolygons(loadedPolygons);
        setObjects(loadedObjects);
      } catch (err) {
        console.error("Failed to fetch geo data", err);
      }
    };
    fetchGeo();
  }, []);

  // Polygon UI logic
  const polygonLogic = usePolygons(polygons, setPolygons);
  // Patch polygon actions to refresh data after save/delete
  const handleSavePolygons = async () => {
    await polygonLogic.handleSavePolygons();
    await refreshGeoData();
  };
  const handleDeletePolygon = async (id: string) => {
    await polygonLogic.handleDeletePolygon(id);
    await refreshGeoData();
  };
  // Object UI logic
  const objectLogic = useObjects(objects, setObjects);
  // Patch object actions to refresh data after save/delete
  const handleSaveObjects = async () => {
    await objectLogic.handleSaveObjects();
    await refreshGeoData();
  };
  const handleDeleteObject = async (id: string) => {
    await objectLogic.handleDeleteObject(id);
    await refreshGeoData();
  };

  return (
    <div className="app">
      <div className="map-panel">
        <MapView
          polygons={polygons}
          pendingPolygons={polygonLogic.pendingPolygons}
          objects={objects}
          pendingObjects={objectLogic.pendingObjects}
          drawingMode={polygonLogic.drawingMode}
          deleteMode={polygonLogic.deleteMode}
          addObjectMode={objectLogic.addObjectMode}
          deleteObjectMode={objectLogic.deleteObjectMode}
          onDrawingComplete={polygonLogic.handleDrawingComplete}
          onDeletePolygon={handleDeletePolygon}
          onMapClickAddObject={objectLogic.handleMapClickAddObject}
          onDeleteObject={handleDeleteObject}
        />
      </div>
      <div className="controls-panel" style={{ borderLeft: "3px solid black" }}>
        <div className="polygon-panel">
          <PolygonPanel
            pendingPolygons={polygonLogic.pendingPolygons}
            deleteMode={polygonLogic.deleteMode}
            onStartDrawing={polygonLogic.handleStartDrawing}
            onEnableDelete={polygonLogic.handleEnableDelete}
            onSavePolygons={handleSavePolygons}
            onCancelPolygons={polygonLogic.handleCancelPolygons}
            onCancelDelete={handleCancelDeleteMode}
          />
        </div>
        <Divider
          sx={{ borderBottomWidth: 2, borderColor: "black", paddingTop: "5px" }}
        />
        <div className="objects-panel">
          <ObjectsPanel
            pendingObjects={objectLogic.pendingObjects}
            deleteObjectMode={objectLogic.deleteObjectMode}
            onAddObjectMode={objectLogic.handleAddObjectMode}
            onEnableDeleteObject={objectLogic.handleEnableDeleteObject}
            onSaveObjects={handleSaveObjects}
            onCancelObjects={objectLogic.handleCancelObjects}
            onCancelDeleteObject={handleCancelDeleteObjectMode}
          />
        </div>
        <Divider
          sx={{ borderBottomWidth: 2, borderColor: "black", paddingTop: "5px" }}
        />
        <div className="data-panel">
          <DataTable objects={objects} polygons={polygons} />
        </div>
      </div>
    </div>
  );
};

export default App;
