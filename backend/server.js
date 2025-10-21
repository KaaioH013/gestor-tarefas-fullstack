// 1. Carregar o 'dotenv' LOGO NO INÍCIO
// Isto carrega as variáveis do ficheiro .env para process.env
require('dotenv').config();

// 2. Importar o Express
const express = require('express');

// 3. Importar o nosso módulo de Base de Dados (db.js)
const db = require('./db');

// 4. Inicializar o Express
const app = express();
const PORT = 5000;

// 5. Criar a Rota Raiz (existente)
app.get('/', (req, res) => {
  res.send('Olá Mundo do nosso Gestor de Tarefas API!');
});

// 6. NOVA ROTA: Rota para Testar a Ligação à BD
// Vamos fazer um 'SELECT NOW()' que é um comando SQL
// simples que pede à BD a hora atual.
app.get('/testdb', async (req, res) => {
  try {
    // db.query() é a função que exportámos do db.js
    const result = await db.query('SELECT NOW()');
    
    // Se funcionar, enviamos a hora que a BD nos deu
    // result.rows é um array com os resultados.
    res.send(`Ligação à BD bem-sucedida! Hora da BD: ${result.rows[0].now}`);
  } catch (err) {
    // Se falhar, enviamos o erro
    console.error('Erro ao ligar à Base de Dados:', err);
    res.status(500).send('Erro ao ligar à Base de Dados');
  }
});


// 7. Iniciar o Servidor
app.listen(PORT, () => {
  console.log(`Servidor a correr com sucesso na porta ${PORT}`);
});