import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Find the HTML element with id 'root' (located in public/index.html)
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the main App component inside the root element
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);