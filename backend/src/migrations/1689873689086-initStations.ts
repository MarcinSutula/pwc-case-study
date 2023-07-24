import { MigrationInterface, QueryRunner } from "typeorm";
import bpStationsJson from "../static/bpPolishStations.json";
import shellStationsJson from "../static/shellPolishStations.json";
import orlenStationsJson from "../static/orlenPolishStations.json";
import { generateBrandStations } from "../helpers/station-migration";

export class InitStations1689873689086 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const bpStations = await generateBrandStations(bpStationsJson);
    const shellStations = await generateBrandStations(shellStationsJson);
    const orlenStations = await generateBrandStations(orlenStationsJson);

    await queryRunner.manager.save([
      ...bpStations,
      ...shellStations,
      ...orlenStations,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const bpStations = await generateBrandStations(bpStationsJson);
    const shellStations = await generateBrandStations(shellStationsJson);
    const orlenStations = await generateBrandStations(orlenStationsJson);

    await queryRunner.manager.remove([
      ...bpStations,
      ...shellStations,
      ...orlenStations,
    ]);
  }
}
