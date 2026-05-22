import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "./fixLeafletIcon";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
const style = document.createElement("style");
style.innerHTML = `
@keyframes slideUp {
  from { transform: translateY(40px); opacity:0 }
  to { transform: translateY(0); opacity:1 }
}
@keyframes zoomIn {
  from { transform: scale(0.8); opacity:0 }
  to { transform: scale(1); opacity:1 }
}
`;
document.head.appendChild(style);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
