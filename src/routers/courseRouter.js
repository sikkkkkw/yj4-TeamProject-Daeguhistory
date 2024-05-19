import express from 'express';
import { getCourses, qrStamp } from '../controllers/courseController.js';
import { authenticationRequired } from '../middleware/auth.js';


const courseRouter = express.Router();

courseRouter.post('/course/list',authenticationRequired, getCourses);
courseRouter.post('/course/qr',authenticationRequired,qrStamp)

export default courseRouter;
