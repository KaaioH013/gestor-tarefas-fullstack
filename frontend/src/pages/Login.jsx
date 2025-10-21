import React, { useState } from 'react';
import axios from 'axios';
// O 'useNavigate' JÁ NÃO É PRECISO AQUI
import { Link } from 'react-router-dom';

// 1. Receber o 'setAuth' que o App.jsx nos "passou"
function Login({ setAuth }) { 
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [mensagem, setMensagem] = useState('');
  
  // O 'navigate' já não é preciso
  // const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      const res = await axios.post(
        'http://localhost:5000/auth/login',
        formData
      );
      
      const token = res.data.token;
      localStorage.setItem('token', token);
      
      // 2. [MUDANÇA] Em vez de redirecionar,
      //    chamamos o setAuth(true).
      //    Isto "avisa" o App.jsx que estamos logados.
      //    O App.jsx vai re-renderizar e fazer o
      //    redirecionamento por nós!
      setAuth(true);
      setMensagem('Login bem-sucedido!'); // (Esta mensagem mal se vai ver)

      // 3. Já não precisamos do 'setTimeout' nem do 'navigate'
      
    } catch (err) {
      localStorage.removeItem('token');
      setAuth(false); // Avisa a App que o login falhou
      setMensagem(err.response.data || 'Erro no login');
    }
  };

  return (
    <div>
      <h1>Página de Login</h1>
      {/* O resto do formulário fica igual */}
      <form onSubmit={onSubmit}>
        {/* ... inputs ... */}
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
      
      {mensagem && <p style={{ color: mensagem.includes('sucesso') ? 'green' : 'red' }}>{mensagem}</p>}

      <p>
        Não tem conta? <Link to="/registo">Crie uma aqui</Link>
      </p>
    </div>
  );
}

export default Login;