import express from 'express';
import { refreshToken } from '../controllers/tokenController.js';

const tokenRouter = express.Router();

tokenRouter.post('/token', refreshToken);


export default tokenRouter;