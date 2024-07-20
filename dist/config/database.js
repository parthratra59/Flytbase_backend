"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConnect = () => {
    mongoose_1.default
        .connect(process.env.MONGODB_URI, {})
        .then(() => {
        console.log("Database connected successfully");
    })
        .catch((err) => {
        console.log("db connection issue");
        console.error(err);
        process.exit(1);
    });
};
exports.dbConnect = dbConnect;
