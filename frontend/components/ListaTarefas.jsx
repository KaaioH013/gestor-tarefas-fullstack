import React, { useState, useEffect } from 'react';
import axios from 'axios';
// 1. Importar o nosso novo CSS Module
import styles from './ListaTarefas.module.css';

function ListaTarefas({ projeto, onVoltar }) {
  
  const [tarefas, setTarefas] = useState([]); 
  const [novaTarefaDesc, setNovaTarefaDesc] = useState(''); 
  const [mensagem, setMensagem] = useState('');

  // (Todas as funções de lógica getTarefas, onSubmitNovaTarefa, 
  // onToggleConcluida, onApagarTarefa 
  // ficam EXATAMENTE IGUAIS a antes)

  const getTarefas = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/tarefas/${projeto.id}`, 
        { headers: { token: localStorage.getItem('token') } }
      );
      setTarefas(res.data); 
    } catch (err) {
      console.error(err.response.data);
      setMensagem(err.response.data || 'Erro ao buscar tarefas');
    }
  };

  useEffect(() => {
    getTarefas();
  }, [projeto.id]); 

  const onSubmitNovaTarefa = async (e) => {
    e.preventDefault();
    setMensagem('');
    try {
      const res = await axios.post(
        'http://localhost:5000/tarefas/',
        { 
          descricao: novaTarefaDesc,
          projeto_id: projeto.id 
        },
        { headers: { token: localStorage.getItem('token') } }
      );
      setTarefas([res.data, ...tarefas]);
      setNovaTarefaDesc(''); 
    } catch (err) {
      console.error(err.response.data);
      setMensagem(err.response.data || 'Erro ao criar tarefa');
    }
  };
  
  const onToggleConcluida = async (tarefa) => {
    try {
      const novoEstado = !tarefa.concluida;
      const res = await axios.put(
        `http://localhost:5000/tarefas/${tarefa.id}`,
        {
          descricao: tarefa.descricao, 
          concluida: novoEstado        
        },
        { headers: { token: localStorage.getItem('token') } }
      );
      setTarefas(
        tarefas.map(t => 
          t.id === tarefa.id ? res.data : t 
        )
      );
    } catch (err) {
      console.error(err.response.data);
      setMensagem(err.response.data || 'Erro ao atualizar tarefa');
    }
  };

  const onApagarTarefa = async (tarefa_id) => {
    try {
      await axios.delete(
        `http://localhost:5000/tarefas/${tarefa_id}`,
        { headers: { token: localStorage.getItem('token') } }
      );
      setTarefas(
        tarefas.filter(t => t.id !== tarefa_id)
      );
    } catch (err) {
      console.error(err.response.data);
      setMensagem(err.response.data || 'Erro ao apagar tarefa');
    }
  };

  // --- O HTML (JSX) com ESTILOS ---
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button onClick={onVoltar} className={styles.voltarButton}>&larr; Voltar</button>
        <h2>{projeto.nome}</h2>
      </div>
      
      <h3>Adicionar Tarefa</h3>
      <form onSubmit={onSubmitNovaTarefa} className={styles.formNovaTarefa}>
        <input 
          type="text"
          placeholder="Descrição da nova tarefa..."
          value={novaTarefaDesc}
          onChange={(e) => setNovaTarefaDesc(e.target.value)}
          required
        />
        <button type="submit">Adicionar</button>
      </form>
      
      {mensagem && <p style={{ color: 'red' }}>{mensagem}</p>}
      
      <h3>Lista de Tarefas</h3>
      {tarefas.length === 0 ? (
        <p>Este projeto ainda não tem tarefas.</p>
      ) : (
        <ul className={styles.listaTarefas}>
          {tarefas.map(tarefa => (
            <li key={tarefa.id} className={styles.tarefaItem}>
              
              {/* Vê esta lógica: aplicamos classes CSS diferentes
                  com base no estado 'tarefa.concluida' */}
              <span 
                className={
                  tarefa.concluida 
                    ? styles.tarefaDescricaoConcluida 
                    : styles.tarefaDescricaoPendente
                }
              >
                {tarefa.descricao}
              </span>
              
              <div className={styles.tarefaBotoes}>
                <button onClick={() => onToggleConcluida(tarefa)}>
                  {tarefa.concluida ? 'Desfazer' : 'Concluir'}
                </button>
                <button onClick={() => onApagarTarefa(tarefa.id)}>
                  Apagar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListaTarefas;