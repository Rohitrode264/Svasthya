import express, { type Request, type Response } from "express";
import axios from "axios";

const router = express.Router();

const KM_TO_DEG = 1 / 111; // ~1° latitude ≈ 111 km

interface Address {
    city?: string;
    street?: string;
    postcode?: string;
  }
  
  interface Hospital {
    id: number | null;
    name: string;
    type: string;
    address: Address;
    coordinates: [number, number];
    completeness: string;
    source: string;
  }
  

export const facilities = async (req: Request, res: Response) => {
  try {
    const { lat, lng, range } = req.query;

    if (!lat || !lng || !range) {
      return res.status(400).json({
        error: "Missing required query parameters: lat, lng, range",
      });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const radiusKm = parseFloat(range as string);

    // Bounding box
    const delta = radiusKm * KM_TO_DEG;
    const minLat = latitude - delta;
    const maxLat = latitude + delta;
    const minLng = longitude - delta;
    const maxLng = longitude + delta;

    const apiKey = process.env.HEALTHSITES_API_KEY;
    const apiUrl = `https://healthsites.io/api/v3/facilities/?api-key=${apiKey}&extent=${minLng},${minLat},${maxLng},${maxLat}&output=geojson`;

    const { data } = await axios.get(apiUrl);

    const hospitals = (data.features || []).map((feature: any) => {
      const props = feature.properties || {};
      const attrs = props.attributes || {};
      const geom = feature.geometry || {};

      let coords: [number, number] = [0, 0];
      if (geom.type === "Point" && Array.isArray(geom.coordinates)) {
        coords = [geom.coordinates[1], geom.coordinates[0]]; // lat, lng
      } else if (Array.isArray(geom.coordinates)) {
        const flat = geom.coordinates.flat(Infinity);
        coords = [flat[1], flat[0]];
      }

      const entry = {
        id: props.osm_id || null,
        name: attrs.name || props.name || "Unknown",
        type: attrs.amenity || attrs.healthcare || "Unknown",
        address: {
          city: attrs.addr_city || undefined,
          street: attrs.addr_street || undefined,
          postcode: attrs.addr_postcode || undefined,
        },
        coordinates: coords,
        completeness: `${(props.completeness || 0).toFixed(1)}%`,
        source: attrs.source || "HealthSites.io",
      };

      (Object.keys(entry.address) as (keyof typeof entry.address)[]).forEach(
        (k) => entry.address[k] === undefined && delete entry.address[k]
      );

      return entry;
    });

    const response = {
      query: {
        center: { lat: latitude, lng: longitude },
        radius_km: radiusKm,
      },
      summary: {
        total_facilities: hospitals.length,
        data_sources: [...new Set(hospitals.map((h:any) => h.source))],
      },
      hospitals,
    };

    return res.status(200).json(response);
  } catch (error: any) {
    console.error("Error fetching hospital data:", error.message);
    return res.status(500).json({
      error: "Failed to fetch hospitals from HealthSites API",
    });
  }
};
