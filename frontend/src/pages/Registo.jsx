import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// 1. Receber o 'setAuth'
function Registo({ setAuth }) { 
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [mensagem, setMensagem] = useState('');

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMensagem(''); 

    try {
      // 2. O nosso Back-End de 'registo' devolve um token
      const res = await axios.post(
        'http://localhost:5000/auth/registo',
        formData 
      );

      // 3. [MUDANÇA] Apanhar o token e guardá-lo
      const token = res.data.token;
      localStorage.setItem('token', token);

      // 4. Avisar a App que estamos autenticados!
      setAuth(true); 
      // O App.jsx vai tratar do redirecionamento
      
      setMensagem('Utilizador registado com sucesso!'); // (Quase não se vai ver)

    } catch (err) {
      console.error('Erro do Back-End:', err.response.data);
      localStorage.removeItem('token');
      setAuth(false); // Avisa a App que falhou
      setMensagem(err.response.data || 'Erro ao registar');
    }
  };

  return (
    <div>
      <h1>Página de Registo</h1>
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
        <button type="submit">Registar</button>
      </form>
      
      {mensagem && <p style={{ color: mensagem.includes('sucesso') ? 'green' : 'red' }}>{mensagem}</p>}

      <p>
       Já tem uma conta? <Link to="/login">Entre aqui</Link>
      </p>
    </div>
  );
}

export default Registo;