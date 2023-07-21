import express from "express";
import db from "./datasource";
import { StationRepo } from "./repository/station";
import { geomFromGeoJSON, sameBrandParamFormatter } from "./helpers/api";
import { ILike } from "typeorm";
import cors from "cors";

const app = express();
const stationRepo = new StationRepo();

app.use(
  cors({
    origin: "*",
    methods: ["GET"],
  })
);

app.get("/get", async (req, res) => {
  try {
    const filter: any = {};
    const stationColumnNames = db.entityMetadatas
      .find((metadata) => (metadata.tableName = "station"))
      ?.ownColumns.map((column) => column.propertyName);

    for (const [key, value] of Object.entries(req.query)) {
      if (value == undefined || !stationColumnNames?.includes(key)) continue;

      if (key !== "id" && key !== "brand") {
        filter[key] = ILike(`${value}`);
      } else {
        filter[key] = +(value as string).replaceAll("%", "");
      }
    }

    const stations = await stationRepo.findBy({ ...filter });

    res.status(200).send(stations);
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
    const sameBrandBool = sameBrandParamFormatter(sameBrand as string);

    const station = await stationRepo.findOneBy({ id: +id });

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

app.listen(3001, () => {
  console.log("Server is listening on port 3001");
});
