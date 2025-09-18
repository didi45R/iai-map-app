import { useState } from "react";
import { GeoService } from "../services/GeoService";
import type { GeoObject } from "../types/geo";

export function useObjects(objects: GeoObject[], setObjects: (objs: GeoObject[]) => void) {
  const [pendingObjects, setPendingObjects] = useState<GeoObject[]>([]);
  const [addObjectMode, setAddObjectMode] = useState(false);
  const [deleteObjectMode, setDeleteObjectMode] = useState(false);

  const handleAddObjectMode = () => {
    setAddObjectMode(true);
    setDeleteObjectMode(false);
  };

  const handleEnableDeleteObject = () => {
    setDeleteObjectMode(true);
    setAddObjectMode(false);
  };

  const handleMapClickAddObject = (lat: number, lon: number) => {
    if (addObjectMode) {
      const name = `Object ${Date.now()}`;
      const newObj: GeoObject = {
        id: Date.now().toString(),
        name,
        lat,
        lon,
      };
      setPendingObjects((prev) => [...prev, newObj]);
    }
  };

  const handleSaveObjects = async () => {
    for (const obj of pendingObjects) {
      try {
        await GeoService.createGeo(obj);
      } catch (err) {
        console.error("Failed to save object", err);
      }
    }
    setPendingObjects([]);
    setAddObjectMode(false);
  };

  const handleDeleteObject = async (id: string) => {
    try {
      await GeoService.deleteGeo(id);
    } catch (err) {
      console.error("Failed to delete object", err);
    }
    setDeleteObjectMode(false);
  };

  const handleCancelObjects = () => {
    setPendingObjects([]);
    setAddObjectMode(false);
  };

  return {
    objects,
    pendingObjects,
    addObjectMode,
    deleteObjectMode,
    setObjects,
    setPendingObjects,
    setAddObjectMode,
    setDeleteObjectMode,
    handleAddObjectMode,
    handleEnableDeleteObject,
    handleMapClickAddObject,
    handleSaveObjects,
    handleDeleteObject,
    handleCancelObjects,
  };
}
