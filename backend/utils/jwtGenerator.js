const jwt = require('jsonwebtoken');
require('dotenv').config(); // Para aceder ao JWT_SECRET

function jwtGenerator(utilizador_id) {
  // O "payload" são os dados que queremos guardar dentro do token
  // Vamos guardar apenas o ID do utilizador.
  const payload = {
    utilizador: {
      id: utilizador_id
    }
  };

  // jwt.sign() cria o token.
  // Ele recebe:
  // 1. O payload (os dados)
  // 2. O segredo (do .env)
  // 3. Opções (ex: "expira em 1 hora")
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = jwtGenerator;