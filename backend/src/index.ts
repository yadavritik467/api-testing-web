import cors from "cors";
import express, { type Request, type Response } from "express";
import { dbConnection } from "./db/db.js";

const app = express();

const port = 4500;
app.use(
  cors({
    origin: "http://localhost:5174",
  })
);

dbConnection()

app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/", (req: Request, res: Response) => {
  res.send("hii from server and its working good !!");
});

app.listen(port, () => {
  console.log(`server is running on  ${port}`);
});