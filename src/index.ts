import express, { Express, Request, Response, urlencoded } from "express";
import { dbConnect } from "./config/database";
// cookie-Parser is the middleware
import cookieParser from "cookie-parser";
import UserRoute from "./routes/user.routes";
import DroneRoute from "./routes/drone.routes";
import SiteRoute from "./routes/site.routes";
import MissionRoute from "./routes/mission.routes";

import CategoryRoute from "./routes/Categories.routes";
import dotenv from "dotenv";
import morgan from "morgan";
dotenv.config();

dbConnect();
const app: Express = express();

const port = process.env.PORT || 3000;

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//  because of this only we can use cookie in the login

app.use(cookieParser());

//  routes
app.use("/api/v1/auth", UserRoute);
app.use("/api/v1/drone", DroneRoute);
app.use("/api/v1/site", SiteRoute);
app.use("/api/v1/missions", MissionRoute);
app.use("/api/v1/categories", CategoryRoute);

app.get("/", (_, res: Response) => {
  res.send("Hello welcome to the Backend of the Flytbase");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
