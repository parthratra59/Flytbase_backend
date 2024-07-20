"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Mission_controller_1 = require("../controllers/Mission.controller");
const auth_middleware_1 = require("../middleware/auth.middleware"); // Assuming you have a middleware to verify JWT
const mission_middleware_1 = require("../middleware/mission.middleware");
const Mission_controller_2 = require("../controllers/Mission.controller");
const router = (0, express_1.Router)();
// Route to add a new mission
router.post("/addMissions", auth_middleware_1.verifyJWT, Mission_controller_1.addMission);
// Route to get missions by site ID with pagination
router.get("/getMissions/site/:sID", auth_middleware_1.verifyJWT, Mission_controller_1.getMissionsBySiteID);
// Route to update a mission
router.put("/updateMission/:mID", auth_middleware_1.verifyJWT, mission_middleware_1.validateMissionSiteId, Mission_controller_1.updateMission);
// route to delete a mission
router.delete("/deleteMission/:mID", auth_middleware_1.verifyJWT, Mission_controller_2.deleteMission);
exports.default = router;
