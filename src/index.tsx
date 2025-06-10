import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
// import bgImage from './picture/first_landscape.png';

const root = document.getElementById('root');
if (root) {
  //root.style.background = `url(${bgImage}) no-repeat center center`;
  root.style.backgroundSize = 'contain';
  root.style.backgroundRepeat = 'no-repeat';
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  root
);