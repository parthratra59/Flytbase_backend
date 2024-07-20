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

      return res.status(404).json(
        new ApiError(400, "Missing required fields: site_name, position.latitude, position.longitude")
      )
    }

    if (site_name) {
      const existingSite = await Sites.findOne({ site_name });
      if (existingSite) {
        return res.status(409).json(new ApiError(409, "Site already exists"));
      }
    }

    const site = new Sites({
      site_name,
      position,
      userID: req.insertprop?._id,
    });

    await site.save();

    return res
      .status(201)
      .json(new ApiResponse(201, site, "Site created successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Failed to create site"));
  }
};

export const getDronesBySiteName = async (req: AuthRequest, res: Response) => {
  try {
    
    const { site_name } = req.query;

   
    const { page , limit } = req.query;
    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 5) || 5;
    const skip = (pageNumber - 1) * limitNumber;

    if (!site_name) {
      return res.status(404).json({
        status: 404,
        message: "Site name is required",
      });
    }

    const sites = await Sites.aggregate([
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
        .json(new ApiError(404, "No site found with the given name"));
    }

    const totalDrones = await Drone.countDocuments();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            sites,
            totalDrones,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(totalDrones / limitNumber),
          },
          "Sites fetched successfully"
        )
      );
  } catch (error) {
   
    return res.status(500).json(new ApiError(500, "Failed to fetch sites"));
  }
};

export const updateSiteByName = async (req: AuthRequest, res: Response) => {
  try {
    // it is unique in the database that's why i am not taking _id i am taking site_name
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
   
    return res
      .status(500)
      .json(new ApiError(500, "Failed to update site name"));
  }
};

export const deleteSiteByID = async (req: Request, res: Response) => {
  try {
    const { sID } = req.params;

    await Sites.findByIdAndDelete({
      _id: sID,
    });

    // delete the SiteId from the Drones who have this site that's why we are using updateMany
    // don't consider this like an an array it is deleted from the whole database
    await Drone.updateMany({ siteID: sID }, { $set: { siteID: null } });

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

// geeting api
// this -> i will deal with aggregation pipeline
// const sites = await Sites.find({
//   site_name: { $regex: site_name, $options: "i" },
// })
//   .populate("drones") // array which is in Site Model
//   .select("-position -_id -createdAt -updatedAt");
