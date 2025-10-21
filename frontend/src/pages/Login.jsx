import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// 1. Importar o nosso ficheiro de estilos
import styles from './Auth.module.css'; 

function Login({ setAuth }) { 
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
      const res = await axios.post(
        'http://localhost:5000/auth/login',
        formData
      );
      
      localStorage.setItem('token', res.data.token);
      setAuth(true);
      setMensagem('Login bem-sucedido!'); 
      
    } catch (err) {
      localStorage.removeItem('token');
      setAuth(false);
      setMensagem(err.response.data || 'Erro no login');
    }
  };

  // 2. Aplicar os estilos (classes) ao nosso JSX
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>Entrar na Conta</h1>
        
        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              required
              className={styles.input} 
            />
          </div>
          <div className={styles.formGroup}>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              required
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.button}>Entrar</button>
        </form>
        
        {mensagem && (
          <p className={`${styles.feedback} ${mensagem.includes('sucesso') ? styles.feedbackSuccess : styles.feedbackError}`}>
            {mensagem}
          </p>
        )}

        <p className={styles.link}>
          Não tem conta? <Link to="/registo">Crie uma aqui</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;