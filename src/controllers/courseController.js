import db from '../db.js';

// 코드 리스트 전달(json파일)
export const getCourses = async (req, res) => {
    try {
        const [courses] = await db.query('SELECT * FROM course');
        res.status(200).json({ status: 'success', massage: '코스 데이터 리스트', data: courses });
    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).json({
            status: 'error',
            message: 'Database operation failed',
        });
    }
};
