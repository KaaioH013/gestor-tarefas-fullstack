-- Vamos apagar as tabelas se elas já existirem, para podermos
-- executar este script várias vezes sem erros (bom para testes).
DROP TABLE IF EXISTS tarefas;
DROP TABLE IF EXISTS projetos;
DROP TABLE IF EXISTS utilizadores;

-- 1. Tabela de Utilizadores
-- Guarda as informações de login.
CREATE TABLE utilizadores (
    id SERIAL PRIMARY KEY, -- 'SERIAL' cria um número que se auto-incrementa. 'PRIMARY KEY' diz que este é o identificador único.
    email VARCHAR(255) UNIQUE NOT NULL, -- 'VARCHAR(255)' é um texto até 255 caracteres. 'UNIQUE' garante que não há emails repetidos. 'NOT NULL' diz que é obrigatório.
    password_hash VARCHAR(255) NOT NULL -- Vamos guardar a password *encriptada* (hash), nunca em texto puro.
);

-- 2. Tabela de Projetos
-- Cada projeto pertence a UM utilizador.
CREATE TABLE projetos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    utilizador_id INTEGER NOT NULL, -- Este campo vai guardar o 'id' do utilizador dono do projeto.
    
    -- Esta é a "chave estrangeira" (Foreign Key).
    -- Ela garante que o 'utilizador_id' nesta tabela TEM de corresponder
    -- a um 'id' existente na tabela 'utilizadores'.
    -- 'ON DELETE CASCADE' significa que se um utilizador for apagado,
    -- todos os seus projetos são apagados automaticamente.
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores (id) ON DELETE CASCADE
);

-- 3. Tabela de Tarefas
-- Cada tarefa pertence a UM projeto.
CREATE TABLE tarefas (
    id SERIAL PRIMARY KEY,
    descricao TEXT NOT NULL, -- 'TEXT' é para textos mais longos, sem limite fixo.
    concluida BOOLEAN DEFAULT FALSE, -- 'BOOLEAN' é verdadeiro/falso. 'DEFAULT FALSE' significa que quando uma tarefa é criada, começa como "não concluída".
    projeto_id INTEGER NOT NULL,
    
    -- Chave estrangeira que liga a tarefa ao projeto.
    -- Se um projeto for apagado, todas as suas tarefas
    -- (graças ao ON DELETE CASCADE) serão apagadas também.
    FOREIGN KEY (projeto_id) REFERENCES projetos (id) ON DELETE CASCADE
);