import express from 'express';
import UserController from '../controllers/user.controller';


const router = express.Router();

const userController = new UserController();
router.post('/getUsers', UserController.getUsers);
router.post('/createTrip', UserController.createTrip);

export default router;