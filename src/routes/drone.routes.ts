import Router from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { addDrone } from "../controllers/Drones.controller";
import {updateDronebyID } from "../controllers/Drones.controller"
import { DeleteDroneById } from "../controllers/Drones.controller"

import { moveSiteofDrone } from "../controllers/Drones.controller"
const router = Router();


router.post("/addDrone",verifyJWT,addDrone);

router.put("/updateDrone/:_id",verifyJWT,updateDronebyID);

router.delete("/deleteDrone/:_id",verifyJWT,DeleteDroneById)
router.put("/movesiteByID/:dID",verifyJWT,moveSiteofDrone)

export default router;