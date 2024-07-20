"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
const User_controller_1 = require("../controllers/User.controller");
const User_controller_2 = require("../controllers/User.controller");
const User_controller_3 = require("../controllers/User.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const User_controller_4 = require("../controllers/User.controller");
// Route for user signup
router.post("/signup", User_controller_1.UserSignup);
// Route for user login
router.post("/login", User_controller_2.loginUser);
// Route to get a user by their ID
router.get("/getUserById/:uID", User_controller_3.getUserById);
// Route for user logout, requires JWT verification
router.post("/logout", auth_middleware_1.verifyJWT, User_controller_1.logoutUser);
// refresh Token
router.post("/refreshToken", User_controller_4.refreshAccesToken);
exports.default = router;
