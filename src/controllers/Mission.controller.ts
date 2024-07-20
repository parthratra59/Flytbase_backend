import { Request, Response } from "express";
import mongoose from "mongoose";
import ApiError from "../utils/apiError";
import { AuthRequest } from "../utils/Authrequest";
import { Drone } from "../models/Drones.model";
import { Sites } from "../models/Site.model";
import { Mission } from "../models/Mission.model";
import ApiResponse from "../utils/apiResponse";
import { Category } from "../models/Categories.model";

export const addMission = async (req: AuthRequest, res: Response) => {
  try {
    const { alt, speed, name, waypoints, siteID, droneID } = req.body;

    // Check if all required fields are provided
    if (!alt || !speed || !name || !waypoints || !siteID || !droneID) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "All fields are required like alt , speed , name, waypoints, siteID, droneID"
          )
        );
    }

    const existingName = await Mission.findOne({ name: name });
    if (existingName) {
      return res
        .status(400)
        .json(new ApiError(400, "Mission name already exists"));
    }

    // Check if the provided site ID is valid
    const site = await Sites.findById({
      _id: siteID,
    });
    if (!site) {
      return res.status(400).json(new ApiError(400, "Invalid Site ID"));
    }

    // Check if the provided drone ID is valid and if the drone is assigned to the same site
    const drone = await Drone.findOne({
      _id: droneID,
      siteID: siteID,
    });
    if (!drone) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "Invalid drone or drone not assigned to the same site"
          )
        );
    }

    // Create a new mission
    const mission = new Mission({
      alt,
      speed,
      name,
      waypoints,
      siteID: siteID,
      droneID: droneID,
      userID: req.insertprop?._id,
    });
    // Save the new mission
    await mission.save();

    const addingmissioninSiteModel = await Sites.findByIdAndUpdate(
      {
        _id: siteID,
        userID: req.insertprop?._id,
      },
      {
        $addToSet: { missions: mission._id },
      },
      {
        new: true,
      }
    );

    if (!addingmissioninSiteModel) {
      return res
        .status(400)
        .json(new ApiError(400, "Failed to add mission to site"));
    }

    const addingmissioninDroneModel = await Drone.findByIdAndUpdate(
      {
        _id: droneID,
        userID: req.insertprop?._id,
      },
      {
        $set: { missionID: mission._id },
      },
      {
        new: true,
      }
    );

    if (!addingmissioninDroneModel) {
      return res
        .status(400)
        .json(new ApiError(400, "Failed to add mission to drone"));
    }

    return res
      .status(201)
      .json(new ApiResponse(201, mission, "Mission added successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Failed to add mission"));
  }
};

export const getMissionsBySiteID = async (req: Request, res: Response) => {
  try {
    const { sID } = req.params;
    const { page, limit } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 5;

    const skip = (pageNumber - 1) * limitNumber;

    const retrieved_missions = await Mission.aggregate([
      {
        $match: {
          siteID: new mongoose.Types.ObjectId(sID),
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
        .json(new ApiError(404, "No missions found for the given site ID"));
    }

    const totalMissions = await Mission.countDocuments({ siteID: sID });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          retrieved_missions,
          totalMissions,
          currentPage: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(totalMissions / limitNumber),
        },
        "Missions retrieved successfully"
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to get missions by site ID"));
  }
};
export const updateMission = async (req: AuthRequest, res: Response) => {
  try {
    // for changing the siteId there is one middlwware we are not suppose to change the mission
    const { mID } = req.params;
    const updateFields = req.body;

    const updatedMission = await Mission.findByIdAndUpdate(
      {
        _id: mID,
        userID: req.insertprop?._id,
      },
      {
        $set: updateFields,
      },
      {
        new: true,
      }
    );

    if (!updatedMission) {
      return res
        .status(404)
        .json(new ApiError(404, "No mission found with the given ID"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedMission, "Mission updated successfully")
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Failed to update mission"));
  }
};

export const deleteMission = async (req: AuthRequest, res: Response) => {
  try {
    const { mID } = req.params;
    if (!mID) {
      return res.status(400).json(new ApiError(400, "mID is required"));
    }

    const mission = await Mission.findOneAndDelete({ _id: mID });
    if (!mission) {
      return res.status(404).json(new ApiError(404, "Mission not found"));
    }

    await Category.findByIdAndUpdate(
      mission.categoryID,
      { $pull: { missions: mID } },
      { new: true }
    );

    // Remove the mission ID from the drone's missionID field
    await Drone.findByIdAndUpdate(
      mission.droneID,
      {
        $set: { missionID: null },
      },
      {
        new: true,
      }
    );

    // Remove the mission ID from the missions array in Sites
    await Sites.findByIdAndUpdate(
      mission.siteID,
      {
        $pull: { missions: mID },
      },
      {
        new: true,
      }
    );

    return res.status(200).json(  
      new ApiResponse(
        200,
        null,
        "Mission deleted successfully"
      )
    );
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Failed to delete mission"));
  }
};
