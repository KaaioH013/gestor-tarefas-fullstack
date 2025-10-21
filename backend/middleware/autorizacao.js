const jwt = require('jsonwebtoken');
require('dotenv').config();

// Este middleware vai ser usado em todas as rotas
// que queremos proteger.
module.exports = async (req, res, next) => {
  try {
    // 1. Tirar o token do cabeçalho (header) do pedido
    // O token virá no formato "Bearer [token]"
    const jwtToken = req.header('token');

    // 2. Verificar se o token existe
    if (!jwtToken) {
      return res.status(403).json('Não autorizado'); // 403 = Forbidden
    }

    // 3. Validar o token
    // jwt.verify() vai verificar se o token foi assinado
    // com o nosso JWT_SECRET. Se for válido,
    // ele retorna o "payload" (os dados que guardámos,
    // ou seja, o { utilizador: { id: ... } }).
    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);

    // 4. Adicionar o ID do utilizador ao objeto 'req'
    // Se o token for válido, pegamos no ID do utilizador
    // que estava dentro dele e "anexamos" ao objeto 'req'.
    // Assim, as nossas rotas (ex: criar projeto)
    // vão saber QUEM está a fazer o pedido.
    req.utilizador_id = payload.utilizador.id;
    
    // 5. Chamar o 'next()'
    // 'next()' é a função que diz ao middleware: "Ok,
    // está tudo bem, podes avançar para a próxima função
    // (a rota final)."
    next();

  } catch (err) {
    console.error(err.message);
    // Se o token não for válido (ex: expirou ou foi alterado),
    // o jwt.verify() vai dar um erro, que nós apanhamos aqui.
    return res.status(401).json('Token inválido'); // 401 = Unauthorized
  }
};