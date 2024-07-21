"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
// cookie-Parser is the middleware
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const drone_routes_1 = __importDefault(require("./routes/drone.routes"));
const site_routes_1 = __importDefault(require("./routes/site.routes"));
const mission_routes_1 = __importDefault(require("./routes/mission.routes"));
const Categories_routes_1 = __importDefault(require("./routes/Categories.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
(0, database_1.dbConnect)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json({
    limit: "16kb",
}));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.urlencoded({ extended: true, limit: "16kb" }));
//  because of this only we can use cookie in the login
app.use((0, cookie_parser_1.default)());
//  routes
app.use("/api/v1/auth", user_routes_1.default);
app.use("/api/v1/drone", drone_routes_1.default);
app.use("/api/v1/site", site_routes_1.default);
app.use("/api/v1/missions", mission_routes_1.default);
app.use("/api/v1/categories", Categories_routes_1.default);
app.get("/", (_, res) => {
    res.send("Hello welcome to the Backend of the Flytbase");
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
