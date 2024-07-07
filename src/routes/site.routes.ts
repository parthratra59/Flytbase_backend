import Router from "express";
const router = Router();
import { createSite } from "../controllers/Sites.controller";
import { verifyJWT } from "../middleware/auth.middleware";
import {getDronesBySiteName} from "../controllers/Sites.controller"
import {updateSiteByName} from "../controllers/Sites.controller"
import { deleteSiteByID } from "../controllers/Sites.controller";

router.post("/createSite",verifyJWT, createSite);
router.get("/getdroneBySiteName",verifyJWT,getDronesBySiteName)
router.put("/updateSiteName",verifyJWT,updateSiteByName)
router.delete("/deleteSiteByID/:_id",verifyJWT,deleteSiteByID)

export default router;