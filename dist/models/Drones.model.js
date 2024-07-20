"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drone = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const droneSchema = new mongoose_1.Schema({
    droneID: { type: String, required: true, unique: true },
    deleted_by: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    deleted_on: { type: Date, default: null },
    drone_type: { type: String, required: true, trim: true },
    make_name: { type: String, trim: true, required: true },
    name: { type: String, trim: true, required: true },
    siteID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Sites",
        // required: true,
    },
    userID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    missionID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Missions",
        default: null,
    },
    categoryID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Categories",
        default: null,
    },
}, {
    timestamps: true,
});
exports.Drone = mongoose_1.default.model("Drone", droneSchema);
