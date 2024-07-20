import route from "express";
const router = route();
import { UserSignup, logoutUser } from "../controllers/User.controller";
import { loginUser } from "../controllers/User.controller";
import { getUserById } from "../controllers/User.controller";
import { verifyJWT } from "../middleware/auth.middleware";
import {refreshAccesToken} from "../controllers/User.controller"

// Route for user signup
router.post("/signup", UserSignup);

// Route for user login
router.post("/login", loginUser);

// Route to get a user by their ID
router.get("/getUserById/:uID", getUserById);

// Route for user logout, requires JWT verification
router.post("/logout", verifyJWT, logoutUser);

// refresh Token
router.post("/refreshToken", refreshAccesToken);
export default router;
