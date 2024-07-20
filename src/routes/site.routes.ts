import Router from "express";
const router = Router();
import { createSite } from "../controllers/Sites.controller";
import { verifyJWT } from "../middleware/auth.middleware";
import { getDronesBySiteName } from "../controllers/Sites.controller";
import { updateSiteByName } from "../controllers/Sites.controller";
import { deleteSiteByID } from "../controllers/Sites.controller";

// Route to create a new site, requires JWT verification
router.post("/createSite", verifyJWT, createSite);

// Route to get drones by the site's name, requires JWT verification
router.get("/getdroneBySiteName", verifyJWT, getDronesBySiteName);

// Route to update a site by its name, requires JWT verification
router.put("/updateSiteName", verifyJWT, updateSiteByName);

// Route to delete a site by its ID, requires JWT verification
router.delete("/deleteSiteByID/:sID", verifyJWT, deleteSiteByID);

export default router;
