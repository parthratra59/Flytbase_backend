var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Sites } from "../models/Site.model";
import ApiResponse from "../utils/apiResponse";
import { Drone } from "../models/Drones.model";
import ApiError from "../utils/apiError";
export const createSite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { site_name, position } = req.body;
        if (!site_name || !position || !position.latitude || !position.longitude) {
            throw new ApiError(400, "Missing required fields");
        }
        if (site_name) {
            const existingSite = yield Sites.findOne({ site_name });
            if (existingSite) {
                return res
                    .status(409)
                    .json(new ApiError(409, "Site already exists"));
            }
        }
        const site = new Sites({
            site_name,
            position,
        });
        yield site.save();
        return res
            .status(201)
            .json(new ApiResponse(201, site, "Site created successfully"));
    }
    catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to create site"));
    }
});
export const getDronesBySiteName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { site_name } = req.query;
        if (!site_name) {
            return res.status(404).json({
                status: 404,
                message: "Site name is required",
            });
        }
        const sites = yield Sites.find({
            site_name: { $regex: site_name, $options: "i" },
        })
            .populate("drones")
            .select("-position -_id -createdAt -updatedAt");
        if (!sites.length) {
            return res
                .status(404)
                .json(new ApiError(404, "No site found with the given name"));
        }
        return res.status(200).json({
            data: sites,
            message: "Sites fetched successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError(500, "Failed to fetch sites"));
    }
});
export const updateSiteByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { site_name } = req.query;
        const updateData = req.body;
        if (!site_name) {
            return res.status(400).json(new ApiError(400, "Site name is required"));
        }
        const updatedSite = yield Sites.findOneAndUpdate({ site_name: { $regex: site_name, $options: "i" } }, { $set: updateData }, { new: true });
        if (!updatedSite) {
            return res
                .status(404)
                .json(new ApiError(404, "No site found with the given name"));
        }
        return res
            .status(200)
            .json(new ApiResponse(200, updatedSite, "Site updated successfully"));
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json(new ApiError(500, "Failed to update site name"));
    }
});
export const deleteSiteByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        yield Sites.findByIdAndDelete({
            _id: _id,
        });
        // delete the SiteId from the Drones who have this site that's why we are using updateMany
        yield Drone.updateMany({ siteID: _id }, { $set: { siteID: null } });
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Site and associated drones deleted successfully"));
    }
    catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to delete sites"));
    }
});
