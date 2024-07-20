import { Router } from "express";
import { addMission, getMissionsBySiteID, updateMission } from "../controllers/Mission.controller";
import {verifyJWT} from "../middleware/auth.middleware"; // Assuming you have a middleware to verify JWT
import { validateMissionSiteId } from "../middleware/mission.middleware";

import { deleteMission } from "../controllers/Mission.controller";

const router = Router();

// Route to add a new mission
router.post("/addMissions", verifyJWT, addMission);

// Route to get missions by site ID with pagination
router.get("/getMissions/site/:sID", verifyJWT, getMissionsBySiteID);

// Route to update a mission
router.put("/updateMission/:mID", verifyJWT,validateMissionSiteId, updateMission);


// route to delete a mission
router.delete("/deleteMission/:mID", verifyJWT, deleteMission);

export default router;