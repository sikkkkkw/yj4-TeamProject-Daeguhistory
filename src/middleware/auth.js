import jwt from 'jsonwebtoken';
import db from '../db.js';

// 꼭 로그인 해야됨(토큰값이 있으면 유저정보 넣어줌)
export const authenticationRequired = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    const token = authHeader.split(' ')[1];
    if (token && token != 'null') {
        //첫번째 인자 토큰값, 시크릿값, 콜백함수 (verify암호화 풀어줌)
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ status: 'fail', message: 'JWT 검증실패' });
            }
            const query = 'SELECT * FROM users WHERE user_no = ?';
            const user = await db.execute(query, [decoded.no]).then((result) => result[0][0]);
            req.user = user; //생명주기
            next();
        });
    } else {
        res.status(403).json({ status: 'fail', message: '로그인이 필요합니다.' });
    }
};

