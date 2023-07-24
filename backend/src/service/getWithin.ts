import { httpStatusCodeEnum } from "../enums/httpStatusCodeEnum";
import { StationRepo } from "../repository/station";
import db from "../datasource";
import { Request, Response } from "express";
import { geomFromGeoJSON } from "../helpers/api";
import { Station } from "../entity/station";

const stationRepo = new StationRepo();

export const getWithin = async (req: Request, res: Response) => {
  try {
    const { id, distance } = req.query;

    if (!id || !distance) {
      res
        .status(httpStatusCodeEnum["BadRequest"])
        .send({ message: "Id and distance required" });
      return;
    }

    const station = await stationRepo.findOneBy({ id: +id });

    if (!station) {
      res
        .status(httpStatusCodeEnum["NotFound"])
        .send({ message: "No station found" });
      return;
    }

    const distanceFormatted = +(+distance).toFixed(0);

    const stationGeometry = geomFromGeoJSON(station.location);
    const postGISquery = `ST_Distance(${stationGeometry}, location)`;
    const whereQuery = `WHERE ${postGISquery}<=${distanceFormatted}`;

    const dbRes = await db.query(`SELECT id FROM public.station ${whereQuery}`);
    const ids = dbRes.map((station: Station) => station.id);

    res.status(httpStatusCodeEnum["Ok"]).send({ id: ids });
  } catch (err) {
    res
      .status(httpStatusCodeEnum["InternalServerError"])
      .send({ message: err.message });
  }
};
