import { httpStatusCodeEnum } from "../enums/httpStatusCodeEnum";
import { StationRepo } from "../repository/station";
import db from "../datasource";
import { ILike, In } from "typeorm";
import { Request, Response } from "express";

const stationRepo = new StationRepo();

export const get = async (req: Request, res: Response) => {
  try {
    const filter: object = {};
    const stationColumnNames = db.entityMetadatas
      .find((metadata) => (metadata.tableName = "station"))
      ?.ownColumns.map((column) => column.propertyName);

    for (const [key, value] of Object.entries(req.query)) {
      if (value == undefined || !stationColumnNames?.includes(key)) continue;

      if (key === "brand" || key === "voivodeship" || key === "county") {
        filter[key] = In(value.toString().split(","));
      } else if (key !== "id") {
        filter[key] = ILike(`${value}`);
      } else {
        filter[key] = +(value as string).replaceAll("%", "");
      }
    }

    const stations = await stationRepo.findBy({ ...filter });

    res.status(httpStatusCodeEnum["Ok"]).send(stations);
  } catch (err) {
    res
      .status(httpStatusCodeEnum["InternalServerError"])
      .send({ message: err.message });
  }
};
