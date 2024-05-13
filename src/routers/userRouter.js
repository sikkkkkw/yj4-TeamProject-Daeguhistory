import express from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';
import { getCourses } from '../controllers/courseController.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);

userRouter.post('/register', registerUser);

userRouter.post('/course', getCourses);

export default userRouter;
