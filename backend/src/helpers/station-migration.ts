import { Station } from "../entity/station";
import { geomFromGeoJSON } from "./api";
import db from "../datasource";
import { bpJson, orlenJson, shellJson } from "../types/stationsJsonTypes";
import { Point } from "geojson";
import { stationBrandEnum } from "../enums/stationBrandEnum";

export const replacePolishLetters = (str: string) => {
  const parsed = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll("Ł", "L")
    .replaceAll("ł", "l");

  return parsed;
};

export const setRegions = async (station: Station) => {
  const stationGeometry = geomFromGeoJSON(station.location);
  const stationGeometry2180 = `ST_Transform(${stationGeometry}, 2180)`;
  const geom2180 = `ST_SetSRID(geom, 2180)`;
  const postGISquery = `ST_Within(${stationGeometry2180}, ${geom2180})`;
  const whereQuery = `WHERE ${postGISquery}=TRUE`;

  const regionNames = await Promise.all(
    ["wojewodztwa", "powiaty"].map(async (region) => {
      const dbRes = await db.query(
        `SELECT jpt_nazwa_ FROM public.${region} ${whereQuery} LIMIT 1`
      );
      return dbRes[0].jpt_nazwa_
        ? replacePolishLetters(dbRes[0].jpt_nazwa_)
        : null;
    })
  );

  if (regionNames[0]) station.voivodeship = regionNames[0];
  if (regionNames[1]) station.county = regionNames[1];
};

export const generateBrandStations = async (
  stations: orlenJson[] | shellJson[] | bpJson[]
): Promise<Station[]> => {
  const dbStations = await Promise.all(
    stations.map(async (station: orlenJson | shellJson | bpJson) => {
      const location: Point = {
        coordinates: [+station.lng, +station.lat],
        type: "Point",
      };

      const stationInstance = new Station();
      stationInstance.location = location;

      for (const [key, value] of Object.entries(station)) {
        if (key === "lat" || key === "lng" || key === "id") continue;
        if (key === "brand") {
          stationInstance[key] = stationBrandEnum[value];
          continue;
        }
        stationInstance[key] = value;
      }
      await setRegions(stationInstance);
      return stationInstance;
    })
  );

  return dbStations;
};
