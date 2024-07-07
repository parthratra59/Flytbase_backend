import { Request, Response } from "express";
import { Sites } from "../models/Site.model";
import { AuthRequest } from "../utils/Authrequest";
import ApiResponse from "../utils/apiResponse";
import { Drone } from "../models/Drones.model";
import { checkUser } from "../utils/Authrequest";
import ApiError from "../utils/apiError";
export const createSite = async (req: AuthRequest, res: Response) => {
  try {
    const { site_name, position } = req.body;

    if (!site_name || !position || !position.latitude || !position.longitude) {
      throw new ApiError(400, "Missing required fields");
    }

    if (site_name) {
      const existingSite = await Sites.findOne({ site_name });
      if (existingSite) {
        return res
         .status(409)
         .json(new ApiError(409,  "Site already exists"));
      }
    }

    const site = new Sites({
      site_name,
      position,
    });

    await site.save();

    return res
      .status(201)
      .json(new ApiResponse(201, site, "Site created successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Failed to create site"));
  }
};

export const getDronesBySiteName = async (req: Request, res: Response) => {
  try {
    const { site_name } = req.query;
    if (!site_name) {
      return res.status(404).json({
        status: 404,
        message: "Site name is required",
      });
    }

    const sites = await Sites.find({
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
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Failed to fetch sites"));
  }
};

export const updateSiteByName = async (req: Request, res: Response) => {
  try {
    const { site_name } = req.query;
    const updateData = req.body;
    if (!site_name) {
      return res.status(400).json(new ApiError(400, "Site name is required"));
    }

    const updatedSite = await Sites.findOneAndUpdate(
      { site_name: { $regex: site_name as string, $options: "i" } },

      { $set: updateData },
      { new: true }
    );

    if (!updatedSite) {
      return res
        .status(404)
        .json(new ApiError(404, "No site found with the given name"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedSite, "Site updated successfully"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiError(500, "Failed to update site name"));
  }
};

export const deleteSiteByID = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;

    await Sites.findByIdAndDelete({
      _id: _id,
    });

    // delete the SiteId from the Drones who have this site that's why we are using updateMany
    await Drone.updateMany({ siteID: _id }, { $set: { siteID: null } });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Site and associated drones deleted successfully"
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Failed to delete sites"));
  }
};
