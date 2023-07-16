import ReactDOM from 'react-dom/client';
import './index.css';
import Router from './routes/routes.tsx';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  // </React.StrictMode>
);
