"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
const Sites_controller_1 = require("../controllers/Sites.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const Sites_controller_2 = require("../controllers/Sites.controller");
const Sites_controller_3 = require("../controllers/Sites.controller");
const Sites_controller_4 = require("../controllers/Sites.controller");
// Route to create a new site, requires JWT verification
router.post("/createSite", auth_middleware_1.verifyJWT, Sites_controller_1.createSite);
// Route to get drones by the site's name, requires JWT verification
router.get("/getdroneBySiteName", auth_middleware_1.verifyJWT, Sites_controller_2.getDronesBySiteName);
// Route to update a site by its name, requires JWT verification
router.put("/updateSiteName", auth_middleware_1.verifyJWT, Sites_controller_3.updateSiteByName);
// Route to delete a site by its ID, requires JWT verification
router.delete("/deleteSiteByID/:sID", auth_middleware_1.verifyJWT, Sites_controller_4.deleteSiteByID);
exports.default = router;
