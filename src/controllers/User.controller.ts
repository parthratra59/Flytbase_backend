import { Request, Response } from "express";
import { User } from "../models/User.model";
import bcryptjs from "bcryptjs";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import { UserModel } from "../models/User.model";
import { checkUser, AuthRequest } from "../utils/Authrequest";
import jwt from "jsonwebtoken";

const generateAccessandRefreshToken = async (userID: string) => {
  try {
    const getUser = await User.findById(userID);

    if (!getUser) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = getUser.generateAccessToken();
    const refreshToken = getUser.generateRefreshToken();

    // Add refresh token to the User database
    getUser.refreshToken = refreshToken;

    // Save the updated user record to the database
    // Use validateBeforeSave: false to bypass validation for required fields
    // This is necessary because updating only the refreshToken would otherwise trigger validation errors
    await getUser.save({
      validateBeforeSave: false,
    });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(500, "Failed to generate tokens");
  }
};
export const UserSignup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if ([username, email, password].some((field) => field.trim() === "")) {
      return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new ApiError(
        400,
        "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character"
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, "Invalid email format");
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      throw new ApiError(400, "User already exists");
    }

    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: await bcryptjs.hash(password, 10),
    });

    const createUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(201)
      .json(new ApiResponse(200, createUser, "User created successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Failed to create user"));
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if username or email is provided
    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    // Check if password is provided
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Find the user by username or email
    // const fetcheduser = await User.findOne({
    //   $or: [{ username }, { email }],
    // });

    const fetcheduser = await User.findOne({
      email: email.toLowerCase(),
    });

    // If user is not found, throw an error
    if (!fetcheduser) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Verify the provided password against the stored hashed password
    const isPasswordValid = await bcryptjs.compare(
      password,
      fetcheduser.password
    );

    // If password is invalid, throw an error
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessandRefreshToken(
      fetcheduser._id as string
    );

    // Set cookie options
    const options = {
      httpOnly: true, // The cookie can only be modified by the server
      secure: true, // The cookie will only be sent over HTTPS
    };

    // Send the response with cookies and tokens
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            // if  we user want to store accesstoken and refresh token in the local storage that's why i am sending it in the data
            fetcheduser: accessToken,
            refreshToken,
          },
          "User logged in successfully"
        )
      );
  } catch (error) {
    // Handle any errors and send a 500 response

    return res.status(500).json(new ApiError(500, "Failed to login user"));
  }
};
 
export const refreshAccesToken = async (req: Request, res: Response) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken; // body for the mobile application
    if (!incomingRefreshToken) {
      return res.status(401).json(new ApiError(401, "unauthorized request"));
    }
    // verify needs token and refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { _id: string };


    const user = await User.findById(decodedToken?._id);


    if(!user)
    {
      return res.status(401).json(new ApiError(401,
        "Invalid refresh token"))
    }

    // user.refreshtoken it was stored in the UserDatabase

    if(incomingRefreshToken !== user?.refreshToken)
    {
      return res.status(401).json(new ApiError(401,
        "Refresh Token is expired"))
    }


    // now new accesstoken will be generated
    const options = {
      httpOnly: true,
      secure: true,
    };

    const {accessToken,refreshToken}=await generateAccessandRefreshToken(user._id as string)

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options).
    json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken,
        },
        "access token refreshed successfully"
      )
    )

  } catch (error) {

    return res.status(401).json(new ApiError(401, "Invalid refresh token"));
  }
};

// getUserById
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { uID } = req.params;
    const user = await User.findById(uID).select("-password -refreshToken");
    if (!user) {
      return res.status(404).json(new ApiError(404, "User Not Found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User fetched successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Failed to fetch user"));
  }
};

export const logoutUser = async (req: AuthRequest, res: Response) => {
  try {
    // We don't have the user's ID directly accessible, and using email or username for logout
    // isn't secure because anyone could attempt to log out another user without being logged in themselves.
    // This is why we use middleware to authenticate and identify the user before proceeding with the logout.

    // Update the user's refreshToken to undefined

    await User.findByIdAndUpdate(
      req.insertprop?._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      { new: true }
    );

    const options = {
      httpOnly: true, // The cookie can only be modified by the server
      secure: true, // The cookie will only be sent over HTTPS
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Failed to logout user"));
  }
};
