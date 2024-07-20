"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Categories_models_1 = require("../controllers/Categories.models");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Route to add a new category
router.post("/addCategory", Categories_models_1.addcategory);
// Route to associate a mission with a category
router.post("/associate_Mission/:categoryID", auth_middleware_1.verifyJWT, Categories_models_1.associateMissionWithCategory);
// Route to associate a drone with a category
router.post("/associate_Drone/:categoryID", auth_middleware_1.verifyJWT, Categories_models_1.associateDroneWithCategory);
// Route to update a category
router.put("/updateCategory/:categoryID", auth_middleware_1.verifyJWT, Categories_models_1.updateCategory);
// Route to change the category of a mission
router.put("/changeMissionCategory/:mID", auth_middleware_1.verifyJWT, Categories_models_1.changeCategoryofMission);
// Route to change the category of a drone
router.put("/changeDroneCategory/:dID", auth_middleware_1.verifyJWT, Categories_models_1.changeCategoryofDrones);
// Route to delete a category from missions
router.delete("/delete_Mission_Category/:categoryID", auth_middleware_1.verifyJWT, Categories_models_1.deleteCategoryFromparticularMissions);
// Route to delete a category from drones
router.delete("/delete_Drone_Category/:categoryID", auth_middleware_1.verifyJWT, Categories_models_1.deleteCategoryFromParticuarDrones);
// Route to get missions of a category by category ID
router.get("/getMissions_Category/:categoryID", Categories_models_1.getMissionsofCategoryID);
// Route to get drone of a category by category ID
router.get("/getDrones_Category/:categoryID", Categories_models_1.getDronesofCategoryID);
exports.default = router;
