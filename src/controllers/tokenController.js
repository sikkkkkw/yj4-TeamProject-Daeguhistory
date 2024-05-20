import jwt from 'jsonwebtoken';
import db from '../db.js';


export const refreshToken = async (req, res) => {
    // 헤더에서 리프레시 토큰 받기
    const authHeader = req.headers['authorization'];
    const receivedToken = authHeader && authHeader.split(' ')[1];
    if (!receivedToken) {
        return res.status(401).json({ status: 'fail', message: '리프레시 토큰이 없습니다.' });
    }

    try {
        // 받은 리프레시 토큰 검증
        const decoded = jwt.verify(receivedToken, process.env.JWT_REFRESH_SECRET_KEY);
        // 데이터베이스에서 리프레시 토큰 조회
        const queryCheckRefreshToken = 'SELECT * FROM refresh_tokens WHERE token = ?';
        const resultCheckRefreshToken = await db.execute(queryCheckRefreshToken, [receivedToken]).then((result) => result[0][0]);
        if (!resultCheckRefreshToken) {
            return res.status(403).json({ status: 'fail', message: '유효하지 않은 리프레시11 토큰입니다.' });
        }

        // 새로운 액세스 토큰 생성
        const newAccessToken = jwt.sign({no:decoded.no}, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE, // 예: '1m'
        });

        // 새로운 리프레시 토큰 생성
        const newRefreshToken = jwt.sign({no:decoded.no}, process.env.JWT_REFRESH_SECRET_KEY, {
            expiresIn: process.env.JWT_REFRESH_EXPIRE, // 예: '1h'
        });

        // 새로운 리프레시 토큰을 데이터베이스에 저장하고 기존 리프레시 토큰 삭제
        const queryUpdateRefreshToken = 'UPDATE refresh_tokens SET token = ? WHERE user_no = ?';
        await db.execute(queryUpdateRefreshToken, [newRefreshToken, decoded.no]);

        res.status(200).json({ status: 'success', accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({ status: 'fail', message: '리프레시 토큰이 만료되었습니다.' });
        }
        console.log(err);
        res.status(403).json({ status: 'fail', message: '유효하지 않은 리프레시22 토큰입니다.' });
    }
};
