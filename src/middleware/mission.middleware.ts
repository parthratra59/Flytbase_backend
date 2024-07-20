import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import { User } from "../models/User.model";
import { AuthRequest, checkUser } from "../utils/Authrequest";
import { Mission } from "../models/Mission.model";


// this is the middleware to handle that you are not supposed to change the site of the mission
export const validateMissionSiteId = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mID } = req.params;
    const updatedData = req.body;
    const existingMission = await Mission.findOne({
      _id: mID,
      userID: req.insertprop?._id,
    });

    if (!existingMission) {
      return res.status(404).json(new ApiError(404, "Mission not found"));
    }

    // Prevent siteID modification 
    // comparing siteID converting it into a string is a correct apprach
    if (updatedData.siteID && updatedData.siteID.toString() !== existingMission.siteID.toString()) {
      return res
        .status(400)
        .json(new ApiError(400, "siteID cannot be changed"));
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to validate mission site ID"));
  }
};