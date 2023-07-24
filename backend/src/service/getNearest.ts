import { httpStatusCodeEnum } from "../enums/httpStatusCodeEnum";
import { StationRepo } from "../repository/station";
import db from "../datasource";
import { Request, Response } from "express";
import { geomFromGeoJSON, sameBrandParamFormatter } from "../helpers/api";

const stationRepo = new StationRepo();

export const getNearest = async (req: Request, res: Response) => {
  try {
    const { id, sameBrand } = req.query;

    if (!id) {
      res
        .status(httpStatusCodeEnum["BadRequest"])
        .send({ message: "Id required" });
      return;
    }
    const sameBrandBool = sameBrandParamFormatter(sameBrand as string);

    const station = await stationRepo.findOneBy({ id: +id });

    if (!station) {
      res
        .status(httpStatusCodeEnum["NotFound"])
        .send({ message: "No station found" });
      return;
    }

    const stationGeometry = geomFromGeoJSON(station.location);
    const postGISquery = `ST_Distance(${stationGeometry}, location)`;
    let whereQuery = `WHERE ${postGISquery}>0`;
    if (typeof sameBrandBool === "boolean") {
      whereQuery += ` AND brand${(sameBrandBool ? "=" : "!=") + station.brand}`;
    }

    const dbRes = await db.query(
      `SELECT id, ${postGISquery} FROM public.station ${whereQuery} ORDER BY ${postGISquery} ASC LIMIT 1`
    );

    if (!dbRes.length) {
      res
        .status(httpStatusCodeEnum["NotFound"])
        .send({ message: "Nearest station not found" });
      return;
    }

    const distance = dbRes[0].st_distance;
    const nearestStation = await stationRepo.findOneBy({ id: dbRes[0].id });

    if (!nearestStation) {
      res
        .status(httpStatusCodeEnum["NotFound"])
        .send({ message: "Nearest station not found" });
      return;
    }

    res.status(httpStatusCodeEnum["Ok"]).send({ ...nearestStation, distance });
  } catch (err) {
    res
      .status(httpStatusCodeEnum["InternalServerError"])
      .send({ message: err.message });
  }
};
