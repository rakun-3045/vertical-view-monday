import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import mondaySdk from 'monday-sdk-js';

// Initialize monday SDK
const monday = mondaySdk();
monday.setApiVersion("2023-10");

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
