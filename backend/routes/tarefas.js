const router = require('express').Router();
const db = require('../db');
const autorizacao = require('../middleware/autorizacao');

// Aplica o middleware de autorização a TODAS as rotas
router.use(autorizacao);

// ----- ROTA 1: CRIAR uma Tarefa (POST /tarefas/) -----
// (Código do passo anterior, sem alterações)
router.post('/', async (req, res) => {
  try {
    const utilizador_id = req.utilizador_id;
    const { descricao, projeto_id } = req.body;

    if (!descricao || !projeto_id) {
      return res.status(400).json('Descrição e ID do Projeto são obrigatórios.');
    }

    const projetoDono = await db.query(
      "SELECT id FROM projetos WHERE id = $1 AND utilizador_id = $2",
      [projeto_id, utilizador_id]
    );

    if (projetoDono.rows.length === 0) {
      return res.status(403).json('Não tem permissão para adicionar tarefas a este projeto.');
    }
    
    const novaTarefa = await db.query(
      "INSERT INTO tarefas (descricao, projeto_id) VALUES ($1, $2) RETURNING *",
      [descricao, projeto_id]
    );

    res.status(201).json(novaTarefa.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});


// ----- ROTA 2: LER todas as Tarefas de UM Projeto (GET /tarefas/:id_do_projeto) -----
// (Código do passo anterior, sem alterações)
router.get('/:id_do_projeto', async (req, res) => {
  try {
    const utilizador_id = req.utilizador_id;
    const { id_do_projeto } = req.params;

    const projetoDono = await db.query(
      "SELECT id FROM projetos WHERE id = $1 AND utilizador_id = $2",
      [id_do_projeto, utilizador_id]
    );

    if (projetoDono.rows.length === 0) {
      return res.status(403).json('Não tem permissão para ver este projeto.');
    }

    const tarefas = await db.query(
      "SELECT * FROM tarefas WHERE projeto_id = $1 ORDER BY id ASC",
      [id_do_projeto]
    );
    
    res.json(tarefas.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});


// ----- ROTA 3: ATUALIZAR uma Tarefa (PUT /tarefas/:id) -----
// :id aqui é o ID da TAREFA
router.put('/:id', async (req, res) => {
  try {
    // 1. O ID do utilizador vem do token
    const utilizador_id = req.utilizador_id;
    // 2. O ID da tarefa vem do URL
    const { id: tarefa_id } = req.params;
    // 3. Os dados a atualizar vêm do body
    const { descricao, concluida } = req.body;

    if (!descricao || typeof concluida !== 'boolean') {
        return res.status(400).json('Descrição e estado (concluida) são obrigatórios.');
    }

    // 4. [A GRANDE CONSULTA DE SEGURANÇA]
    // Vamos fazer o UPDATE na tabela 'tarefas' (T)
    // MAS vamos "Juntar" (FROM) com a tabela 'projetos' (P)
    // A cláusula WHERE faz a magia:
    //    - T.id = $3 (atualiza a tarefa correta)
    //    - T.projeto_id = P.id (liga a tarefa ao seu projeto)
    //    - P.utilizador_id = $4 (VERIFICA SE O DONO DO PROJETO é o utilizador logado)
    const tarefaAtualizada = await db.query(
      `UPDATE tarefas T 
       SET descricao = $1, concluida = $2
       FROM projetos P
       WHERE T.id = $3 AND T.projeto_id = P.id AND P.utilizador_id = $4
       RETURNING T.*`,
      [descricao, concluida, tarefa_id, utilizador_id]
    );

    // 5. Se 'rows.length' for 0, a tarefa não foi encontrada OU
    // (mais importante) o utilizador não é o dono dela.
    if (tarefaAtualizada.rows.length === 0) {
      return res.status(404).json('Tarefa não encontrada ou não tem permissão.');
    }

    res.json(tarefaAtualizada.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});


// ----- ROTA 4: APAGAR uma Tarefa (DELETE /tarefas/:id) -----
// :id é o ID da TAREFA
router.delete('/:id', async (req, res) => {
  try {
    const utilizador_id = req.utilizador_id;
    const { id: tarefa_id } = req.params;

    // 1. [MESMA LÓGICA DE SEGURANÇA DO PUT]
    // Usamos 'USING' (similar ao FROM) para ligar as tabelas.
    // Só apaga a tarefa (T) ONDE T.id = $1
    // E (E) o projeto (P) associado a ela
    // pertence ao utilizador (P.utilizador_id = $2)
    const tarefaApagada = await db.query(
      `DELETE FROM tarefas T
       USING projetos P
       WHERE T.id = $1 AND T.projeto_id = P.id AND P.utilizador_id = $2
       RETURNING T.id`,
      [tarefa_id, utilizador_id]
    );
    
    // 2. Se 'rows.length' for 0, a tarefa não foi encontrada ou
    // o utilizador não tem permissão.
    if (tarefaApagada.rows.length === 0) {
      return res.status(404).json('Tarefa não encontrada ou não tem permissão.');
    }

    res.json({ mensagem: 'Tarefa apagada com sucesso!' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});


module.exports = router;