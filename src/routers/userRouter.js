import express from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';
import { neededAuth } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);

userRouter.post('/register', neededAuth, registerUser);

export default userRouter;
