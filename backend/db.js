// 1. Importar o 'Pool' do 'pg'
const { Pool } = require('pg');

// 2. Importar e configurar o 'dotenv'
// Temos de o carregar aqui para garantir que process.env
// tem os valores do .env ANTES de o Pool ser criado.
require('dotenv').config();

// 3. Criar a instância do Pool (A PARTE CORRIGIDA)
// Agora, em vez de um Pool() vazio, passamos um
// objeto de configuração que "mapeia" as nossas
// variáveis do .env para os campos que o Pool espera.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// 4. Exportar o método para fazer 'queries' (isto fica igual)
module.exports = {
  query: (text, params) => pool.query(text, params),
};