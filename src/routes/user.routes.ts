import route from "express";
const router = route();
import { UserSignup, logoutUser } from "../controllers/User.controller";
import { loginUser } from "../controllers/User.controller";
import { getUserById } from "../controllers/User.controller";
import { verifyJWT } from "../middleware/auth.middleware";

router.post("/signup", UserSignup);

router.post("/login", loginUser);
router.get("/getUserById/:uID", getUserById);

router.post("/logout", verifyJWT, logoutUser);

export default router;
