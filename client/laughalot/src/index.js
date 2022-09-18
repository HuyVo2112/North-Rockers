import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './Home';
import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import './Home.css'; 
import App from './App';
import Login from './Login'
let isLoggedIn = false;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <App />
  
);

// If you want to start measuring performance in your Home, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
