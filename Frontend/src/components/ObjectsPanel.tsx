import React from "react";
import type { GeoObject } from "../types/geo";

type ObjectsPanelProps = {
  pendingObjects: GeoObject[];
  deleteObjectMode: boolean;
  onAddObjectMode: () => void;
  onEnableDeleteObject: () => void;
  onSaveObjects: () => void;
  onCancelObjects: () => void;
  onCancelDeleteObject: () => void;
};

const ObjectsPanel: React.FC<ObjectsPanelProps> = ({
  pendingObjects,
  deleteObjectMode,
  onAddObjectMode,
  onEnableDeleteObject,
  onSaveObjects,
  onCancelObjects,
  onCancelDeleteObject,
}) => {
  return (
    <div className="objects-panel-container">
      <h3>Objects</h3>
      <button onClick={onAddObjectMode}>Add Object</button>
      <button onClick={onEnableDeleteObject} style={{ marginLeft: 8 }}>
        Delete Object
      </button>
      {deleteObjectMode && (
        <button onClick={onCancelDeleteObject} style={{ marginLeft: 8 }}>
          Cancel
        </button>
      )}
      {pendingObjects.length > 0 && (
        <>
          <button onClick={onSaveObjects} style={{ marginBottom: 8 }}>
            Save Objects
          </button>
          <button
            onClick={onCancelObjects}
            style={{ marginLeft: 8, marginBottom: 8 }}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};

export default ObjectsPanel;
