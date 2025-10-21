// 1. Carregar o 'dotenv' LOGO NO INÍCIO
require('dotenv').config();

// 2. Importações
const express = require('express');
const cors = require('cors'); // Importamos o CORS
const db = require('./db');

// 3. Inicialização e Middlewares
const app = express();
const PORT = 5000;

// ----- NOVAS LINHAS -----
// Middleware do CORS: Permite que o nosso (futuro) front-end
// faça pedidos para este back-end.
app.use(cors()); 

// Middleware do Express: Lê os dados JSON enviados no "body" dos pedidos (POST/PUT).
app.use(express.json()); 
// ------------------------

// 4. Rotas (Endpoints)
// ----- NOVA LINHA -----
// Rota de Autenticação:
// Dizemos à 'app' para usar o ficheiro 'auth.js'
// sempre que um pedido começar com '/auth'.
app.use('/auth', require('./routes/auth'));
// ------------------------ 
// ----- NOVA LINHA -----
// Rotas dos Projetos:
// Sempre que um pedido começar com '/projetos',
// usa o ficheiro 'projetos.js'.
app.use('/projetos', require('./routes/projetos'));
// --------------------
// ----- NOVA LINHA -----
// Rotas das Tarefas:
app.use('/tarefas', require('./routes/tarefas'));
// --------------------

// Rota Raiz (existente)
app.get('/', (req, res) => {
  res.send('Olá Mundo do nosso Gestor de Tarefas API!');
});

// Rota de Teste da BD (existente)
app.get('/testdb', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.send(`Ligação à BD bem-sucedida! Hora da BD: ${result.rows[0].now}`);
  } catch (err) {
    console.error('Erro ao ligar à Base de Dados:', err);
    res.status(500).send('Erro ao ligar à Base de Dados');
  }
});

// 5. Iniciar o Servidor
app.listen(PORT, () => {
  console.log(`Servidor a correr com sucesso na porta ${PORT}`);
});