// 1. Importações
const router = require('express').Router();
const db = require('../db'); 
const bcrypt = require('bcryptjs'); // Já o tínhamos, mas agora vamos usá-lo no login
const jwtGenerator = require('../utils/jwtGenerator'); // A NOSSA NOVA FUNÇÃO

// ----- ROTA DE REGISTO (POST /auth/registo) -----
// (Esta rota fica exatamente igual, já está a funcionar)
router.post('/registo', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json('Email e password são obrigatórios.');
    }
    
    const utilizadorExistente = await db.query("SELECT * FROM utilizadores WHERE email = $1", [email]);
    if (utilizadorExistente.rows.length > 0) {
      return res.status(401).json('Este email já está a ser utilizado.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const novoUtilizador = await db.query(
      "INSERT INTO utilizadores (email, password_hash) VALUES ($1, $2) RETURNING *",
      [email, passwordHash]
    );

    // DEPOIS DE REGISTAR, TAMBÉM GERAMOS UM TOKEN (Login automático)
    const token = jwtGenerator(novoUtilizador.rows[0].id);
    res.status(201).json({ token }); // Enviamos o token em vez da mensagem de sucesso

  } catch (err) {
    console.error('Erro no registo:', err.message);
    res.status(500).send('Erro no servidor');
  }
});


// ----- ROTA DE LOGIN (POST /auth/login) -----
// (Esta é a nova lógica)
router.post('/login', async (req, res) => {
  try {
    // 1. Buscar email e password do body
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json('Email e password são obrigatórios.');
    }

    // 2. Verificar se o utilizador existe
    const utilizador = await db.query("SELECT * FROM utilizadores WHERE email = $1", [email]);

    if (utilizador.rows.length === 0) {
      // 401 = Unauthorized. Não dizemos "email não encontrado" por segurança,
      // para não dar pistas a atacantes.
      return res.status(401).json('Credenciais inválidas');
    }

    // 3. Verificar a Password
    // Comparamos a 'password' que o utilizador enviou
    // com o 'password_hash' que está guardado na BD.
    const passwordValida = await bcrypt.compare(
      password, // A password em texto puro
      utilizador.rows[0].password_hash // O hash guardado na BD
    );

    if (!passwordValida) {
      return res.status(401).json('Credenciais inválidas');
    }

    // 4. Se tudo estiver OK, gerar o Token (o "crachá")
    const token = jwtGenerator(utilizador.rows[0].id);
    res.json({ token });

  } catch (err) {
    console.error('Erro no login:', err.message);
    res.status(500).send('Erro no servidor');
  }
});


// 5. Exportar o router
module.exports = router;