import { MigrationInterface, QueryRunner } from "typeorm";
import { Station } from "../entity/station";
import bpStationsJson from "../static/bpPolishStations.json";
import shellStationsJson from "../static/shellPolishStations.json";
import orlenStationsJson from "../static/orlenPolishStations.json";
import { Point } from "geojson";
import { bpJson, shellJson, orlenJson } from "../types/stationsJsonTypes";
import { stationBrandEnum } from "../enums/stationBrandEnum";

function generateStations(
  stations: orlenJson[] | shellJson[] | bpJson[]
): Station[] {
  const dbStations = stations.map((station: orlenJson | shellJson | bpJson) => {
    const location = {
      type: "Point",
      coordinates: [+station.lat, +station.lng],
    };
    const stationInstance = new Station();
    stationInstance.location = location as Point;

    for (const [key, value] of Object.entries(station)) {
      if (key === "lat" || key === "lng" || key === "id") continue;
      if (key === "brand") {
        stationInstance[key] = stationBrandEnum[value];
        continue;
      }
      stationInstance[key] = value;
    }
    return stationInstance;
  });

  return dbStations;
}

const bpStations = generateStations(bpStationsJson);
const shellStations = generateStations(shellStationsJson);
const orlenStations = generateStations(orlenStationsJson);

export class InitStations1689873689082 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save([
      ...bpStations,
      ...shellStations,
      ...orlenStations,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.remove([
      ...bpStations,
      ...shellStations,
      ...orlenStations,
    ]);
  }
}
