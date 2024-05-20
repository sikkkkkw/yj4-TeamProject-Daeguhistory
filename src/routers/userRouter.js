import express from 'express';
import { loginUser, profileUser, registerUser } from '../controllers/userController.js';
import { authenticationRequired } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);

userRouter.post('/register', registerUser);

userRouter.post('/profile',authenticationRequired, profileUser);

export default userRouter;
