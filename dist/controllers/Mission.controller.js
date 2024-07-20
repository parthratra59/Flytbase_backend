"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMission = exports.updateMission = exports.getMissionsBySiteID = exports.addMission = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const Drones_model_1 = require("../models/Drones.model");
const Site_model_1 = require("../models/Site.model");
const Mission_model_1 = require("../models/Mission.model");
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const Categories_model_1 = require("../models/Categories.model");
const addMission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { alt, speed, name, waypoints, siteID, droneID } = req.body;
        // Check if all required fields are provided
        if (!alt || !speed || !name || !waypoints || !siteID || !droneID) {
            return res
                .status(400)
                .json(new apiError_1.default(400, "All fields are required like alt , speed , name, waypoints, siteID, droneID"));
        }
        const existingName = yield Mission_model_1.Mission.findOne({ name: name });
        if (existingName) {
            return res
                .status(400)
                .json(new apiError_1.default(400, "Mission name already exists"));
        }
        // Check if the provided site ID is valid
        const site = yield Site_model_1.Sites.findById({
            _id: siteID,
        });
        if (!site) {
            return res.status(400).json(new apiError_1.default(400, "Invalid Site ID"));
        }
        // Check if the provided drone ID is valid and if the drone is assigned to the same site
        const drone = yield Drones_model_1.Drone.findOne({
            _id: droneID,
            siteID: siteID,
        });
        if (!drone) {
            return res
                .status(400)
                .json(new apiError_1.default(400, "Invalid drone or drone not assigned to the same site"));
        }
        // Create a new mission
        const mission = new Mission_model_1.Mission({
            alt,
            speed,
            name,
            waypoints,
            siteID: siteID,
            droneID: droneID,
            userID: (_a = req.insertprop) === null || _a === void 0 ? void 0 : _a._id,
        });
        // Save the new mission
        yield mission.save();
        const addingmissioninSiteModel = yield Site_model_1.Sites.findByIdAndUpdate({
            _id: siteID,
            userID: (_b = req.insertprop) === null || _b === void 0 ? void 0 : _b._id,
        }, {
            $addToSet: { missions: mission._id },
        }, {
            new: true,
        });
        if (!addingmissioninSiteModel) {
            return res
                .status(400)
                .json(new apiError_1.default(400, "Failed to add mission to site"));
        }
        const addingmissioninDroneModel = yield Drones_model_1.Drone.findByIdAndUpdate({
            _id: droneID,
            userID: (_c = req.insertprop) === null || _c === void 0 ? void 0 : _c._id,
        }, {
            $set: { missionID: mission._id },
        }, {
            new: true,
        });
        if (!addingmissioninDroneModel) {
            return res
                .status(400)
                .json(new apiError_1.default(400, "Failed to add mission to drone"));
        }
        return res
            .status(201)
            .json(new apiResponse_1.default(201, mission, "Mission added successfully"));
    }
    catch (error) {
        return res.status(500).json(new apiError_1.default(500, "Failed to add mission"));
    }
});
exports.addMission = addMission;
const getMissionsBySiteID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sID } = req.params;
        const { page, limit } = req.query;
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 5;
        const skip = (pageNumber - 1) * limitNumber;
        const retrieved_missions = yield Mission_model_1.Mission.aggregate([
            {
                $match: {
                    siteID: new mongoose_1.default.Types.ObjectId(sID),
                },
            },
            { $skip: skip },
            { $limit: limitNumber },
            {
                $project: {
                    _id: 1,
                    alt: 1,
                    speed: 1,
                    name: 1,
                    waypoints: 1,
                    droneID: 1,
                    siteID: 1,
                    userID: 1,
                    category: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ]);
        if (retrieved_missions.length === 0) {
            return res
                .status(404)
                .json(new apiError_1.default(404, "No missions found for the given site ID"));
        }
        const totalMissions = yield Mission_model_1.Mission.countDocuments({ siteID: sID });
        return res.status(200).json(new apiResponse_1.default(200, {
            retrieved_missions,
            totalMissions,
            currentPage: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(totalMissions / limitNumber),
        }, "Missions retrieved successfully"));
    }
    catch (error) {
        return res
            .status(500)
            .json(new apiError_1.default(500, "Failed to get missions by site ID"));
    }
});
exports.getMissionsBySiteID = getMissionsBySiteID;
const updateMission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // for changing the siteId there is one middlwware we are not suppose to change the mission
        const { mID } = req.params;
        const updateFields = req.body;
        const updatedMission = yield Mission_model_1.Mission.findByIdAndUpdate({
            _id: mID,
            userID: (_a = req.insertprop) === null || _a === void 0 ? void 0 : _a._id,
        }, {
            $set: updateFields,
        }, {
            new: true,
        });
        if (!updatedMission) {
            return res
                .status(404)
                .json(new apiError_1.default(404, "No mission found with the given ID"));
        }
        return res
            .status(200)
            .json(new apiResponse_1.default(200, updatedMission, "Mission updated successfully"));
    }
    catch (error) {
        return res.status(500).json(new apiError_1.default(500, "Failed to update mission"));
    }
});
exports.updateMission = updateMission;
const deleteMission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mID } = req.params;
        if (!mID) {
            return res.status(400).json(new apiError_1.default(400, "mID is required"));
        }
        const mission = yield Mission_model_1.Mission.findOneAndDelete({ _id: mID });
        if (!mission) {
            return res.status(404).json(new apiError_1.default(404, "Mission not found"));
        }
        yield Categories_model_1.Category.findByIdAndUpdate(mission.categoryID, { $pull: { missions: mID } }, { new: true });
        // Remove the mission ID from the drone's missionID field
        yield Drones_model_1.Drone.findByIdAndUpdate(mission.droneID, {
            $set: { missionID: null },
        }, {
            new: true,
        });
        // Remove the mission ID from the missions array in Sites
        yield Site_model_1.Sites.findByIdAndUpdate(mission.siteID, {
            $pull: { missions: mID },
        }, {
            new: true,
        });
        return res.status(200).json(new apiResponse_1.default(200, null, "Mission deleted successfully"));
    }
    catch (error) {
        return res.status(500).json(new apiError_1.default(500, "Failed to delete mission"));
    }
});
exports.deleteMission = deleteMission;
