# Lista de Tarefas (To-Do List) - React Native + Node.js + MongoDB Atlas

Projeto da Avaliação Formadora (Competência 4) — ADS Mobile, UNISUAM.

Estrutura:
```
todo-list-app/
├── backend/   → API REST (Node.js + Express + Mongoose)
└── mobile/    → App React Native (Expo)
```

---

## 1. Configurar o MongoDB Atlas

1. Crie uma conta gratuita em https://www.mongodb.com/cloud/atlas
2. Crie um projeto e clique em **"Build a Database"**
3. Escolha o plano gratuito **M0 Sandbox** (pode manter provedor/região padrão)
4. Em **"Database Access"**, crie um usuário (anote usuário e senha)
5. Em **"Network Access"**, clique em **"Allow Access from Anywhere"** (0.0.0.0/0) — só pra desenvolvimento
6. Quando o cluster estiver pronto: **Connect → Drivers → Node.js** e copie a string de conexão

---

## 2. Rodar o Backend

```bash
cd backend
npm install
cp .env.example .env
```

Abra o `.env` e cole sua string de conexão real do MongoDB Atlas em `MONGODB_URI`, trocando `<username>`, `<password>` e `<dbname>` pelos seus dados.

Depois:

```bash
npm run dev
```

Se tudo der certo, vai aparecer no terminal:
```
Conectado ao MongoDB Atlas com sucesso!
Servidor rodando na porta 3000
```

Teste no navegador ou Postman: `http://localhost:3000/api/tasks` (deve retornar `[]`)

### Endpoints da API

| Método | Rota              | Descrição                          |
|--------|-------------------|-------------------------------------|
| GET    | /api/tasks        | Lista todas as tarefas              |
| GET    | /api/tasks/:id    | Busca uma tarefa específica         |
| POST   | /api/tasks        | Cria tarefa (`{ "title": "..." }`)  |
| PUT    | /api/tasks/:id    | Atualiza tarefa (title/completed)   |
| DELETE | /api/tasks/:id    | Exclui uma tarefa                   |

---

## 3. Rodar o App Mobile

Primeiro, descubra o IP da sua máquina na rede local (necessário pra testar no celular físico com Expo Go):

- **Windows:** `ipconfig` → procure "IPv4"
- **Mac/Linux:** `ifconfig` ou `ip addr` → procure "inet"

Edite `mobile/src/config/api.js` e troque a URL pelo IP da sua máquina:
```js
export const API_URL = 'http://SEU_IP_AQUI:3000/api/tasks';
```

> Se for testar no **emulador Android**, use `http://10.0.2.2:3000/api/tasks` em vez do IP da máquina.

Depois:

```bash
cd mobile
npm install
npx expo start
```

Escaneie o QR code com o app **Expo Go** (Android/iOS) ou rode num emulador.

⚠️ **Importante:** o celular e o computador precisam estar na mesma rede Wi-Fi pra isso funcionar.

---

## 4. Funcionalidades implementadas

- ✅ Listar tarefas (busca na API ao abrir o app)
- ✅ Adicionar nova tarefa
- ✅ Marcar/desmarcar como concluída
- ✅ Excluir tarefa (com confirmação)
- ✅ Estado de carregamento (loading)
- ✅ Tratamento de erro (com botão "tentar novamente")
- ✅ Pull-to-refresh na lista

---

## 5. Estrutura de arquivos

```
backend/
├── src/
│   ├── models/Task.js          → Schema do Mongoose
│   ├── controllers/taskController.js → Lógica do CRUD
│   ├── routes/taskRoutes.js    → Definição das rotas
│   └── server.js               → Servidor Express + conexão Mongo
├── .env.example
└── package.json

mobile/
├── src/
│   ├── config/api.js           → URL base da API
│   ├── services/taskService.js → Funções fetch (GET/POST/PUT/DELETE)
│   ├── components/TaskItem.js  → Componente de cada tarefa
│   └── screens/HomeScreen.js   → Tela principal
├── App.js
└── package.json
```
