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

        const isPasswordCorrect = await bcrypt.compare(password, result.user_password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ status: 'fail', message: '이메일 또는 비밀번호를 확인해주세요.' });
        }
        // 액세스 토큰 생성
        const accessToken = jwt.sign({ no: result.user_no }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        // 리프레시 토큰 생성
        const refreshToken = jwt.sign({ no: result.user_no }, process.env.JWT_REFRESH_SECRET_KEY, {
            expiresIn: process.env.JWT_REFRESH_EXPIRE,
        });
        // 리프레시 토큰이 이미 존재하는지 확인
        const queryCheckRefreshToken = 'SELECT * FROM refresh_tokens WHERE user_no = ?';
        const resultCheckRefreshToken = await db.execute(queryCheckRefreshToken, [result.user_no]).then((result) => result[0][0]);

        if (resultCheckRefreshToken) {
            // 리프레시 토큰이 존재하면 업데이트
            const queryUpdateRefreshToken = 'UPDATE refresh_tokens SET token = ? WHERE user_no = ?';
            await db.execute(queryUpdateRefreshToken, [refreshToken, result.user_no]);
        } else {
            // 리프레시 토큰이 존재하지 않으면 삽입
            const queryStoreRefreshToken = 'INSERT INTO refresh_tokens (token, user_no) VALUES (?, ?)';
            await db.execute(queryStoreRefreshToken, [refreshToken, result.user_no]);
        }

        res.status(200).json({
            status: 'success',
            message: '로그인 성공',
            data: {
                accessToken,
                refreshToken
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: '서버 에러' });
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
        const user_no = uuidv4();

        // 이메일 유효성 검사
        if (!isValidEmail(email)) {
            return res.status(400).json({ status: 'fail', message: '유효하지 않은 이메일 형식입니다.' });
        }

        const encryptPassword = await bcrypt.hash(password, 8);

        const queryCheckEmail = 'SELECT user_email FROM users WHERE user_email = ?';
        const resultCheckEmail = await db.execute(queryCheckEmail, [email]).then((result) => result[0][0]);
        if (resultCheckEmail) {
            return res.status(409).json({ status: 'fail', message: '중복된 이메일 입니다.' });
        }

        const userProfilePath = '/assets/profile.jpg';

        const queryRegister =
            'INSERT INTO users(user_no, user_email, user_password, user_name, user_phone,user_profile, user_socialtype) VALUES (?,?,?,?,?,?,?)';
        await db.execute(queryRegister, [user_no, email, encryptPassword, name, phone, userProfilePath, 'normal']);

        const user = {no: user_no };

        // 액세스 토큰 생성
        const accessToken = jwt.sign(user, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        // 리프레시 토큰 생성
        const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_SECRET_KEY, {
            expiresIn: process.env.JWT_REFRESH_EXPIRE,
        });
        // 리프레시 토큰을 데이터베이스에 저장
        const queryStoreRefreshToken = 'INSERT INTO refresh_tokens (token, user_no) VALUES (?, ?)';
        await db.execute(queryStoreRefreshToken, [refreshToken, user_no]);

        res.status(201).json({ status: 'success', message: '회원가입 완료', data: {accessToken, refreshToken} });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: '서버 에러' });
    }
};

// 로그인된 유저 정보
export const getprofileUser = async (req, res)=>{
    try{
        const user = req.user;

    // 사용자 정보 조회
    const query = 'SELECT user_email, user_name, user_phone,user_profile FROM users WHERE user_no = ?';
    const userInfo = await db.execute(query, [user.user_no]).then(result => result[0][0]);

    if (!userInfo) {
        return res.status(404).json({ status: 'fail', message: '사용자를 찾을 수 없습니다.' });
    }else{
        res.status(200).json({ status: 'success', message: '프로필 불러오기', userInfo });
    }
    }catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: '서버 에러' });
    }
    
}

// 로그인된 유저 업데이트
export const profileUpdata = async (req, res) => {
    try {
        const user = req.user;
        const { email, name, phone } = req.body;
        

        // 이메일 유효성 검사
        if (email && !isValidEmail(email)) {
            return res.status(400).json({ status: 'fail', message: '유효하지 않은 이메일 형식입니다.' });
        }

        // 이메일 중복 확인 (새 이메일이 기존 이메일과 다른 경우에만)
        if (email && email !== user.user_email) {
            const queryCheckEmail = 'SELECT user_email FROM users WHERE user_email = ?';
            const resultCheckEmail = await db.execute(queryCheckEmail, [email]).then(result => result[0][0]);
            if (resultCheckEmail) {
                return res.status(409).json({ status: 'fail', message: '중복된 이메일 입니다.' });
            }
        }

        // 업데이트할 값이 없으면 기존 값 사용
        const newEmail = email || user.user_email;
        const newName = name || user.user_name;
        const newPhone = phone || user.user_phone;

        const userUpdate = 'UPDATE users SET user_email = ?, user_name = ?, user_phone = ? WHERE user_no = ?';
        await db.execute(userUpdate, [newEmail, newName, newPhone, user.user_no]);
        
        res.status(200).json({ status: 'success', message: '프로필 업데이트 성공', data: { email: newEmail, name: newName, phone: newPhone } });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: '서버 에러' });
    }
};

// 로그인된 유저 삭제
export const deleteUser = async (req, res) => {
    const user = req.user;

    try {
        const query = 'DELETE FROM users WHERE user_no = ?';
        const [result] = await db.execute(query, [user.user_no]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ status: 'success', message: '유저 DB에서 삭제 완료' });
        } else {
            return res.status(404).json({ status: 'fail', message: '삭제 실패: 사용자를 찾을 수 없습니다.' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: 'error', message: '서버 에러' });
    }
};
