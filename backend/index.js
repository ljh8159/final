const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(__dirname, 'users.json');

app.post('/signup', (req, res) => {
  const { email, password } = req.body;
  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  }
  // 이미 존재하는 이메일 체크
  if (users.find(u => u.email === email)) {
    return res.json({ success: false, message: '이미 가입된 이메일입니다.' });
  }
  users.push({ email, password });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.json({ success: true, message: '회원가입 성공!' });
});

// Render 환경에서는 반드시 process.env.PORT 사용!
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`백엔드 서버 실행중: http://localhost:${PORT}`);
});