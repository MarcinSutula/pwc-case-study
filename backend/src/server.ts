import express from "express";
import cors from "cors";
import { get } from "./service/get";
import { getNearest } from "./service/getNearest";
import { getWithin } from "./service/getWithin";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET"],
  })
);

app.get("/get", get);

app.get("/getNearest", getNearest);

app.get("/getWithin", getWithin);

app.listen(3001, () => {
  console.log("Server is listening on port 3001");
});
