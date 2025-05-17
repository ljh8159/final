import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;