"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const authenticator_1 = __importDefault(require("../middleware/authenticator"));
const router = express_1.default.Router();
const userController = new user_controller_1.default();
// router.post('/getUsers', authentication, UserController.getUsers);
router.post('/homepage', authenticator_1.default, user_controller_1.default.homepage);
router.post('/createTrip', authenticator_1.default, user_controller_1.default.createTrip);
router.post('/updateUser', authenticator_1.default, user_controller_1.default.updateUser);
router.get('/getProfile', authenticator_1.default, user_controller_1.default.getProfile);
router.post('/create-profile', authenticator_1.default, user_controller_1.default.createProfile);
// router.post('/updateProfile', authentication, UserController.updateProfile);
exports.default = router;
