import express from 'express';
import {  deleteUser, emailCheck, getprofileUser, loginUser,   profileUpdata,   registerUser } from '../controllers/userController.js';
import { authenticationRequired } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);

userRouter.post('/register', registerUser);

userRouter.post('/email-check', emailCheck);

userRouter.put('/update',authenticationRequired ,profileUpdata);

userRouter.get('/profile',authenticationRequired ,getprofileUser);

userRouter.delete('/delete',authenticationRequired ,deleteUser);

export default userRouter;