import React from "react";
import type { GeoObject, GeoPolygon } from "../types/geo";

interface DataPanelProps {
  objects: GeoObject[];
  polygons: GeoPolygon[];
}

const DataTable: React.FC<DataPanelProps> = ({ objects, polygons }) => {
  return (
    <div className="data-table-container">
      <h3>Map Data</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Lat</th>
            <th>Lon</th>
          </tr>
        </thead>
        <tbody>
          {objects.map((obj) => (
            <tr key={obj.id}>
              <td>{obj.name}</td>
              <td>{obj.lat}</td>
              <td>{obj.lon}</td>
            </tr>
          ))}
          {polygons.map((poly) => (
            <tr key={poly.id}>
              <td>{poly.name}</td>
              <td>
                {poly.coordinates.map(([, lat], idx) => (
                  <div key={idx}>{lat}</div>
                ))}
              </td>
              <td>
                {poly.coordinates.map(([lon], idx) => (
                  <div key={idx}>{lon}</div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
