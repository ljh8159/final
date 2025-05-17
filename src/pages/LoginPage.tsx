import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from '../styles/LoginPage.module.css';

function LoginPage() {
  const history = useHistory();

  return (
    <div>
      {/* 로그인 폼은 나중에 추가 */}
      <button
        onClick={() => history.push('/signup')}
        className={styles.signupButton}
      >
        회원가입
      </button>
    </div>
  );
}

export default LoginPage;