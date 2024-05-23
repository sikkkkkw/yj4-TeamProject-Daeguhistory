import db from '../db.js';

//투어 리스트 정보 
export const getCourses = async (req, res) => {
    const user = req.user.user_no; 
    const { course_tour } = req.query;
    try {
        const query = `
        SELECT c.course_name, c.course_latitude, c.course_longitude, IF(uc.user_courses_no IS NOT NULL, 1, 0) AS visited
            FROM course c 
            LEFT JOIN users_course uc ON c.course_no = uc.course_no AND uc.user_no = ? WHERE c.course_tour = ?
        `;
        const courses = await db.execute(query, [user, course_tour]).then((result) => result[0]);
        
        return res.status(200).json({ status: 'success', message: '유저 방문 코스 리스트', data: courses });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: '서버 에러'});
    }
};

// 코스 디테일 정보
export const getCourseDeatil = async (req, res) => {
    const user = req.user.user_no; 
    const { course_name } = req.query;
    try {
        const query = `
        SELECT c.*, IF(uc.user_courses_no IS NOT NULL, 1, 0) AS visited
            FROM course c 
            LEFT JOIN users_course uc ON c.course_no = uc.course_no AND uc.user_no = ? WHERE c.course_name = ?
        `;
        
        const courseDetail = await db.execute(query, [user, course_name]).then((result) => result[0]);
        console.log(courseDetail);
        return res.status(200).json({ status: 'success', message: '유저 방문 코스 리스트', data: courseDetail });
    } catch(err) {

    }
}

// 스탬프
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
        res.status(500).json({ status: 'error', message: '서버 에러' });
    }
}