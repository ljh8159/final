import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './pages/SignupPage';
import MapPage from './pages/MapPage';
import SplashPage from './pages/SplashPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));

  // 로그인 상태가 바뀔 때마다 감지
  useEffect(() => {
    const handleStorage = () => setIsLoggedIn(!!localStorage.getItem('user'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/splash" component={SplashPage} />
        <Route path="/login" render={(props) => <LoginPage setIsLoggedIn={setIsLoggedIn} {...props} />} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/map" render={() => (
          isLoggedIn ? <MapPage /> : <Redirect to="/login" />
        )} />
        <Route path="/" exact>
          <Redirect to="/splash" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;