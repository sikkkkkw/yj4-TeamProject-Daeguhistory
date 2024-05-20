import db from '../db.js';

export const getCourses = async (req, res) => {
    const user = req.user.user_no; 
    
    try {
        const query = `
        SELECT c.*, IF(uc.user_courses_no IS NOT NULL, 1, 0) AS visited
            FROM course c 
            LEFT JOIN users_course uc ON c.course_no = uc.course_no AND uc.user_no = ?
        `;
        const courses = await db.execute(query, [user]).then((result) => result[0]);
        
        return res.status(200).json({ status: 'success', message: '유저 방문 코스 리스트', data: courses });
    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).json({
            status: 'error',
            message: 'Database operation failed',
        });
    }
};


export const qrStamp = async (req, res)=>{
    const user = req.user.user_no;   
    const { qrCode } = req.body;

    try {
        const query = 'SELECT course_no FROM course WHERE course_name = ?';
        const qrCheckNo = await db.execute(query, [qrCode]).then((result) => result[0][0]);

        if (!qrCheckNo) {
            return res.status(404).json({ status: 'fail', message: '잘못된 QR코드입니다.' });
        }
        const userQuery = "SELECT * FROM users_course WHERE user_no = ? AND course_no = ?";
        const userQrId = await db.execute(userQuery,[user, qrCheckNo.course_no]).then((result) => result[0][0]);

        
        if(!userQrId) {
            const upDate = 'INSERT INTO users_course (user_no, course_no) VALUES(?, ?)';
            await db.execute(upDate,[user,qrCheckNo.course_no]);
            res.status(200).json({status:"success", message:"방문 완료"})
        } else {
        return res.status(400).json({status:'fail', message: '이미 방문한 장소입니다.'})
        }


    } catch (err) {
        res.status(500).json({ status: 'error', message: 'DB 에러' });
    }
}
