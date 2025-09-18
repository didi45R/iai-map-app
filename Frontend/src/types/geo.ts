export interface GeoObject {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface GeoPolygon {
  id: string;
  name: string;
  coordinates: [number, number][]; // [latitude, longitude]
}