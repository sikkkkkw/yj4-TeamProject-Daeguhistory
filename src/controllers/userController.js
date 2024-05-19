import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// 로그인
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const queryLogin = 'SELECT user_no, user_email, user_password FROM users WHERE user_email = ?';
        const result = await db.execute(queryLogin, [email]).then((result) => result[0][0]);

        if (!result) {
            return res.status(401).json({ status: 'fail', message: '이메일 또는 비밀번호를 확인해주세요.' });
        }

        const isPasswordCorret = await bcrypt.compare(password, result.user_password);
        if (!isPasswordCorret) {
            return res.status(401).json({ status: 'fail', message: '이메일 또는 비밀번호를 확인해주세요.' });
        }

        const token = jwt.sign({ no: result.user_no }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        res.status(200).json({
            status: 'sucess',
            message: '성공',
            data: {
                token,
            },
        });
    } catch (err) {
        console.log(err);
    }
};

// 회원가입

// 이메일 유효성 검사 함수
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const registerUser = async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;

        // 이메일 유효성 검사
        if (!isValidEmail(email)) {
            return res.status(400).json({ status: 'fail', message: '유효하지 않은 이메일 형식입니다.' });
        }

        const encryptPassword = await bcrypt.hash(password, 8);

        // const queryCheckId = 'SELECT user_id from users WHERE user_id = ?';
        // const resultCheckId = await db.execute(queryCheckId, [id]).then((result) => result[0][0]);
        // if (resultCheckId) {
        //     return res.status(409).json({ status: 'fail', message: '중복된 아이디 입니다.' });
        // }
        const queryCheckEmail = 'SELECT user_email from users WHERE user_email = ?';
        const resultCheckEmail = await db.execute(queryCheckEmail, [email]).then((result) => result[0][0]);
        if (resultCheckEmail) {
            return res.status(409).json({ status: 'fail', massage: '중복된 이메일 입니다.' });
        }

        const queryRegister =
            'INSERT INTO users(user_no, user_email, user_password, user_name, user_phone, user_socialtype) VALUES (?,?,?,?,?,?)';
        await db.execute(queryRegister, [uuidv4(), email, encryptPassword, name, phone, 'normal']),
            res.status(201).json({ status: 'success', message: '회원가입 완료' });
    } catch (err) {
        console.log(err);
    }
};

//
