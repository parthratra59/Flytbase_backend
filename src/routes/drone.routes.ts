import Router from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { addDrone } from "../controllers/Drones.controller";
import {addSite_to_Drone} from "../controllers/Drones.controller";
import { updateDronebyID } from "../controllers/Drones.controller";
import { DeleteDroneById } from "../controllers/Drones.controller";
import { getAllDrones } from "../controllers/Drones.controller";
import { moveSiteofDrone } from "../controllers/Drones.controller";

const router = Router();

// Route to add a new drone, requires JWT verification
router.post("/addDrone", verifyJWT, addDrone);


// add site to the Drone
router.post("/addSiteToDrone/:dID", verifyJWT,addSite_to_Drone);

// Route to update an existing drone by its ID, requires JWT verification
router.put("/updateDrone/:dID", verifyJWT, updateDronebyID);

// Route to retrieve all drones, no authentication required
router.get("/getAllDrones", getAllDrones);

// Route to delete a drone by its ID, requires JWT verification
router.delete("/deleteDrone/:dID", verifyJWT, DeleteDroneById);

// Route to move a drone to a different site by its ID, requires JWT verification
router.put("/moveSiteByID/:dID", verifyJWT, moveSiteofDrone);

export default router;
