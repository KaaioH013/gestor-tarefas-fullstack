import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListaTarefas from '/components/ListaTarefas.jsx'; // O teu caminho corrigido

function Dashboard({ setAuth }) {
  
  const [projetos, setProjetos] = useState([]);
  const [nomeNovoProjeto, setNomeNovoProjeto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [projetoAtivo, setProjetoAtivo] = useState(null);
  
  // [NOVO ESTADO] Para guardar o ID do projeto que estamos a editar
  const [editandoProjetoId, setEditandoProjetoId] = useState(null);
  // [NOVO ESTADO] Para guardar o NOVO NOME do projeto
  const [novoNomeProjeto, setNovoNomeProjeto] = useState('');


  // --- FUNÇÕES DE BUSCAR/CRIAR PROJETOS (sem alteração) ---
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
    // Só busca os projetos se NÃO estivermos a ver as tarefas
    if (!projetoAtivo) {
      getProjetos();
    }
  }, [projetoAtivo]); // Re-busca quando 'projetoAtivo' muda (ex: quando voltamos)

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


  // --- [NOVA FUNÇÃO] APAGAR UM PROJETO ---
  const onApagarProjeto = async (projeto_id) => {
    // Pergunta ao utilizador se tem a certeza
    if (!window.confirm("Tens a certeza? Apagar um projeto apaga TODAS as suas tarefas!")) {
      return; // Cancela se o utilizador clicar "Cancelar"
    }
    
    try {
      await axios.delete(
        `http://localhost:5000/projetos/${projeto_id}`,
        { headers: { token: localStorage.getItem('token') } }
      );
      
      // Atualiza a lista de projetos, filtrando o que foi apagado
      setProjetos(projetos.filter(p => p.id !== projeto_id));
      
    } catch (err) {
      console.error(err.response.data);
      setMensagem(err.response.data || 'Erro ao apagar projeto');
    }
  };

  
  // --- [NOVAS FUNÇÕES] LÓGICA DE ATUALIZAR PROJETO ---
  
  // Função 1: Chamada quando clicamos em "Editar"
  // Ativa o modo de edição para esse projeto
  const onAtivarEdicao = (projeto) => {
    setEditandoProjetoId(projeto.id); // Guarda o ID do projeto
    setNovoNomeProjeto(projeto.nome); // Coloca o nome atual na caixa de texto
  };

  // Função 2: Chamada quando submetemos a edição (clicamos "Guardar")
  const onGuardarEdicao = async (projeto_id) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/projetos/${projeto_id}`,
        { nome: novoNomeProjeto }, // Envia o novo nome
        { headers: { token: localStorage.getItem('token') } }
      );
      
      // Atualiza a lista de projetos com o nome novo
      setProjetos(
        projetos.map(p => 
          p.id === projeto_id ? res.data : p
        )
      );
      
      // Desativa o modo de edição
      setEditandoProjetoId(null);
      setNovoNomeProjeto('');
      
    } catch (err) {
      console.error(err.response.data);
      setMensagem(err.response.data || 'Erro ao atualizar projeto');
    }
  };

  
  // --- FUNÇÃO DE LOGOUT (sem alteração) ---
  const onLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    setAuth(false);
  };


  // --- O HTML (JSX) ---
  
  // Se 'projetoAtivo', mostra o componente de Tarefas (sem alteração)
  if (projetoAtivo) {
    return (
      <ListaTarefas 
        projeto={projetoAtivo} 
        onVoltar={() => setProjetoAtivo(null)} 
      />
    );
  }

  // Senão, mostra o Dashboard de Projetos (com alterações)
  return (
    <div>
      <h1>Dashboard (Meus Projetos)</h1>
      <button onClick={onLogout}>Sair</button>
      <hr />

      {/* Formulário de Criar (sem alteração) */}
      <h2>Criar Novo Projeto</h2>
      <form onSubmit={onSubmitNovoProjeto}>
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

      {/* Lista de Projetos (COM ALTERAÇÕES) */}
      <h2>Meus Projetos</h2>
      {projetos.length === 0 ? (
        <p>Ainda não tens projetos. Cria um!</p>
      ) : (
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {projetos.map(projeto => (
            <li 
              key={projeto.id} 
              style={{ 
                margin: '10px 0',
                padding: '10px',
                border: '1px solid #ccc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              
              {/* [LÓGICA DE EDIÇÃO] */}
              {editandoProjetoId === projeto.id ? (
                // Se estamos a editar ESTE projeto, mostra um input
                <>
                  <input 
                    type="text"
                    value={novoNomeProjeto}
                    onChange={(e) => setNovoNomeProjeto(e.target.value)}
                  />
                  <button onClick={() => onGuardarEdicao(projeto.id)}>Guardar</button>
                </>
              ) : (
                // Senão, mostra o nome normal e os botões
                <>
                  <span 
                    onClick={() => setProjetoAtivo(projeto)}
                    style={{ cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    {projeto.nome}
                  </span>
                  
                  <div>
                    <button onClick={() => onAtivarEdicao(projeto)}>
                      Editar
                    </button>
                    <button 
                      onClick={() => onApagarProjeto(projeto.id)}
                      style={{ marginLeft: '10px' }}
                    >
                      Apagar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;