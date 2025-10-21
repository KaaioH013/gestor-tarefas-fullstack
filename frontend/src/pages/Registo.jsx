import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// 1. Importar o MESMO ficheiro de estilos
import styles from './Auth.module.css';

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
      const res = await axios.post(
        'http://localhost:5000/auth/registo',
        formData 
      );
      
      localStorage.setItem('token', res.data.token);
      setAuth(true); 
      setMensagem('Utilizador registado com sucesso!');

    } catch (err) {
      console.error('Erro do Back-End:', err.response.data);
      localStorage.removeItem('token');
      setAuth(false);
      setMensagem(err.response.data || 'Erro ao registar');
    }
  };

  // 2. Aplicar os estilos
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>Criar Conta</h1>
        
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
          <button type="submit" className={styles.button}>Registar</button>
        </form>
        
        {mensagem && (
          <p className={`${styles.feedback} ${mensagem.includes('sucesso') ? styles.feedbackSuccess : styles.feedbackError}`}>
            {mensagem}
          </p>
        )}

        <p className={styles.link}>
          Já tem uma conta? <Link to="/login">Entre aqui</Link>
        </p>
      </div>
    </div>
  );
}

export default Registo;