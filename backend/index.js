const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL 연결 설정
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// 회원가입 라우트
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 이미 존재하는 이메일 체크
    const userCheck = await pool.query('SELECT * FROM user_log_info WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.json({ success: false, message: '이미 가입된 이메일입니다.' });
    }
    // 회원정보 저장
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

// Render 환경에서는 반드시 process.env.PORT 사용!
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`백엔드 서버 실행중: http://localhost:${PORT}`);
});