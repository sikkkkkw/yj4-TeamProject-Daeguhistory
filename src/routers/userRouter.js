import express from 'express';
import { getprofileUser, loginUser,   profileUpdata,   registerUser } from '../controllers/userController.js';
import { authenticationRequired } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);

userRouter.post('/register', registerUser);

userRouter.post('/update',authenticationRequired ,profileUpdata);

userRouter.get('/profile',authenticationRequired ,getprofileUser);

export default userRouter;
