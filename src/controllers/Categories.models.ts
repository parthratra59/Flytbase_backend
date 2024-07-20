import { Request, Response } from "express";
import mongoose from "mongoose";
import { Sites } from "../models/Site.model";
import { AuthRequest } from "../utils/Authrequest";
import ApiResponse from "../utils/apiResponse";
import { Drone } from "../models/Drones.model";
import { Category } from "../models/Categories.model";
import ApiError from "../utils/apiError";
import { Mission } from "../models/Mission.model";

export const addcategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, color, tag_name } = req.body;

    const Name = await Category.findOne({ name: name });
    if (Name) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, "Category with the same name already exists")
        );
    }

    const category = new Category({ name: name, color, tag_name });

    await category.save();
    if (!category) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Failed to add category"));
    }

    return res
      .status(201)
      .json(new ApiResponse(201, category, "Category created successfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Failed to add category"));
  }
};

// associate mission with category
export const associateMissionWithCategory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { categoryID } = req.params;

    const { missionID } = req.body;

    const category = await Category.findById({
      _id: categoryID,
    });

    if (!category) {
      return res.status(404).json(new ApiError(404, "Category not found"));
    }

    const associateCategory = await Mission.findByIdAndUpdate(
      {
        _id: missionID,
      },
      { $set: { categoryID: categoryID } },
      { new: true }
    );

    if (!associateCategory) {
      return res.status(404).json(new ApiError(404, "Mission not found"));
    }

    await Category.findByIdAndUpdate(
      {
        _id: categoryID,
      },
      {
        $addToSet: { missions: missionID },
        $set: {
          userID: req.insertprop?._id,
        },
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          associateCategory,
          "Mission associated with category successfully"
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Failed to associate mission with category"));
  }
};

// associate drone with category
export const associateDroneWithCategory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { categoryID } = req.params;
    const { droneID } = req.body;
    const user_id = req.insertprop?._id;

    const category = await Category.findById({
      _id: categoryID,
      user_id,
    });

    if (!category) {
      return res.status(404).json(new ApiError(404, "Category not found"));
    }

    const associateCategory = await Drone.findByIdAndUpdate(
      {
        _id: droneID,
        user_id,
      },
      { $set: { categoryID: categoryID, userID: req.insertprop?._id } },
      { new: true }
    );

    if (!associateCategory) {
      return res.status(404).json(new ApiError(404, "Drone not found"));
    }

    await Category.findByIdAndUpdate(
      {
        _id: categoryID,
        user_id,
      },
      {
        $addToSet: { drones: droneID }, // there is an array that's why we are using addtoSet
        $set: {
          userID: req.insertprop?._id, // here is a normal field that's why we are using set
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          associateCategory,
          "Category associated with Drone successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to associate category with Drone"));
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { categoryID } = req.params;
    const updateData = req.body;

    if (
      updateData.userID ||
      updateData.missions ||
      updateData.drones ||
      updateData.name
    ) {
      return res
        .status(400)
        .json(
          new ApiError(400, "Cannot update userID, missions, or drones or name")
        );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      {
        _id: categoryID,
        userID: req.insertprop?._id,
      },
      {
        $set: updateData,
      },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json(new ApiError(404, "Category not found"));
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedCategory, "Category updated successfully")
      );
  } catch (error) {
    res.status(500).json(new ApiError(500, "Failed to update category"));
  }
};

export const changeCategoryofMission = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { categoryID } = req.body;
    const { mID } = req.params;

    // Find the mission by ID
    const mission = await Mission.findById(mID);

    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }

    // If the mission already belongs to a category, remove it from that category
    if (mission.categoryID) {
      await Category.updateOne(
        { _id: mission.categoryID },
        { $pull: { missions: mID } }
      );
    }

    // Add the mission to the new category
    await Category.updateOne(
      { _id: categoryID },
      { $addToSet: { missions: mID } }
    );

    // Update the mission's category

    const updatedMission = await Mission.findByIdAndUpdate(
      {
        _id: mID,
      },
      { $set: { categoryID: categoryID } },
      { new: true }
    ).populate("categoryID");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedMission,
          "Category changed successfully for mission"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to change category of mission"));
  }
};
export const changeCategoryofDrones = async (req: Request, res: Response) => {
  try {
    const { categoryID } = req.body;
    const { dID } = req.params;
    const drone = await Drone.findById(dID);
    if (!drone) {
      return res.status(404).json(new ApiError(404, "Drone not found"));
    }

    // If the drone already belongs to a category, remove it from that category
    if (drone.categoryID) {
      await Category.updateOne(
        { _id: drone.categoryID },
        { $pull: { drones: dID } }
      );
    }

    // Add the drone to the new category
    await Category.updateOne(
      { _id: categoryID },
      { $addToSet: { drones: dID } }
    );
    const updatedDrone = await Drone.findByIdAndUpdate(
      {
        _id: dID,
      },
      { $set: { categoryID: categoryID } },
      { new: true }
    ).populate("categoryID");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedDrone,
          "Category updated successfully for drone"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to change category of drone"));
  }
};
export const deleteCategoryFromparticularMissions = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { categoryID } = req.params;
    const { missionID } = req.body;
    const user_id = req.insertprop?._id;

    const category = await Category.findOne({
      _id: categoryID,
      userID: user_id,
    });

    if (!category) {
      return res.status(404).json(new ApiError(404, "Category not found"));
    }

    // Remove the category reference from the mission
    const mission = await Mission.findByIdAndUpdate(
      {
        _id: missionID,
      },
      { $set: { categoryID: null } },
      { new: true }
    );

    if (!mission) {
      return res.status(404).json(new ApiError(404, "Mission not found"));
    }

    // Remove the mission ID from the category's missions array
    await Category.findByIdAndUpdate(
      {
        _id: categoryID,
      },
      { $pull: { missions: missionID } },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "Mission removed from category successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to remove mission from category"));
  }
};
export const deleteCategoryFromParticuarDrones = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { categoryID } = req.params;
    const { droneID } = req.body;
    const user_id = req.insertprop?._id;

    const category = await Category.findOne({
      _id: categoryID,
      userID: user_id,
    });

    if (!category) {
      return res.status(404).json(new ApiError(404, "Category not found"));
    }

    // Remove the category reference from all Drones associated with it

    const drone = await Drone.findByIdAndUpdate(
      {
        _id: droneID,
      },
      {
        $set: {
          categoryID: null,
        },
      },
      {
        new: true,
      }
    );

    if (!drone) {
      return res.status(404).json(new ApiError(404, "Drone not found"));
    }

    await Category.findByIdAndUpdate(
      {
        _id: categoryID,
        user_id,
      },
      {
        $pull: { drones: droneID },
      }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Category deleted successfully from Drones")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to delete category from Drones"));
  }
};

export const getMissionsofCategoryID = async (req: Request, res: Response) => {
  try {
    const { categoryID } = req.params;
    const { page, limit } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 5) || 5;
    const skip = (pageNumber - 1) * limitNumber;

    const categoryObjectId = new mongoose.Types.ObjectId(categoryID);

    const getMissions = await Category.aggregate([
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
          _id:0, //category _id excluded
          
          mission: "$mission_fields",
        },
      },
    ]);

    // Check if the category was found and missions were retrieved
    if (!getMissions || getMissions.length === 0) {
      return res
        .status(404)
        .json(new ApiError(404, "Category not found or no missions available"));
    }

    const totalMissions = await Mission.countDocuments({
      categoryID: categoryObjectId,
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          getMissions,
          totalMissions,
          totalPages: Math.ceil(totalMissions / limitNumber),
          currentPage: pageNumber,
          limit: limitNumber,
        },

        "Missions retrieved successfully"
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to get missions of a category"));
  }
};


export const getDronesofCategoryID = async (req: Request, res: Response) => {
  try {
    const { categoryID } = req.params;
    const { page, limit } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 5) || 5;
    const skip = (pageNumber - 1) * limitNumber;

    const categoryObjectId = new mongoose.Types.ObjectId(categoryID);

    const getDrones = await Category.aggregate([
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
        .json(new ApiError(404, "Category not found or no drones available"));
    }

    const totalDrones = await Drone.countDocuments({
      categoryID: categoryObjectId,
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          getDrones,
          totalDrones,
          totalPages: Math.ceil(totalDrones / limitNumber),
          currentPage: pageNumber,
          limit: limitNumber,
        },
        "Drones retrieved successfully"
      )
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiError(500, "Failed to get drones of a category"));
  }
};