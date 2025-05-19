import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styles from '../styles/LoginPage.module.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert('로그인 시도: ' + username);
  };

  const handleSignup = () => {
    history.push('/signup'); // 회원가입 페이지로 이동
  };

  return (
    <div className={styles.bodyBackground}>
      <div className={styles.container}>
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
      </div>
    </div>
  );
}

export default LoginPage;