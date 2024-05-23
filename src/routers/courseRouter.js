import express from 'express';
import { getCourseDeatil, getCourses, qrStamp } from '../controllers/courseController.js';
import { authenticationRequired } from '../middleware/auth.js';


const courseRouter = express.Router();

courseRouter.get('/list',authenticationRequired, getCourses);

courseRouter.get('/deatil',authenticationRequired, getCourseDeatil);

courseRouter.post('/qr',authenticationRequired, qrStamp);

export default courseRouter;
