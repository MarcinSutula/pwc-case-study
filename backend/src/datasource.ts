import { DataSource } from "typeorm";
import { Station } from "./entity/station";
import { InitStations1689873689083 } from "./migrations/1689873689083-initStations";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "admin",
  database: "poland_gas_stations",
  entities: [Station],
  migrations: [InitStations1689873689083],
  schema: "public",
  synchronize: true,
});

AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");
    await AppDataSource.runMigrations();
    console.log("Migrations have been run");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization or Migrations", err);
  });

export default AppDataSource;
