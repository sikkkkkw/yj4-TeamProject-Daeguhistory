import express from 'express';
import { getCourses } from '../controllers/courseController.js';

const userRouter = express.Router();

userRouter.post('/course', getCourses);

export default userRouter;