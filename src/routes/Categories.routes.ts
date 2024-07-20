import { Router } from "express";
import {
  addcategory,
  associateMissionWithCategory,
  associateDroneWithCategory,
  updateCategory,
  changeCategoryofMission,
  changeCategoryofDrones,
  deleteCategoryFromParticuarDrones,
  deleteCategoryFromparticularMissions,
  getMissionsofCategoryID,
  getDronesofCategoryID
} from "../controllers/Categories.models";
import {verifyJWT} from "../middleware/auth.middleware";

const router = Router();

// Route to add a new category
router.post("/addCategory", addcategory);

// Route to associate a mission with a category
router.post("/associate_Mission/:categoryID", verifyJWT, associateMissionWithCategory);

// Route to associate a drone with a category
router.post("/associate_Drone/:categoryID", verifyJWT, associateDroneWithCategory);

// Route to update a category
router.put("/updateCategory/:categoryID", verifyJWT, updateCategory);

// Route to change the category of a mission
router.put("/changeMissionCategory/:mID", verifyJWT, changeCategoryofMission);

// Route to change the category of a drone
router.put("/changeDroneCategory/:dID", verifyJWT, changeCategoryofDrones);

// Route to delete a category from missions
router.delete("/delete_Mission_Category/:categoryID", verifyJWT, deleteCategoryFromparticularMissions);

// Route to delete a category from drones
router.delete("/delete_Drone_Category/:categoryID", verifyJWT, deleteCategoryFromParticuarDrones);

// Route to get missions of a category by category ID
router.get("/getMissions_Category/:categoryID",  getMissionsofCategoryID);

// Route to get drone of a category by category ID
router.get("/getDrones_Category/:categoryID", getDronesofCategoryID)

export default router;
