import { Request, Response } from "express";
import ApiError from "../utils/apiError";
import { Drone } from "../models/Drones.model";
import { User } from "../models/User.model";

import { AuthRequest, checkUser } from "../utils/Authrequest";
import { Sites } from "../models/Site.model";
import ApiResponse from "../utils/apiResponse";

export const addDrone = async (req: AuthRequest, res: Response) => {
  try {
    const { droneID, drone_type, make_name, name } = req.body;

    if (!droneID || !drone_type || !make_name || !name) {
      res
        .status(400)
        .json(
          new ApiError(
            400,
            "All fields are required and droneID,drone_type,make_name,name"
          )
        );
    }

    // Check if a drone with the same unique fields already exists
    const existingDrone = await Drone.findOne({ droneID });

    if (existingDrone) {
      return res
        .status(400)
        .json(new ApiError(400, "Drone with the same ID already exists"));
    }

    // now we use the .save method to save the drone information to the database
    const newdrone = new Drone({
      droneID,
      drone_type,
      make_name,
      name,
      userID: req.insertprop?._id,
    });
    await newdrone.save();

    // we do this thing also $push :{
    //  drones:drone_id
    // }
    // but there could be the chanches of duplicate
    await User.findByIdAndUpdate(
      {
        _id: req.insertprop?._id, // match the _id with the middleware id
      },
      { $addToSet: { drones: newdrone._id } }, // Add drone_id to drones array if not already present and Use $addToSet to prevent duplicates
      { new: true }
    );

    res
      .status(201)
      .json(new ApiResponse(201, newdrone, "Drones created successfully"));
  } catch (err) {
    res.status(500).json(new ApiError(500, "Failed to create Drone"));
  }
};

export const addSite_to_Drone = async (req: AuthRequest, res: Response) => {
  try {
    const { dID } = req.params;
    const { siteID } = req.body;

    if (!siteID) {
      return res.status(400).json(new ApiError(400, "Site ID is required"));
    }

    const existingDrone = await Drone.findById({ _id: dID });
    if (!existingDrone) {
      return res.status(404).json(new ApiError(404, "Drone not found"));
    }

    const existingSite = await Sites.findById({ _id: siteID });
    if (!existingSite) {
      return res.status(404).json(new ApiError(404, "Site not found"));
    }

    // Add the site to the drone's drones array
    const addSite = await Drone.findByIdAndUpdate(
      {
        _id: dID,
      },
      { $set: { siteID: siteID } },
      { new: true }
    );

    await Sites.findByIdAndUpdate(
      {
        _id: siteID,
      },
      { $addToSet: { drones: dID } },
      { new: true }
    );

    res
      .status(200)
      .json(new ApiResponse(200, addSite, "Site added to drone successfully"));
  } catch (err) {
    res.status(500).json(new ApiError(500, "Failed to add site to drone"));
  }
};

export const updateDronebyID = async (req: AuthRequest, res: Response) => {
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
        .json(
          new ApiError(
            403,
            "You are not allowed to update drone_id, user_id or siteID"
          )
        );
    }

    const updatedDrone = await Drone.findByIdAndUpdate(
      {
        _id: dID,
        // user_id is same ObjectId which was generated by mongoDB at the time model creation
        user_id: req.insertprop?._id,
      },

      {
        $set: updateData,
      },

      {
        new: true,
      }
    );

    if (!updatedDrone) {
      return res.status(404).json(new ApiError(404, "Drone not found"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, updatedDrone, "Drone updated successfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Failed to update drone"));
  }
};

export const DeleteDroneById = async (req: AuthRequest, res: Response) => {
  try {
    const { dID } = req.params;

    // Find and delete the drone from the Drone model
    const deletedDrone = await Drone.findByIdAndDelete(
      {
        _id: dID,
        user_id: req.insertprop?._id, // match the _id with the middleware id
      },
      {
        $set: {
          deleted_by: req.insertprop?._id,
          deleted_on: new Date(),
        },
      }
    );

    if (!deletedDrone) {
      return res.status(404).json(new ApiError(404, "Drone not found"));
    }

    // Remove the drone reference from the user's drones array
    await User.updateOne(
      {
        _id: req.insertprop?._id,
      },
      {
        $pull: { drones: deletedDrone._id }, // Remove object _id of drone from drones array which are provided by the Drone mongoDB model
      }
    );

    await Sites.updateOne(
      {
        _id: deletedDrone.siteID,
      },
      {
        $pull: { drones: deletedDrone._id }, // Remove object _id of drone from drones array which are provided by the Drone mongoDB model
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Drone deleted successfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Failed to delete Drone"));
  }
};

// get all Drones there is no need of id which is coming form the middleware

export const getAllDrones = async (req: AuthRequest, res: Response) => {
  try {
    // const drones = await Drone.find();
    // i am using the aggregation pipeline

    const { page, limit } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 5;
    const skip = (pageNumber - 1) * limitNumber;

    const drones = await Drone.aggregate([
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

    const totalDrones = await Drone.countDocuments();

    if (!drones) {
      return res.status(404).json(new ApiError(404, "No drones found"));
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          drones,
          totalDrones,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(totalDrones / limitNumber),
        },
        "All drones retrieved"
      )
    );
  } catch (error) {
    res.status(500).json(new ApiError(500, "Failed to get all drones"));
  }
};

// move site of drone
export const moveSiteofDrone = async (req: AuthRequest, res: Response) => {
  try {
    const { dID } = req.params;
    const { newSiteID } = req.body;
    if (!newSiteID) {
      return res.status(400).json(new ApiError(400, "newSiteID are required"));
    }

    const drone = await Drone.findById(dID);
    if (!drone) {
      return res.status(404).json(new ApiError(404, "Drone not found"));
    }
    // Find the new site
    const newSite = await Sites.findById(newSiteID);
    if (!newSite) {
      return res.status(404).json(new ApiError(404, "New site not found"));
    }

    const updatedDrone = await Drone.findByIdAndUpdate(
      {
        _id: dID,
        user_id: req.insertprop?._id, // btw no need to pass this
      },
      {
        $set: {
          siteID: newSiteID,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedDrone) {
      return res.status(404).json(new ApiError(404, "Failed to update drone"));
    }

    // add drone to new site array
    await Sites.findByIdAndUpdate(
      {
        _id: newSiteID,
      },
      {
        $addToSet: { drones: updatedDrone._id },
      },
      {
        new: true,
      }
    );

    // Remove drone from old site's drones array if the drone was previously in another site
    //   Comparing ObjectId objects: Directly comparing two ObjectId objects using === or !== may not work as expected because the comparison checks for reference equality rather than value equality.
    //   String representation: Converting ObjectId objects to their string representations using toString() allows you to compare their values correctly.

    if (drone.siteID && drone.siteID.toString() !== newSiteID.toString()) {
      await Sites.findByIdAndUpdate(
        {
          _id: drone.siteID,
        },
        {
          $pull: { drones: updatedDrone._id },
        }
      );
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedDrone, "Drone site moved successfully")
      );
  } catch (error) {
    res.status(500).json(new ApiError(500, "Failed to move drone site"));
  }
};
