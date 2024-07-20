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
exports.Sites = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SitesSchema = new mongoose_1.Schema({
    site_name: { type: String, required: true, unique: true, index: true, trim: true },
    position: {
        latitude: {
            type: Number,
            trim: true,
            required: true,
            min: -90,
            max: 90,
        },
        longitude: {
            type: Number,
            trim: true,
            required: true,
            min: -180,
            max: 180,
        },
    },
    drones: [{ type: mongoose_1.default.Schema.ObjectId, ref: "Drone", default: null }],
    missions: [{ type: mongoose_1.default.Schema.ObjectId, ref: "Missions", default: null }],
    userID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {
    timestamps: true,
});
exports.Sites = mongoose_1.default.model("Site", SitesSchema);
