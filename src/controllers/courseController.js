import db from '../db.js';

// 코드 리스트 전달(json파일)
export const getCourses = async (req, res) => {
    console.log('getCourses 함수 호출됨');
    const tt = req.get('Authorization');
    console.log(tt.split(' ')[1]);

    res.send('확인');
    try {
        const [courses] = await db.query('SELECT * FROM course');
        console.log('데이터베이스 쿼리 성공:', courses);
        res.status(200).json({ status: 'success', massage: '코스 데이터 리스트', data: courses });
    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).json({
            status: 'error',
            message: 'Database operation failed',
        });
    }
};
// 코스 스탬프
