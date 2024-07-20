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
exports.moveSiteofDrone = exports.getAllDrones = exports.DeleteDroneById = exports.updateDronebyID = exports.addSite_to_Drone = exports.addDrone = void 0;
const apiError_1 = __importDefault(require("../utils/apiError"));
const Drones_model_1 = require("../models/Drones.model");
const User_model_1 = require("../models/User.model");
const Site_model_1 = require("../models/Site.model");
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const addDrone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { droneID, drone_type, make_name, name } = req.body;
        if (!droneID || !drone_type || !make_name || !name) {
            res
                .status(400)
                .json(new apiError_1.default(400, "All fields are required and droneID,drone_type,make_name,name"));
        }
        // Check if a drone with the same unique fields already exists
        const existingDrone = yield Drones_model_1.Drone.findOne({ droneID });
        if (existingDrone) {
            return res
                .status(400)
                .json(new apiError_1.default(400, "Drone with the same ID already exists"));
        }
        // now we use the .save method to save the drone information to the database
        const newdrone = new Drones_model_1.Drone({
            droneID,
            drone_type,
            make_name,
            name,
            userID: (_a = req.insertprop) === null || _a === void 0 ? void 0 : _a._id,
        });
        yield newdrone.save();
        // we do this thing also $push :{
        //  drones:drone_id
        // }
        // but there could be the chanches of duplicate
        yield User_model_1.User.findByIdAndUpdate({
            _id: (_b = req.insertprop) === null || _b === void 0 ? void 0 : _b._id, // match the _id with the middleware id
        }, { $addToSet: { drones: newdrone._id } }, // Add drone_id to drones array if not already present and Use $addToSet to prevent duplicates
        { new: true });
        res
            .status(201)
            .json(new apiResponse_1.default(201, newdrone, "Drones created successfully"));
    }
    catch (err) {
        res.status(500).json(new apiError_1.default(500, "Failed to create Drone"));
    }
});
exports.addDrone = addDrone;
const addSite_to_Drone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { dID } = req.params;
        const { siteID } = req.body;
        if (!siteID) {
            return res.status(400).json(new apiError_1.default(400, "Site ID is required"));
        }
        const existingDrone = yield Drones_model_1.Drone.findById({ _id: dID });
        if (!existingDrone) {
            return res.status(404).json(new apiError_1.default(404, "Drone not found"));
        }
        const existingSite = yield Site_model_1.Sites.findById({ _id: siteID });
        if (!existingSite) {
            return res.status(404).json(new apiError_1.default(404, "Site not found"));
        }
        // Add the site to the drone's drones array
        const addSite = yield Drones_model_1.Drone.findByIdAndUpdate({
            _id: dID,
        }, { $set: { siteID: siteID } }, { new: true });
        yield Site_model_1.Sites.findByIdAndUpdate({
            _id: siteID,
        }, { $addToSet: { drones: dID } }, { new: true });
        res
            .status(200)
            .json(new apiResponse_1.default(200, addSite, "Site added to drone successfully"));
    }
    catch (err) {
        res.status(500).json(new apiError_1.default(500, "Failed to add site to drone"));
    }
});
exports.addSite_to_Drone = addSite_to_Drone;
const updateDronebyID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // we can't use drone_id here because it is a string and in params we need a ObjectId
        // we can store also objectId in the starting drone_id but in ObjectId we need 24 24-character hexadecimal string
        // we we take ObjectId as the ObjectId in the DroneModel so we are using (_id) which is
        // autogenerated at the time of Model creation
        const { dID } = req.params;
        const updateData = req.body;
        if (updateData.siteID || updateData.user_id || updateData.droneID) {
            return res
                .status(403)
                .json(new apiError_1.default(403, "You are not allowed to update drone_id, user_id or siteID"));
        }
        const updatedDrone = yield Drones_model_1.Drone.findByIdAndUpdate({
            _id: dID,
            // user_id is same ObjectId which was generated by mongoDB at the time model creation
            user_id: (_a = req.insertprop) === null || _a === void 0 ? void 0 : _a._id,
        }, {
            $set: updateData,
        }, {
            new: true,
        });
        if (!updatedDrone) {
            return res.status(404).json(new apiError_1.default(404, "Drone not found"));
        }
        res
            .status(200)
            .json(new apiResponse_1.default(200, updatedDrone, "Drone updated successfully"));
    }
    catch (error) {
        res.status(500).json(new apiError_1.default(500, "Failed to update drone"));
    }
});
exports.updateDronebyID = updateDronebyID;
const DeleteDroneById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { dID } = req.params;
        // Find and delete the drone from the Drone model
        const deletedDrone = yield Drones_model_1.Drone.findByIdAndDelete({
            _id: dID,
            user_id: (_a = req.insertprop) === null || _a === void 0 ? void 0 : _a._id, // match the _id with the middleware id
        }, {
            $set: {
                deleted_by: (_b = req.insertprop) === null || _b === void 0 ? void 0 : _b._id,
                deleted_on: new Date(),
            },
        });
        if (!deletedDrone) {
            return res.status(404).json(new apiError_1.default(404, "Drone not found"));
        }
        // Remove the drone reference from the user's drones array
        yield User_model_1.User.updateOne({
            _id: (_c = req.insertprop) === null || _c === void 0 ? void 0 : _c._id,
        }, {
            $pull: { drones: deletedDrone._id }, // Remove object _id of drone from drones array which are provided by the Drone mongoDB model
        });
        yield Site_model_1.Sites.updateOne({
            _id: deletedDrone.siteID,
        }, {
            $pull: { drones: deletedDrone._id }, // Remove object _id of drone from drones array which are provided by the Drone mongoDB model
        }, {
            new: true,
        });
        return res
            .status(200)
            .json(new apiResponse_1.default(200, {}, "Drone deleted successfully"));
    }
    catch (error) {
        res.status(500).json(new apiError_1.default(500, "Failed to delete Drone"));
    }
});
exports.DeleteDroneById = DeleteDroneById;
// get all Drones there is no need of id which is coming form the middleware
const getAllDrones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const drones = await Drone.find();
        // i am using the aggregation pipeline
        const { page, limit } = req.query;
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 5;
        const skip = (pageNumber - 1) * limitNumber;
        const drones = yield Drones_model_1.Drone.aggregate([
            {
                $skip: skip, // initialy skip = 1-1 *5 = 0 no skip
            },
            {
                $limit: limitNumber,
            },
            {
                $sort: {
                    created_at: -1, // sort by created_at in descending order
                },
            },
        ]);
        const totalDrones = yield Drones_model_1.Drone.countDocuments();
        if (!drones) {
            return res.status(404).json(new apiError_1.default(404, "No drones found"));
        }
        return res.status(200).json(new apiResponse_1.default(200, {
            drones,
            totalDrones,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(totalDrones / limitNumber),
        }, "All drones retrieved"));
    }
    catch (error) {
        res.status(500).json(new apiError_1.default(500, "Failed to get all drones"));
    }
});
exports.getAllDrones = getAllDrones;
// move site of drone
const moveSiteofDrone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { dID } = req.params;
        const { newSiteID } = req.body;
        if (!newSiteID) {
            return res.status(400).json(new apiError_1.default(400, "newSiteID are required"));
        }
        const drone = yield Drones_model_1.Drone.findById(dID);
        if (!drone) {
            return res.status(404).json(new apiError_1.default(404, "Drone not found"));
        }
        // Find the new site
        const newSite = yield Site_model_1.Sites.findById(newSiteID);
        if (!newSite) {
            return res.status(404).json(new apiError_1.default(404, "New site not found"));
        }
        const updatedDrone = yield Drones_model_1.Drone.findByIdAndUpdate({
            _id: dID,
            user_id: (_a = req.insertprop) === null || _a === void 0 ? void 0 : _a._id, // btw no need to pass this
        }, {
            $set: {
                siteID: newSiteID,
            },
        }, {
            new: true,
        });
        if (!updatedDrone) {
            return res.status(404).json(new apiError_1.default(404, "Failed to update drone"));
        }
        // add drone to new site array
        yield Site_model_1.Sites.findByIdAndUpdate({
            _id: newSiteID,
        }, {
            $addToSet: { drones: updatedDrone._id },
        }, {
            new: true,
        });
        // Remove drone from old site's drones array if the drone was previously in another site
        //   Comparing ObjectId objects: Directly comparing two ObjectId objects using === or !== may not work as expected because the comparison checks for reference equality rather than value equality.
        //   String representation: Converting ObjectId objects to their string representations using toString() allows you to compare their values correctly.
        if (drone.siteID && drone.siteID.toString() !== newSiteID.toString()) {
            yield Site_model_1.Sites.findByIdAndUpdate({
                _id: drone.siteID,
            }, {
                $pull: { drones: updatedDrone._id },
            });
        }
        res
            .status(200)
            .json(new apiResponse_1.default(200, updatedDrone, "Drone site moved successfully"));
    }
    catch (error) {
        res.status(500).json(new apiError_1.default(500, "Failed to move drone site"));
    }
});
exports.moveSiteofDrone = moveSiteofDrone;
