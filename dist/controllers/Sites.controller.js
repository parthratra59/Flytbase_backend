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
exports.deleteSiteByID = exports.updateSiteByName = exports.getDronesBySiteName = exports.createSite = void 0;
const Site_model_1 = require("../models/Site.model");
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const Drones_model_1 = require("../models/Drones.model");
const apiError_1 = __importDefault(require("../utils/apiError"));
const createSite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { site_name, position } = req.body;
        if (!site_name || !position || !position.latitude || !position.longitude) {
            return res.status(404).json(new apiError_1.default(400, "Missing required fields: site_name, position.latitude, position.longitude"));
        }
        if (site_name) {
            const existingSite = yield Site_model_1.Sites.findOne({ site_name });
            if (existingSite) {
                return res.status(409).json(new apiError_1.default(409, "Site already exists"));
            }
        }
        const site = new Site_model_1.Sites({
            site_name,
            position,
            userID: (_a = req.insertprop) === null || _a === void 0 ? void 0 : _a._id,
        });
        yield site.save();
        return res
            .status(201)
            .json(new apiResponse_1.default(201, site, "Site created successfully"));
    }
    catch (error) {
        return res.status(500).json(new apiError_1.default(500, "Failed to create site"));
    }
});
exports.createSite = createSite;
const getDronesBySiteName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { site_name } = req.query;
        const { page, limit } = req.query;
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 5) || 5;
        const skip = (pageNumber - 1) * limitNumber;
        if (!site_name) {
            return res.status(404).json({
                status: 404,
                message: "Site name is required",
            });
        }
        const sites = yield Site_model_1.Sites.aggregate([
            {
                $match: { site_name: { $regex: site_name, $options: "i" } },
            },
            {
                // now we will apply lookup for left join and Usage: $lookup is essential for scenarios where you need to enrich your query results with details from referenced collections, such as populating arrays of references or performing joins across MongoDB collections.
                // lookup returns an array here it will return Drone_field array
                $lookup: {
                    from: "drones", // Collection name where drones are stored (from where to take the reference)
                    localField: "drones", // Field in the Sites collection (left side)
                    foreignField: "_id", // Field in the Drone collection (right side)
                    as: "Drone_field", // Name of the new field to add to the input documents
                },
            },
            { $skip: skip },
            { $limit: limitNumber },
            { $project: { position: 0, _id: 0, createdAt: 0, updatedAt: 0 } },
        ]);
        // because it is an array that's why we can use .length
        if (!sites.length) {
            return res
                .status(404)
                .json(new apiError_1.default(404, "No site found with the given name"));
        }
        const totalDrones = yield Drones_model_1.Drone.countDocuments();
        return res
            .status(200)
            .json(new apiResponse_1.default(200, {
            sites,
            totalDrones,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(totalDrones / limitNumber),
        }, "Sites fetched successfully"));
    }
    catch (error) {
        return res.status(500).json(new apiError_1.default(500, "Failed to fetch sites"));
    }
});
exports.getDronesBySiteName = getDronesBySiteName;
const updateSiteByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // it is unique in the database that's why i am not taking _id i am taking site_name
        const { site_name } = req.query;
        const updateData = req.body;
        if (!site_name) {
            return res.status(400).json(new apiError_1.default(400, "Site name is required"));
        }
        const updatedSite = yield Site_model_1.Sites.findOneAndUpdate({ site_name: { $regex: site_name, $options: "i" } }, { $set: updateData }, { new: true });
        if (!updatedSite) {
            return res
                .status(404)
                .json(new apiError_1.default(404, "No site found with the given name"));
        }
        return res
            .status(200)
            .json(new apiResponse_1.default(200, updatedSite, "Site updated successfully"));
    }
    catch (error) {
        return res
            .status(500)
            .json(new apiError_1.default(500, "Failed to update site name"));
    }
});
exports.updateSiteByName = updateSiteByName;
const deleteSiteByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sID } = req.params;
        yield Site_model_1.Sites.findByIdAndDelete({
            _id: sID,
        });
        // delete the SiteId from the Drones who have this site that's why we are using updateMany
        // don't consider this like an an array it is deleted from the whole database
        yield Drones_model_1.Drone.updateMany({ siteID: sID }, { $set: { siteID: null } });
        return res
            .status(200)
            .json(new apiResponse_1.default(200, null, "Site and associated drones deleted successfully"));
    }
    catch (error) {
        return res.status(500).json(new apiError_1.default(500, "Failed to delete sites"));
    }
});
exports.deleteSiteByID = deleteSiteByID;
// geeting api
// this -> i will deal with aggregation pipeline
// const sites = await Sites.find({
//   site_name: { $regex: site_name, $options: "i" },
// })
//   .populate("drones") // array which is in Site Model
//   .select("-position -_id -createdAt -updatedAt");
