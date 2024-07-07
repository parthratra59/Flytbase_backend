import express from "express";
import { dbConnect } from "./config/database.js";
// cookie-Parser is the middleware
import cookieParser from "cookie-parser";
import UserRoute from "./routes/user.routes";
import DroneRoute from "./routes/drone.routes";
import SiteRoute from "./routes/site.routes";
import dotenv from "dotenv";
import morgan from "morgan";
dotenv.config();
dbConnect();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json({
    limit: "16kb",
}));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true,
    limit: "16kb"
}));
//  because of this only we can use cookie in the login
app.use(cookieParser());
//  routes
app.use("/api/v1/auth", UserRoute);
app.use("/api/v1/drone", DroneRoute);
app.use("/api/v1/site", SiteRoute);
app.get("/", (_, res) => {
    res.send("Express + TypeScript Server");
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
