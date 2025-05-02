import express from 'express';
import UserController from '../controllers/user.controller';
import authentication from '../middleware/authenticator';

const router = express.Router();

const userController = new UserController();

// router.post('/getUsers', authentication, UserController.getUsers);
router.post('/homepage', authentication, UserController.homepage);
router.post('/createTrip', authentication, UserController.createTrip);
router.post('/updateUser', authentication, UserController.updateUser);
router.get('/getProfile', authentication, UserController.getProfile);
router.post('/create-profile', authentication, UserController.createProfile)
// router.post('/updateProfile', authentication, UserController.updateProfile);
router.post('/batch-upload', authentication, UserController.bulkswiped);
router.get('/last-swipe', authentication, UserController.lastSwipe);
router.post('/fetch-trip', authentication, UserController.fetchTrip)
router.get('/get-approved-trips', authentication, UserController.fetchApprovedTrip);
router.get('/wanderer-approval', authentication, UserController.fetchTripForApproval);
router.post('/approve-trip', authentication, UserController.approveTrip);
export default router;