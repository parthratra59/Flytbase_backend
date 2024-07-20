"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
const apiError_1 = __importDefault(require("../utils/apiError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = require("../models/User.model");
// const payload = {
//     userID: this._id,
//     username: this.username,
//     email: this.email,
//   };
const verifyJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // request have the access of cookies by cookie-parser which we have deealred in index.ts
        // if we are using mobile applications then they don't have cookies so we will fetch fetch token froom
        // Authorization header
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) ||
            ((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", ""));
        if (!token) {
            throw new apiError_1.default(401, "Unauthorized Request");
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = (yield User_model_1.User.findById(decoded._id).select("-password -refreshToken"));
        // if token is valid then i will insert it into req.body
        // and then in the logout route i will check if user is logged in or not
        // if user is logged in then i will remove his token from the database and cookies
        if (!user) {
            throw new apiError_1.default(401, "invalid access token");
        }
        // request is the object so we are adding this insertprop object in the request
        req.insertprop = user;
        next();
    }
    catch (error) {
        return res.status(500).json(new apiError_1.default(500, "Failed to verify JWT"));
    }
});
exports.verifyJWT = verifyJWT;
