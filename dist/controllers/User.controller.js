var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from "../models/User.model";
import bcryptjs from "bcryptjs";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
const generateAccessandRefreshToken = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUser = yield User.findById(userID);
        if (!getUser) {
            throw new ApiError(404, "User not found");
        }
        const accessToken = getUser.generateAccessToken();
        const refreshToken = getUser.generateRefreshToken();
        // Add refresh token to the database
        getUser.refreshToken = refreshToken;
        // Save the updated user record to the database
        // Use validateBeforeSave: false to bypass validation for required fields
        // This is necessary because updating only the refreshToken would otherwise trigger validation errors
        yield getUser.save({
            validateBeforeSave: false,
        });
        return { accessToken, refreshToken };
    }
    catch (err) {
        throw new ApiError(500, "Failed to generate tokens");
    }
});
export const UserSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        if ([username, email, password].some((field) => field.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            throw new ApiError(400, "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character");
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ApiError(400, "Invalid email format");
        }
        const existedUser = yield User.findOne({ email });
        if (existedUser) {
            throw new ApiError(400, "User already exists");
        }
        const user = yield User.create({
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password: yield bcryptjs.hash(password, 10),
        });
        const createUser = yield User.findById(user._id).select("-password -refreshToken");
        return res
            .status(201)
            .json(new ApiResponse(200, createUser, "User created successfully"));
    }
    catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to create user"));
    }
});
export const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const fetcheduser = yield User.findOne({
            email: email.toLowerCase(),
        });
        // If user is not found, throw an error
        if (!fetcheduser) {
            throw new ApiError(401, "Invalid credentials");
        }
        // Verify the provided password against the stored hashed password
        const isPasswordValid = yield bcryptjs.compare(password, fetcheduser.password);
        // If password is invalid, throw an error
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid credentials");
        }
        // Generate access and refresh tokens
        const { accessToken, refreshToken } = yield generateAccessandRefreshToken(fetcheduser._id);
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
            .json(new ApiResponse(200, {
            //  we user want to store accesstoken and refresh token in the local storage that's why i am sending it in the data
            fetcheduser: accessToken,
            refreshToken,
        }, "User logged in successfully"));
    }
    catch (error) {
        // Handle any errors and send a 500 response
        return res.status(500).json(new ApiError(500, "Failed to login user"));
    }
});
// getUserById
export const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uID } = req.params;
        const user = yield User.findById(uID).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, user, "User fetched successfully"));
    }
    catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to fetch user"));
    }
});
export const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // We don't have the user's ID directly accessible, and using email or username for logout
        // isn't secure because anyone could attempt to log out another user without being logged in themselves.
        // This is why we use middleware to authenticate and identify the user before proceeding with the logout.
        // Update the user's refreshToken to undefined
        yield User.findByIdAndUpdate((_a = req.insertprop) === null || _a === void 0 ? void 0 : _a._id, {
            $set: {
                refreshToken: undefined,
            },
        }, { new: true });
        const options = {
            httpOnly: true, // The cookie can only be modified by the server
            secure: true, // The cookie will only be sent over HTTPS
        };
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User logged out successfully"));
    }
    catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to logout user"));
    }
});
