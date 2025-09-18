import { useState } from "react";
import { GeoService } from "../services/GeoService";
import type { GeoPolygon } from "../types/geo";

export function usePolygons(polygons: GeoPolygon[], setPolygons: (polys: GeoPolygon[]) => void) {
  const [pendingPolygons, setPendingPolygons] = useState<GeoPolygon[]>([]);
  const [drawingMode, setDrawingMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  const handleDrawingComplete = (polygon: GeoPolygon) => {
    setPendingPolygons((prev) => [...prev, polygon]);
    setDrawingMode(false);
  };

  const handleStartDrawing = () => {
    setDrawingMode(true);
    setDeleteMode(false);
  };

  const handleEnableDelete = () => {
    setDeleteMode(true);
    setDrawingMode(false);
  };

  const handleSavePolygons = async () => {
    for (const poly of pendingPolygons) {
      try {
        await GeoService.createGeo(poly);
      } catch (err) {
        console.error("Failed to save polygon", err);
      }
    }
    setPendingPolygons([]);
    setDrawingMode(false);
  };

  const handleDeletePolygon = async (polygonId: string) => {
    try {
      await GeoService.deleteGeo(polygonId);
    } catch (err) {
      console.error("Failed to delete polygon", err);
    }
    setDeleteMode(false);
  };

  const handleCancelPolygons = () => {
    setPendingPolygons([]);
    setDrawingMode(false);
  };

  return {
    polygons,
    pendingPolygons,
    drawingMode,
    deleteMode,
    setPolygons,
    setPendingPolygons,
    setDrawingMode,
    setDeleteMode,
    handleDrawingComplete,
    handleStartDrawing,
    handleEnableDelete,
    handleSavePolygons,
    handleDeletePolygon,
    handleCancelPolygons,
  };
}
