import axios from "axios";
import type { GeoObject, GeoPolygon } from "../types/geo";

const BASE_URL = "http://localhost:5086/api/geo";

export class GeoService {
  static async createGeo(data: GeoObject | GeoPolygon) {
    // Accepts either a GeoObject or GeoPolygon
    return axios.post(BASE_URL, data);
  }

  static async getAllGeo() {
    return axios.get(BASE_URL);
  }

  static async deleteGeo(id: string) {
    return axios.delete(`${BASE_URL}/${id}`);
  }
}
