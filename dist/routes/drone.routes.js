"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const Drones_controller_1 = require("../controllers/Drones.controller");
const Drones_controller_2 = require("../controllers/Drones.controller");
const Drones_controller_3 = require("../controllers/Drones.controller");
const Drones_controller_4 = require("../controllers/Drones.controller");
const Drones_controller_5 = require("../controllers/Drones.controller");
const Drones_controller_6 = require("../controllers/Drones.controller");
const router = (0, express_1.default)();
// Route to add a new drone, requires JWT verification
router.post("/addDrone", auth_middleware_1.verifyJWT, Drones_controller_1.addDrone);
// add site to the Drone
router.post("/addSiteToDrone/:dID", auth_middleware_1.verifyJWT, Drones_controller_2.addSite_to_Drone);
// Route to update an existing drone by its ID, requires JWT verification
router.put("/updateDrone/:dID", auth_middleware_1.verifyJWT, Drones_controller_3.updateDronebyID);
// Route to retrieve all drones, no authentication required
router.get("/getAllDrones", Drones_controller_5.getAllDrones);
// Route to delete a drone by its ID, requires JWT verification
router.delete("/deleteDrone/:dID", auth_middleware_1.verifyJWT, Drones_controller_4.DeleteDroneById);
// Route to move a drone to a different site by its ID, requires JWT verification
router.put("/moveSiteByID/:dID", auth_middleware_1.verifyJWT, Drones_controller_6.moveSiteofDrone);
exports.default = router;
