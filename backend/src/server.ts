import express from "express";
import db from "./datasource";
import { Station } from "./entity/station";
import { StationRepo } from "./repository/station";
import { geomFromGeoJSON, sameBrandParamFormatter } from "./helpers/api";

const app = express();
const stationRepo = new StationRepo();

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/getAll", async (req, res) => {
  try {
    const stations = await stationRepo.find();
    res.status(200).send(stations);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.get("/get", async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      throw new Error("Id required");
    }

    const station = await stationRepo.findOneBy({ id });

    if (!station) {
      res.status(200).send({ message: "No station found" });
      return;
    }
    res.status(200).send(station);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.get("/getNearest", async (req, res) => {
  try {
    const { id, sameBrand } = req.query;

    if (!id) {
      throw new Error("Id required");
    }
    const sameBrandBool = sameBrandParamFormatter(sameBrand);

    const station = await stationRepo.findOneBy({ id });

    if (!station) {
      res.status(200).send({ message: "No station found" });
      return;
    }

    const stationGeometry = geomFromGeoJSON(station.location);
    const postGISquery = `ST_Distance(${stationGeometry}, location)`;
    let whereQuery = `WHERE ${postGISquery}>0`;
    if (typeof sameBrandBool === "boolean") {
      whereQuery += ` AND brand${(sameBrandBool ? "=" : "!=") + station.brand}`;
    }

    const dbRes = await db.query(
      `SELECT *, ${postGISquery} FROM public.station ${whereQuery} ORDER BY ${postGISquery} ASC LIMIT 1`
    );

    res.status(200).send(dbRes);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
