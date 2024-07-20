import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model";
import { AuthRequest, checkUser } from "../utils/Authrequest";
import { Mission } from "../models/Mission.model";

// const payload = {
//     userID: this._id,
//     username: this.username,
//     email: this.email,
//   };

export const verifyJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // request have the access of cookies by cookie-parser which we have deealred in index.ts
    // if we are using mobile applications then they don't have cookies so we will fetch fetch token froom
    // Authorization header

    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as checkUser;

    const user = (await User.findById(decoded._id).select(
      "-password -refreshToken"
    )) as checkUser;
    

    // if token is valid then i will insert it into req.body
    // and then in the logout route i will check if user is logged in or not
    // if user is logged in then i will remove his token from the database and cookies

    if (!user) {
      throw new ApiError(401, "invalid access token");
    }

    // request is the object so we are adding this insertprop object in the request
    req.insertprop = user;
    next();
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Failed to verify JWT"));
  }
};


