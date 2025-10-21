import React, { useState, useEffect } from 'react';
import axios from 'axios';

// (props: projeto, onVoltar)
function ListaTarefas({ projeto, onVoltar }) {
  
  const [tarefas, setTarefas] = useState([]); 
  const [novaTarefaDesc, setNovaTarefaDesc] = useState(''); 
  const [mensagem, setMensagem] = useState('');

  // --- Função GET TAREFAS (sem alteração) ---
  const getTarefas = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/tarefas/${projeto.id}`, 
        {
          headers: { token: localStorage.getItem('token') }
        }
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

  
  // --- Função POST TAREFA (sem alteração) ---
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
        { 
          headers: { token: localStorage.getItem('token') } 
        }
      );
      
      setTarefas([res.data, ...tarefas]);
      setNovaTarefaDesc(''); 

    } catch (err) {
      console.error(err.response.data);
      setMensagem(err.response.data || 'Erro ao criar tarefa');
    }
  };

  
  // --- [NOVA FUNÇÃO] ATUALIZAR TAREFA (Concluída/Não Concluída) ---
  const onToggleConcluida = async (tarefa) => {
    try {
      // 1. O Back-End espera a 'descricao' E 'concluida'
      //    Vamos inverter o estado atual de 'concluida'
      const novoEstado = !tarefa.concluida;
      
      const res = await axios.put(
        `http://localhost:5000/tarefas/${tarefa.id}`,
        {
          descricao: tarefa.descricao, // Mantém a descrição igual
          concluida: novoEstado        // Envia o novo estado
        },
        {
          headers: { token: localStorage.getItem('token') }
        }
      );

      // 2. [ATUALIZAÇÃO OTIMISTA]
      //    Em vez de recarregar a lista (getTarefas()),
      //    vamos só atualizar esta tarefa na nossa lista 'tarefas'
      setTarefas(
        tarefas.map(t => 
          t.id === tarefa.id ? res.data : t 
          // Se 't.id' for o da tarefa que mudámos, 
          // substitui-o pela resposta da API (res.data). 
          // Senão, mantém a tarefa 't' igual.
        )
      );
      
    } catch (err) {
      console.error(err.response.data);
      setMensagem(err.response.data || 'Erro ao atualizar tarefa');
    }
  };


  // --- [NOVA FUNÇÃO] APAGAR TAREFA ---
  const onApagarTarefa = async (tarefa_id) => {
    try {
      // 1. Chamar o DELETE na API
      await axios.delete(
        `http://localhost:5000/tarefas/${tarefa_id}`,
        {
          headers: { token: localStorage.getItem('token') }
        }
      );
      
      // 2. [ATUALIZAÇÃO OTIMISTA]
      //    Vamos filtrar a nossa lista de 'tarefas',
      //    mantendo apenas as que NÃO têm o 'tarefa_id'
      setTarefas(
        tarefas.filter(t => t.id !== tarefa_id)
      );

    } catch (err) {
      console.error(err.response.data);
      setMensagem(err.response.data || 'Erro ao apagar tarefa');
    }
  };


  // --- O HTML (JSX) ---
  return (
    <div>
      <button onClick={onVoltar}>&larr; Voltar aos Projetos</button>
      
      <h2>Tarefas de: {projeto.nome}</h2>
      
      {/* Formulário (sem alteração) */}
      <form onSubmit={onSubmitNovaTarefa}>
        <input 
          type="text"
          placeholder="Nova tarefa..."
          value={novaTarefaDesc}
          onChange={(e) => setNovaTarefaDesc(e.target.value)}
          required
        />
        <button type="submit">Adicionar</button>
      </form>
      
      {mensagem && <p style={{ color: 'red' }}>{mensagem}</p>}
      
      {/* Lista de Tarefas (COM ALTERAÇÕES) */}
      {tarefas.length === 0 ? (
        <p>Este projeto ainda não tem tarefas.</p>
      ) : (
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {tarefas.map(tarefa => (
            <li 
              key={tarefa.id} 
              style={{ 
                // [ESTILO NOVO] Se 'concluida' for true, risca o texto
                textDecoration: tarefa.concluida ? 'line-through' : 'none',
                margin: '10px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              {/* O texto da tarefa */}
              {tarefa.descricao}
              
              {/* [BOTÕES NOVOS] */}
              <div>
                <button onClick={() => onToggleConcluida(tarefa)}>
                  {tarefa.concluida ? 'Desfazer' : 'Concluir'}
                </button>
                <button 
                  onClick={() => onApagarTarefa(tarefa.id)} 
                  style={{ marginLeft: '10px' }}
                >
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