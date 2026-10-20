import React from 'react';
import ReactDOM from 'react-dom/client';
// Fontes embutidas no projeto (sem depender do Google Fonts)
import '@fontsource-variable/archivo/wdth';
import '@fontsource/big-shoulders-stencil-display/900';
import './index.css';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

