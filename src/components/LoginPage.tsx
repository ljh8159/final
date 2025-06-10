import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styles from '../styles/LoginPage.module.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function LoginPage({ setIsLoggedIn }: { setIsLoggedIn: (v: boolean) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('user', username);
        setIsLoggedIn(true); // 상태 업데이트
        history.push('/map');
      } else {
        alert(data.message || '로그인 실패');
      }
    } catch (err) {
      alert('로그인 실패');
    }
  };

  const handleSignup = () => {
    history.push('/signup');
  };

  return (
    <div className={styles.bodyBackground}>
      <div className={styles.container}>
        <img
          src={process.env.PUBLIC_URL + '/picture/floodmark.png'}
          alt="로그인 이미지"
          style={{
            width: '100%',
            height: 220,
            objectFit: 'contain',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            marginBottom: 12,
          }}
        />
        <div
          style={{
            fontWeight: 900,
            fontSize: 32,
            letterSpacing: '2px',
            marginBottom: 24,
            color: '#fff',
            background: 'linear-gradient(90deg, #4b89e5 0%, #ffd600 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '2px 2px 8px rgba(75,137,229,0.15), 0 2px 8px #ffd60044'
          }}
        >
          도로뚫이단
        </div>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.inputField}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputField}
            required
          />
          <button type="submit" className={styles.loginButton}>로그인</button>
          <button type="button" className={styles.signupButton} onClick={handleSignup}>회원가입</button>
        </form>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <img
            src={process.env.PUBLIC_URL + '/picture/moismark.png'} // 실제 마크 파일명으로 변경
            alt="행정안전부 마크"
            style={{ height: 200, objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;