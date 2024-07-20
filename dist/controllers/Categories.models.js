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
exports.getDronesofCategoryID = exports.getMissionsofCategoryID = exports.deleteCategoryFromParticuarDrones = exports.deleteCategoryFromparticularMissions = exports.changeCategoryofDrones = exports.changeCategoryofMission = exports.updateCategory = exports.associateDroneWithCategory = exports.associateMissionWithCategory = exports.addcategory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const Drones_model_1 = require("../models/Drones.model");
const Categories_model_1 = require("../models/Categories.model");
const apiError_1 = __importDefault(require("../utils/apiError"));
const Mission_model_1 = require("../models/Mission.model");
const addcategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, color, tag_name } = req.body;
        const Name = yield Categories_model_1.Category.findOne({ name: name });
        if (Name) {
            return res
                .status(400)
                .json(new apiResponse_1.default(400, "Category with the same name already exists"));
        }
        const category = new Categories_model_1.Category({ name: name, color, tag_name });
        yield category.save();
        if (!category) {
            return res
                .status(400)
                .json(new apiResponse_1.default(400, "Failed to add category"));
        }
        return res
            .status(201)
            .json(new apiResponse_1.default(201, category, "Category created successfully"));
    }
    catch (error) {
        res.status(500).json(new apiError_1.default(500, "Failed to add category"));
    }
});
exports.addcategory = addcategory;
// associate mission with category
const associateMissionWithCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { categoryID } = req.params;
        const { missionID } = req.body;
        const category = yield Categories_model_1.Category.findById({
            _id: categoryID,
        });
        if (!category) {
            return res.status(404).json(new apiError_1.default(404, "Category not found"));
        }
        const associateCategory = yield Mission_model_1.Mission.findByIdAndUpdate({
            _id: missionID,
        }, { $set: { categoryID: categoryID } }, { new: true });
        if (!associateCategory) {
            return res.status(404).json(new apiError_1.default(404, "Mission not found"));
        }
        yield Categories_model_1.Category.findByIdAndUpdate({
            _id: categoryID,
        }, {
            $addToSet: { missions: missionID },
            $set: {
                userID: (_a = req.insertprop) === null || _a === void 0 ? void 0 : _a._id,
            },
        }, {
            new: true,
        });
        return res
            .status(200)
            .json(new apiResponse_1.default(200, associateCategory, "Mission associated with category successfully"));
    }
    catch (error) {
        res
            .status(500)
            .json(new apiError_1.default(500, "Failed to associate mission with category"));
    }
});
exports.associateMissionWithCategory = associateMissionWithCategory;
// associate drone with category
const associateDroneWithCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { categoryID } = req.params;
        const { droneID } = req.body;
        const user_id = (_a = req.insertprop) === null || _a === void 0 ? void 0 : _a._id;
        const category = yield Categories_model_1.Category.findById({
            _id: categoryID,
            user_id,
        });
        if (!category) {
            return res.status(404).json(new apiError_1.default(404, "Category not found"));
        }
        const associateCategory = yield Drones_model_1.Drone.findByIdAndUpdate({
            _id: droneID,
            user_id,
        }, { $set: { categoryID: categoryID, userID: (_b = req.insertprop) === null || _b === void 0 ? void 0 : _b._id } }, { new: true });
        if (!associateCategory) {
            return res.status(404).json(new apiError_1.default(404, "Drone not found"));
        }
        yield Categories_model_1.Category.findByIdAndUpdate({
            _id: categoryID,
            user_id,
        }, {
            $addToSet: { drones: droneID }, // there is an array that's why we are using addtoSet
            $set: {
                userID: (_c = req.insertprop) === null || _c === void 0 ? void 0 : _c._id, // here is a normal field that's why we are using set
            },
        }, { new: true });
        return res
            .status(200)
            .json(new apiResponse_1.default(200, associateCategory, "Category associated with Drone successfully"));
    }
    catch (error) {
        return res
            .status(500)
            .json(new apiError_1.default(500, "Failed to associate category with Drone"));
    }
});
exports.associateDroneWithCategory = associateDroneWithCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { categoryID } = req.params;
        const updateData = req.body;
        if (updateData.userID ||
            updateData.missions ||
            updateData.drones ||
            updateData.name) {
            return res
                .status(400)
                .json(new apiError_1.default(400, "Cannot update userID, missions, or drones or name"));
        }
        const updatedCategory = yield Categories_model_1.Category.findByIdAndUpdate({
            _id: categoryID,
            userID: (_a = req.insertprop) === null || _a === void 0 ? void 0 : _a._id,
        }, {
            $set: updateData,
        }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json(new apiError_1.default(404, "Category not found"));
        }
        res
            .status(200)
            .json(new apiResponse_1.default(200, updatedCategory, "Category updated successfully"));
    }
    catch (error) {
        res.status(500).json(new apiError_1.default(500, "Failed to update category"));
    }
});
exports.updateCategory = updateCategory;
const changeCategoryofMission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryID } = req.body;
        const { mID } = req.params;
        // Find the mission by ID
        const mission = yield Mission_model_1.Mission.findById(mID);
        if (!mission) {
            return res.status(404).json({ message: "Mission not found" });
        }
        // If the mission already belongs to a category, remove it from that category
        if (mission.categoryID) {
            yield Categories_model_1.Category.updateOne({ _id: mission.categoryID }, { $pull: { missions: mID } });
        }
        // Add the mission to the new category
        yield Categories_model_1.Category.updateOne({ _id: categoryID }, { $addToSet: { missions: mID } });
        // Update the mission's category
        const updatedMission = yield Mission_model_1.Mission.findByIdAndUpdate({
            _id: mID,
        }, { $set: { categoryID: categoryID } }, { new: true }).populate("categoryID");
        return res
            .status(200)
            .json(new apiResponse_1.default(200, updatedMission, "Category changed successfully for mission"));
    }
    catch (error) {
        return res
            .status(500)
            .json(new apiError_1.default(500, "Failed to change category of mission"));
    }
});
exports.changeCategoryofMission = changeCategoryofMission;
const changeCategoryofDrones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryID } = req.body;
        const { dID } = req.params;
        const drone = yield Drones_model_1.Drone.findById(dID);
        if (!drone) {
            return res.status(404).json(new apiError_1.default(404, "Drone not found"));
        }
        // If the drone already belongs to a category, remove it from that category
        if (drone.categoryID) {
            yield Categories_model_1.Category.updateOne({ _id: drone.categoryID }, { $pull: { drones: dID } });
        }
        // Add the drone to the new category
        yield Categories_model_1.Category.updateOne({ _id: categoryID }, { $addToSet: { drones: dID } });
        const updatedDrone = yield Drones_model_1.Drone.findByIdAndUpdate({
            _id: dID,
        }, { $set: { categoryID: categoryID } }, { new: true }).populate("categoryID");
        return res
            .status(200)
            .json(new apiResponse_1.default(200, updatedDrone, "Category updated successfully for drone"));
    }
    catch (error) {
        return res
            .status(500)
            .json(new apiError_1.default(500, "Failed to change category of drone"));
    }
});
exports.changeCategoryofDrones = changeCategoryofDrones;
const deleteCategoryFromparticularMissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { categoryID } = req.params;
        const { missionID } = req.body;
        const user_id = (_a = req.insertprop) === null || _a === void 0 ? void 0 : _a._id;
        const category = yield Categories_model_1.Category.findOne({
            _id: categoryID,
            userID: user_id,
        });
        if (!category) {
            return res.status(404).json(new apiError_1.default(404, "Category not found"));
        }
        // Remove the category reference from the mission
        const mission = yield Mission_model_1.Mission.findByIdAndUpdate({
            _id: missionID,
        }, { $set: { categoryID: null } }, { new: true });
        if (!mission) {
            return res.status(404).json(new apiError_1.default(404, "Mission not found"));
        }
        // Remove the mission ID from the category's missions array
        yield Categories_model_1.Category.findByIdAndUpdate({
            _id: categoryID,
        }, { $pull: { missions: missionID } }, { new: true });
        return res
            .status(200)
            .json(new apiResponse_1.default(200, "Mission removed from category successfully"));
    }
    catch (error) {
        return res
            .status(500)
            .json(new apiError_1.default(500, "Failed to remove mission from category"));
    }
});
exports.deleteCategoryFromparticularMissions = deleteCategoryFromparticularMissions;
const deleteCategoryFromParticuarDrones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { categoryID } = req.params;
        const { droneID } = req.body;
        const user_id = (_a = req.insertprop) === null || _a === void 0 ? void 0 : _a._id;
        const category = yield Categories_model_1.Category.findOne({
            _id: categoryID,
            userID: user_id,
        });
        if (!category) {
            return res.status(404).json(new apiError_1.default(404, "Category not found"));
        }
        // Remove the category reference from all Drones associated with it
        const drone = yield Drones_model_1.Drone.findByIdAndUpdate({
            _id: droneID,
        }, {
            $set: {
                categoryID: null,
            },
        }, {
            new: true,
        });
        if (!drone) {
            return res.status(404).json(new apiError_1.default(404, "Drone not found"));
        }
        yield Categories_model_1.Category.findByIdAndUpdate({
            _id: categoryID,
            user_id,
        }, {
            $pull: { drones: droneID },
        });
        return res
            .status(200)
            .json(new apiResponse_1.default(200, null, "Category deleted successfully from Drones"));
    }
    catch (error) {
        return res
            .status(500)
            .json(new apiError_1.default(500, "Failed to delete category from Drones"));
    }
});
exports.deleteCategoryFromParticuarDrones = deleteCategoryFromParticuarDrones;
const getMissionsofCategoryID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryID } = req.params;
        const { page, limit } = req.query;
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 5) || 5;
        const skip = (pageNumber - 1) * limitNumber;
        const categoryObjectId = new mongoose_1.default.Types.ObjectId(categoryID);
        const getMissions = yield Categories_model_1.Category.aggregate([
            { $match: { _id: categoryObjectId } },
            {
                $lookup: {
                    from: "missions", // The collection name of missions
                    localField: "missions",
                    foreignField: "_id",
                    as: "mission_fields",
                },
            },
            // { $unwind: "$mission_fields" },   To deconstruct an array field and produce a separate document for each element.
            { $skip: skip },
            { $limit: limitNumber },
            {
                $project: {
                    _id: 0, //category _id excluded
                    mission: "$mission_fields",
                },
            },
        ]);
        // Check if the category was found and missions were retrieved
        if (!getMissions || getMissions.length === 0) {
            return res
                .status(404)
                .json(new apiError_1.default(404, "Category not found or no missions available"));
        }
        const totalMissions = yield Mission_model_1.Mission.countDocuments({
            categoryID: categoryObjectId,
        });
        res.status(200).json(new apiResponse_1.default(200, {
            getMissions,
            totalMissions,
            totalPages: Math.ceil(totalMissions / limitNumber),
            currentPage: pageNumber,
            limit: limitNumber,
        }, "Missions retrieved successfully"));
    }
    catch (error) {
        return res
            .status(500)
            .json(new apiError_1.default(500, "Failed to get missions of a category"));
    }
});
exports.getMissionsofCategoryID = getMissionsofCategoryID;
const getDronesofCategoryID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryID } = req.params;
        const { page, limit } = req.query;
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 5) || 5;
        const skip = (pageNumber - 1) * limitNumber;
        const categoryObjectId = new mongoose_1.default.Types.ObjectId(categoryID);
        const getDrones = yield Categories_model_1.Category.aggregate([
            { $match: { _id: categoryObjectId } },
            {
                $lookup: {
                    from: "drones", // The collection name of drones
                    localField: "drones",
                    foreignField: "_id",
                    as: "drone_fields",
                },
            },
            { $skip: skip },
            { $limit: limitNumber },
            {
                $project: {
                    _id: 0, // Exclude category _id
                    drone: "$drone_fields",
                },
            },
        ]);
        // Check if the category was found and drones were retrieved
        if (!getDrones || getDrones.length === 0) {
            return res
                .status(404)
                .json(new apiError_1.default(404, "Category not found or no drones available"));
        }
        const totalDrones = yield Drones_model_1.Drone.countDocuments({
            categoryID: categoryObjectId,
        });
        res.status(200).json(new apiResponse_1.default(200, {
            getDrones,
            totalDrones,
            totalPages: Math.ceil(totalDrones / limitNumber),
            currentPage: pageNumber,
            limit: limitNumber,
        }, "Drones retrieved successfully"));
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json(new apiError_1.default(500, "Failed to get drones of a category"));
    }
});
exports.getDronesofCategoryID = getDronesofCategoryID;
