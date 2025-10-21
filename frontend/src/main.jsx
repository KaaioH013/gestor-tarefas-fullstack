import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 1. Importar o BrowserRouter
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Envolver (wrap) a nossa <App /> com o <BrowserRouter>
        Isto "liga" o sistema de rotas à nossa aplicação inteira. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)