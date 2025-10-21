const router = require('express').Router();
const db = require('../db');
const autorizacao = require('../middleware/autorizacao');

// Aplica o middleware de autorização a TODAS as rotas deste ficheiro
router.use(autorizacao);


// ----- ROTA 1: CRIAR um Projeto (POST /projetos/) -----
router.post('/', async (req, res) => {
  try {
    const { nome } = req.body;
    const utilizador_id = req.utilizador_id;

    if (!nome) {
      return res.status(400).json('O nome do projeto é obrigatório.');
    }

    const novoProjeto = await db.query(
      "INSERT INTO projetos (nome, utilizador_id) VALUES ($1, $2) RETURNING *",
      [nome, utilizador_id]
    );

    res.status(201).json(novoProjeto.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});


// ----- ROTA 2: LER todos os Projetos (GET /projetos/) -----
router.get('/', async (req, res) => {
  try {
    const utilizador_id = req.utilizador_id;

    const projetos = await db.query(
      "SELECT * FROM projetos WHERE utilizador_id = $1 ORDER BY id DESC",
      [utilizador_id]
    );
    
    res.json(projetos.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});


// ----- ROTA 3: ATUALIZAR um Projeto (PUT /projetos/:id) -----
// :id é um "parâmetro de rota". Ele vai capturar o número
// que vier no URL (ex: /projetos/1 ou /projetos/27)
router.put('/:id', async (req, res) => {
  try {
    // 1. O ID do projeto vem do URL (req.params)
    const { id: projeto_id } = req.params; 
    // 2. O ID do utilizador vem do token (req.utilizador_id)
    const utilizador_id = req.utilizador_id;
    // 3. O novo nome vem do body (req.body)
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json('O nome é obrigatório.');
    }

    // 4. Fazemos o UPDATE na BD.
    // Nós adicionamos 'utilizador_id = $3' na cláusula WHERE.
    // Isto é uma verificação de segurança CRUCIAL.
    // Garante que um utilizador só pode atualizar um projeto
    // se o projeto (projeto_id) LHE PERTENCER (utilizador_id).
    const projetoAtualizado = await db.query(
      "UPDATE projetos SET nome = $1 WHERE id = $2 AND utilizador_id = $3 RETURNING *",
      [nome, projeto_id, utilizador_id]
    );

    // 5. Se 'rows.length' for 0, significa que o projeto não foi
    // encontrado OU (mais provável) o utilizador não é o dono.
    if (projetoAtualizado.rows.length === 0) {
      return res.status(404).json('Projeto não encontrado ou não tem permissão.');
    }

    res.json(projetoAtualizado.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});


// ----- ROTA 4: APAGAR um Projeto (DELETE /projetos/:id) -----
router.delete('/:id', async (req, res) => {
  try {
    const { id: projeto_id } = req.params;
    const utilizador_id = req.utilizador_id;

    // 1. Mesma lógica de segurança do PUT.
    // Só podemos apagar o projeto ONDE o id = $1 E o dono = $2.
    const projetoApagado = await db.query(
      "DELETE FROM projetos WHERE id = $1 AND utilizador_id = $2 RETURNING *",
      [projeto_id, utilizador_id]
    );

    // 2. Se 'rows.length' for 0, o projeto não existe ou não pertence
    // ao utilizador.
    if (projetoApagado.rows.length === 0) {
      return res.status(404).json('Projeto não encontrado ou não tem permissão.');
    }
    
    // 3. (OPCIONAL: Lembras-te do 'ON DELETE CASCADE' no SQL?)
    // Ao apagar este projeto, a BD vai apagar automaticamente
    // todas as TAREFAS que pertenciam a ele!

    res.json({ mensagem: 'Projeto apagado com sucesso!' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});


module.exports = router;