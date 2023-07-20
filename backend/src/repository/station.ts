import { Repository } from "typeorm";
import { Station } from "../entity/station";
import db from "../datasource";
export class StationRepo extends Repository<Station> {
  constructor() {
    super(Station, db.createEntityManager());
  }
}
