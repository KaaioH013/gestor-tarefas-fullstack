import React, { useState, useEffect } from 'react';

// 1. Importar as ferramentas do Router, incluindo o 'Navigate'
import { Routes, Route, Navigate } from 'react-router-dom';

// 2. Importar as nossas 3 páginas
import Login from './pages/Login';
import Registo from './pages/Registo';
import Dashboard from './pages/Dashboard';

function App() {
  // 3. O "Estado de Autenticação"
  // Esta é a memória principal da app.
  // 'true' = utilizador logado, 'false' = não logado.
  // Começa como 'false'.
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 4. Função para MUDAR o estado de autenticação
  // Vamos "passar" esta função para as páginas de Login,
  // Registo e Dashboard.
  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  // 5. [MUITO IMPORTANTE] Verificar o Token ao Carregar a App
  // O 'useEffect' com '[]' no fim corre SÓ UMA VEZ
  // quando a app é carregada pela primeira vez.
  useEffect(() => {
    // Vamos ao localStorage ver se existe um 'token'
    const token = localStorage.getItem('token');
    
    if (token) {
      // Se existir, definimos a app como 'autenticada'
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []); // O '[]' garante que isto só corre uma vez


  // 6. O "Gestor de Rotas" (Agora com Lógica)
  return (
    <Routes>
      
      {/* Rota de Login */}
      <Route 
        path="/login" 
        element={
          !isAuthenticated ? (
            <Login setAuth={setAuth} /> // Se NÃO está auth, mostra Login
          ) : (
            <Navigate to="/" /> // Se JÁ está auth, redireciona para o Dashboard
          )
        } 
      />
      
      {/* Rota de Registo */}
      <Route 
        path="/registo" 
        element={
          !isAuthenticated ? (
            <Registo setAuth={setAuth} /> // Se NÃO está auth, mostra Registo
          ) : (
            <Navigate to="/" /> // Se JÁ está auth, redireciona para o Dashboard
          )
        } 
      />

      {/* Rota principal (Dashboard) - A NOSSA ROTA PRIVADA */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Dashboard setAuth={setAuth} /> // Se ESTÁ auth, mostra o Dashboard
          ) : (
            <Navigate to="/login" /> // Se NÃO está auth, redireciona para o Login
          )
        } 
      />
      
    </Routes>
  );
}

export default App;