"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMissionSiteId = void 0;
const apiError_1 = __importDefault(require("../utils/apiError"));
const Mission_model_1 = require("../models/Mission.model");
// this is the middleware to handle that you are not supposed to change the site of the mission
const validateMissionSiteId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { mID } = req.params;
        const updatedData = req.body;
        const existingMission = yield Mission_model_1.Mission.findOne({
            _id: mID,
            userID: (_a = req.insertprop) === null || _a === void 0 ? void 0 : _a._id,
        });
        if (!existingMission) {
            return res.status(404).json(new apiError_1.default(404, "Mission not found"));
        }
        // Prevent siteID modification 
        // comparing siteID converting it into a string is a correct apprach
        if (updatedData.siteID && updatedData.siteID.toString() !== existingMission.siteID.toString()) {
            return res
                .status(400)
                .json(new apiError_1.default(400, "siteID cannot be changed"));
        }
        next();
    }
    catch (error) {
        return res
            .status(500)
            .json(new apiError_1.default(500, "Failed to validate mission site ID"));
    }
});
exports.validateMissionSiteId = validateMissionSiteId;
