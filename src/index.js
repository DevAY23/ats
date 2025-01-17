import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App'; // Import App component
import './index.css';


ReactDOM.render(
  <BrowserRouter> {/* Wrap the App with BrowserRouter */}
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
