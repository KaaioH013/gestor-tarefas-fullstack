import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListaTarefas from '/components/ListaTarefas.jsx'; 
// 1. Importar o nosso novo CSS Module
import styles from './Dashboard.module.css';

function Dashboard({ setAuth }) {
  
  const [projetos, setProjetos] = useState([]);
  const [nomeNovoProjeto, setNomeNovoProjeto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [projetoAtivo, setProjetoAtivo] = useState(null);
  const [editandoProjeto, setEditandoProjeto] = useState(null);
  const [novoNomeProjeto, setNovoNomeProjeto] = useState('');

  // (Todas as funções de lógica getProjetos, onSubmitNovoProjeto, 
  // onApagarProjeto, onEditarProjeto, onLogout 
  // ficam EXATAMENTE IGUAIS a antes)

  const getProjetos = async () => {
    try {
      const res = await axios.get(
        'http://localhost:5000/projetos/', 
        { headers: { token: localStorage.getItem('token') } }
      );
      setProjetos(res.data);
    } catch (err) {
      console.error(err.response.data);
      if (err.response.status === 401 || err.response.status === 403) {
        setAuth(false);
      }
    }
  };

  useEffect(() => {
    if (!projetoAtivo) {
      getProjetos();
    }
  }, [projetoAtivo]); 

  const onSubmitNovoProjeto = async (e) => {
    e.preventDefault();
    setMensagem('');
    try {
      const res = await axios.post(
        'http://localhost:5000/projetos/',
        { nome: nomeNovoProjeto },
        { headers: { token: localStorage.getItem('token') } }
      );
      setProjetos([res.data, ...projetos]);
      setNomeNovoProjeto('');
    } catch (err) {
      console.error(err.response.data);
      setMensagem(err.response.data || 'Erro ao criar projeto');
    }
  };

  const onApagarProjeto = async (projeto_id) => {
    try {
      if (!window.confirm('Tens a certeza? Apagar um projeto apaga TODAS as suas tarefas!')) {
        return;
      }
      await axios.delete(
        `http://localhost:5000/projetos/${projeto_id}`,
        { headers: { token: localStorage.getItem('token') } }
      );
      setProjetos(projetos.filter(p => p.id !== projeto_id));
    } catch (err) {
      console.error(err.response.data);
      setMensagem(err.response.data || 'Erro ao apagar projeto');
    }
  };

  const onEditarProjeto = async (e, projeto_id) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/projetos/${projeto_id}`,
        { nome: novoNomeProjeto },
        { headers: { token: localStorage.getItem('token') } }
      );
      setProjetos(
        projetos.map(p => 
          p.id === projeto_id ? res.data : p
        )
      );
      setEditandoProjeto(null);
      setNovoNomeProjeto('');
    } catch (err) {
      console.error(err.response.data);
      setMensagem(err.response.data || 'Erro ao editar projeto');
    }
  };

  const onLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    setAuth(false);
  };

  // --- O HTML (JSX) com ESTILOS ---

  // Se 'projetoAtivo' for um objeto, mostra as tarefas
  // (Vamos estilizar este componente no PRÓXIMO PASSO)
  if (projetoAtivo) {
    return (
      <ListaTarefas 
        projeto={projetoAtivo} 
        onVoltar={() => setProjetoAtivo(null)}
      />
    );
  }

  // Caso contrário, mostra a lista de projetos (Dashboard)
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Meus Projetos</h1>
        <button onClick={onLogout} className={styles.logoutButton}>Sair</button>
      </div>

      <h2>Criar Novo Projeto</h2>
      <form onSubmit={onSubmitNovoProjeto} className={styles.formNovoProjeto}>
        <input 
          type="text" 
          placeholder="Nome do novo projeto..."
          value={nomeNovoProjeto}
          onChange={(e) => setNomeNovoProjeto(e.target.value)}
          required
        />
        <button type="submit">Criar</button>
      </form>
      
      {mensagem && <p style={{ color: 'red' }}>{mensagem}</p>}

      <h2>Lista de Projetos</h2>
      {projetos.length === 0 ? (
        <p>Ainda não tens projetos. Cria um!</p>
      ) : (
        <ul className={styles.listaProjetos}>
          {projetos.map(projeto => (
            <li key={projeto.id} className={styles.projetoItem}>
              
              {editandoProjeto === projeto.id ? (
                // Formulário de Edição
                <form onSubmit={(e) => onEditarProjeto(e, projeto.id)} className={styles.formEditarProjeto}>
                  <input 
                    type="text"
                    value={novoNomeProjeto}
                    onChange={(e) => setNovoNomeProjeto(e.target.value)}
                    required
                  />
                  <button type="submit">Guardar</button>
                  <button onClick={() => setEditandoProjeto(null)}>Cancelar</button>
                </form>
              ) : (
                // Vista Normal
                <div className={styles.projetoVistaNormal}>
                  <span 
                    onClick={() => setProjetoAtivo(projeto)}
                    className={styles.projetoNome}
                  >
                    {projeto.nome}
                  </span>
                  <div className={styles.projetoBotoes}>
                    <button onClick={() => {
                      setEditandoProjeto(projeto.id); 
                      setNovoNomeProjeto(projeto.nome);
                    }}>
                      Editar
                    </button>
                    <button onClick={() => onApagarProjeto(projeto.id)}>
                      Apagar
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;