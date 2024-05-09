import express from 'express';
import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const userRouter = express.Router();

userRouter.post('/login', async (req, res) => {
    res.send({ status: 200, message: '로그인 굳' });
});

userRouter.post('/register', async (req, res) => {
    const { id, password, name, email, phone } = req.body;
    const queryCheckId = 'SELECT user_id from users WHERE user_id = ?';
    const resultCheckId = await db.execute(queryCheckId, [id]).then((result) => result[0][0]);
    if (resultCheckId) {
        return res.status(409).json({ status: 'fail', message: '중복된 아이디 입니다.' });
    }

    const queryCheckEmail = 'SELECT user_email from users WHERE user_email = ?';
    const resultCheckEmail = await db.execute(queryCheckEmail, [email]).then((result) => result[0][0]);
    if (resultCheckEmail) {
        return res.status(409).json({ status: 'fail', massage: '중복된 이메일 입니다.' });
    }

    const queryRegister =
        'INSERT INTO users(user_no, user_id, user_password, user_name, user_email, user_phone, user_socialtype) VALUES (?,?,?,?,?,?,?)';
    await db.execute(queryRegister, [uuidv4(), id, password, name, email, phone, 'normal']),
        res.status(201).json({ status: 'success', message: '회원가입 완료' });
});

export default userRouter;
