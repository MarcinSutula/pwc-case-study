import { DataSource } from "typeorm";
import { Station } from "./entity/station";
import { InitStations1689873689082 } from "./migrations/1689873689082-initStations";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "admin",
  database: "poland_gas_stations",
  entities: [Station],
  migrations: [InitStations1689873689082],
  schema: "public",
  synchronize: true,
});

AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");
    await AppDataSource.runMigrations();
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

export default AppDataSource;
