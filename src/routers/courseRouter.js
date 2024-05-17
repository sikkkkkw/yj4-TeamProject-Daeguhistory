import express from 'express';
import { getCourses } from '../controllers/courseController.js';
import { notNeededAuth } from '../middleware/auth.js';

const courseRouter = express.Router();

courseRouter.get('/course', notNeededAuth, getCourses);

export default courseRouter;
