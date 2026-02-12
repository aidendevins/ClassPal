import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Testing from './Testing';
import Grading from './Grading';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/testing" element={<Testing />} />
        <Route path="/grading" element={<Grading />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
