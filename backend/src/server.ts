import express from "express";
import db from "./datasource";
import { Station } from "./entity/station";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/getAllStations", async (req, res) => {
  const stations = await db.manager.find(Station);
  console.log(stations);
  res.send(stations);
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
