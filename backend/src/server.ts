import express from "express";
import db from "./datasource";
import { Station } from "./entity/station";
import { StationRepo } from "./repository/station";

const geomFromGeoJSON = (location) => {
  return `ST_GeomFromGeoJSON('${JSON.stringify(location)}')`;
};

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/getAllStations", async (req, res) => {
  const stations = await db.manager.find(Station);
  console.log(stations);
  res.send(stations);
});

app.get("/closestSameStation", async (req, res) => {
  const stations = await db.manager.find(Station);

  const oneStation = stations[0];
  const secStation = stations[1];

  // res.send(oneStation);
  // return;

  // const sqlRes = await db.manager
  //   .createQueryBuilder(Station, "station")
  //   .select(
  //     `ST_Distance(location, ST_GeomFromGeoJSON('${JSON.stringify(
  //       oneStation.location
  //     )}'))`
  //   )
  //   .getMany();

  // const sqlRes = await db.manager
  //   .createQueryBuilder()
  //   .select(
  //     `*, ST_Distance(ST_GeomFromGeoJSON('${JSON.stringify(
  //       oneStation.location
  //     )}'), ST_Distance(ST_GeomFromGeoJSON('${JSON.stringify(
  //       secStation.location
  //     )}'))`
  //   )
  //   .from(Station, "station")
  //   .getMany();
  // const stationRepo = new StationRepo();

  // const sqlRes = await db.query(
  //   `SELECT ST_Distance(ST_GeomFromGeoJSON('${JSON.stringify(
  //     oneStation.location
  //   )}'), ST_GeomFromGeoJSON('${JSON.stringify(secStation.location)}'))`
  // );

  const stationGeometry = geomFromGeoJSON(oneStation.location);
  const postGISquery = `ST_Distance(${stationGeometry}, location)`;

  const sqlRes = await db.query(
    `SELECT *, ${postGISquery} FROM public.station WHERE ${postGISquery}>0 ORDER BY ${postGISquery} ASC LIMIT 1`
  );

  // const sqlRes = await db.manager
  //   .createQueryBuilder(Station, "station")
  //   .select(
  //     `ST_GeomFromGeoJSON('{"type":"Point","coordinates":[-48.23456,20.12345]}')`
  //   )
  //   .getMany();

  // const sqlRes = await db
  //   .createQueryBuilder()
  //   .select(
  //     `ST_GeomFromGeoJSON('{"type":"Point","coordinates":[-48.23456,20.12345]}')`
  //   )
  //   .getMany();

  console.log(sqlRes);
  res.send(sqlRes);
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
