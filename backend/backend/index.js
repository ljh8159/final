const express = require('express');
const cors = require('cors');
const multer = require('multer'); // 파일 업로드를 위한 multer 추가
const { Pool } = require('pg');
const app = express();
app.use(cors());
app.use(express.json());

const upload = multer(); // 메모리 저장소 사용

// PostgreSQL 연결 설정
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// 회원가입 라우트
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCheck = await pool.query('SELECT * FROM user_log_info WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.json({ success: false, message: '이미 가입된 이메일입니다.' });
    }
    await pool.query('INSERT INTO user_log_info (email, password) VALUES ($1, $2)', [email, password]);
    res.json({ success: true, message: '회원가입 성공!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

// 로그인 라우트
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query(
      'SELECT * FROM user_log_info WHERE email = $1 AND password = $2',
      [email, password]
    );
    if (user.rows.length > 0) {
      res.json({ success: true, message: '로그인 성공!' });
    } else {
      res.json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

// 신고(Report) 라우트 (파일 업로드 지원)
app.post('/report', upload.single('image'), async (req, res) => {
  console.log('body:', req.body); // 이미지 외 데이터
  console.log('file:', req.file); // 업로드된 이미지 파일
  res.json({ status: "accept", message: "신고가 접수되었습니다." });
});

// 서버 실행 (맨 아래 한 번만!)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`백엔드 서버 실행중: http://localhost:${PORT}`);
});