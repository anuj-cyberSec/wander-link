import express from 'express';
import UserController from '../controllers/user.controller';
import authentication from '../middleware/authenticator';

const router = express.Router();

const userController = new UserController();

router.post('/getUsers', authentication, UserController.getUsers);
router.post('/createTrip', authentication, UserController.createTrip);
router.post('/updateUser', authentication, UserController.updateUser);
router.get('/getProfile', authentication, UserController.getProfile);
router.post('/updateProfile', authentication, UserController.updateProfile);
export default router;