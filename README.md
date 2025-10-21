# Gestor de Tarefas Full Stack (Stack PERN)

Este é um projeto completo de um Gestor de Tarefas (To-Do List com Projetos), construído do zero com a stack PERN (PostgreSQL, Express, React, Node.js) para fins de portfólio.

A aplicação permite que os utilizadores se registem, façam login, e depois criem "Projetos" para organizar as suas "Tarefas" pessoais.

*(Opcional: Tira uma captura de ecrã da tua aplicação final e cola-a aqui!)*

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído como um monorepo (um único repositório) contendo duas aplicações separadas: o `backend` (API) e o `frontend` (Cliente React).

### **Back-End (O "Cérebro")**
* **Node.js:** Ambiente de execução.
* **Express:** Framework para criar a API RESTful.
* **PostgreSQL:** Base de dados relacional para guardar os dados.
* **node-postgres (`pg`):** Driver para ligar o Node.js ao PostgreSQL.
* **JSON Web Tokens (`jsonwebtoken`):** Para autenticação segura e gestão de "crachás" (tokens).
* **bcrypt.js:** Para encriptação (hashing) segura das passwords dos utilizadores.
* **Dotenv:** Para gerir variáveis de ambiente (segredos da BD, segredo do JWT).
* **CORS:** Para permitir a comunicação entre o front-end e o back-end.

### **Front-End (O "Rosto")**
* **React (com Vite):** Biblioteca para construir a interface de utilizador.
* **React Router (`react-router-dom`):** Para criar as diferentes "páginas" (rotas) da aplicação (Login, Registo, Dashboard).
* **Axios:** Cliente HTTP para "falar" com a API do back-end.
* **CSS Modules:** Para criar estilos com "scope" (isolados) para cada componente, evitando conflitos de CSS.
* **Gestão de Estado:** Usando os hooks `useState` e `useEffect` do React para gerir o estado de autenticação e os dados da API.

---

## ✨ Funcionalidades (Features)

* **Autenticação Completa:**
    * Registo de novo utilizador (com password encriptada).
    * Login de utilizador (com verificação de password).
    * Geração de Token JWT no login/registo.
    * Gestão de estado de autenticação no front-end (`localStorage`).
    * Botão de Logout.

* **Rotas Protegidas (Front-End e Back-End):**
    * O Back-End protege as rotas da API com um middleware que verifica o Token JWT.
    * O Front-End protege as rotas (ex: `/`) e redireciona o utilizador para `/login` se ele não estiver autenticado.

* **CRUD de Projetos:**
    * O utilizador logado pode **Criar** novos projetos.
    * O utilizador logado pode **Ler** (Ver) apenas os *seus* projetos.
    * O utilizador logado pode **Atualizar** (Editar o nome) dos *seus* projetos.
    * O utilizador logado pode **Apagar** os *seus* projetos (o que também apaga todas as tarefas dentro dele, graças ao `ON DELETE CASCADE` no SQL).

* **CRUD de Tarefas:**
    * O utilizador pode **Criar** tarefas *dentro* de um projeto que lhe pertence.
    * O utilizador pode **Ler** as tarefas de um projeto específico.
    * O utilizador pode **Atualizar** uma tarefa (marcar como concluída/desfazer ou editar a descrição - *Nota: a edição da descrição foi feita no passo 2.9*).
    * O utilizador pode **Apagar** uma tarefa.

---

## 🛠️ Como Executar Localmente

Para correr este projeto na tua máquina, vais precisar de ter o **Node.js** e o **PostgreSQL** instalados.

**1. Clona o Repositório**
```bash
git clone [https://github.com/teu-nome/gestor-tarefas-fullstack.git](https://github.com/teu-nome/gestor-tarefas-fullstack.git)
cd gestor-tarefas-fullstack
```

**2. Configurar e Ligar o Back-End (O "Cérebro")**
```bash
# Entra na pasta do backend
cd backend

# Instala as dependências
npm install
```
Cria a tua base de dados PostgreSQL. Podes usar o pgAdmin. Cria uma base de dados chamada gestor_tarefas.

Executa o script SQL que está em backend/database.sql dentro do teu pgAdmin (usando a "Query Tool"). Isto vai criar as tabelas utilizadores, projetos, e tarefas.

Na pasta backend/, cria um ficheiro chamado .env.

Copia o conteúdo do .env.example (ou cola isto) para dentro do .env e preenche com os teus dados:
```bash
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=gestor_tarefas
DB_PASSWORD=A_TUA_PASSWORD_DO_POSTGRES
DB_PORT=5432
JWT_SECRET=oMeuSegredoSuperSecreto12345
```
Finalmente, liga o servidor do back-end (ele vai correr em http://localhost:5000):
```bash
npm run server
```
**3. Configurar e Ligar o Front-End (O "Rosto")**
```bash
# (Se estiveres em 'backend/', escreve 'cd ..')
cd frontend

# Instala as dependências
npm install
```
Liga o servidor de desenvolvimento do front-end (ele vai correr em http://localhost:5173 ou similar):
```bash
npm run dev
```
Pronto! Agora podes abrir http://localhost:5173 no teu browser e usar a aplicação!
