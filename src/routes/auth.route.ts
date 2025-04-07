import express from 'express';
import AuthController from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/sendOTP', AuthController.sendOTP);
router.post('/verifyOTP', AuthController.verifyOTP);
router.post('/login', AuthController.login);

export default router;