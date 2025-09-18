import React from "react";
import type { GeoPolygon } from "../types/geo";

type PolygonPanelProps = {
  pendingPolygons: GeoPolygon[];
  deleteMode: boolean;
  onStartDrawing: () => void;
  onEnableDelete: () => void;
  onSavePolygons: () => void;
  onCancelPolygons: () => void;
  onCancelDelete: () => void;
};

const PolygonPanel: React.FC<PolygonPanelProps> = ({
  pendingPolygons,
  deleteMode,
  onStartDrawing,
  onEnableDelete,
  onSavePolygons,
  onCancelPolygons,
  onCancelDelete,
}) => {
  return (
    <div className="polygon-panel-container">
      <h3>Polygons</h3>
      <button onClick={onStartDrawing}>Add Polygon</button>
      <button onClick={onEnableDelete} style={{ marginLeft: 8 }}>
        Delete Polygon
      </button>
      {deleteMode && (
        <button onClick={onCancelDelete} style={{ marginLeft: 8 }}>
          Cancel
        </button>
      )}
      {pendingPolygons.length > 0 && (
        <>
          <button onClick={onSavePolygons} style={{ marginBottom: 8 }}>
            Save Polygons
          </button>
          <button
            onClick={onCancelPolygons}
            style={{ marginLeft: 8, marginBottom: 8 }}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};

export default PolygonPanel;
