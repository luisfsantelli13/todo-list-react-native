# Lista de Tarefas - React Native + Node.js + MongoDB Atlas

Projeto da Avaliação Formadora (Competência 4), ADS Mobile, UNISUAM.

Tem duas pastas:
- `backend`: a API (Node.js + Express + Mongoose)
- `mobile`: o app (React Native + Expo)

## 1. Configurar o MongoDB Atlas

1. Cria uma conta gratuita em mongodb.com/cloud/atlas
2. Cria um projeto e clica em "Build a Database"
3. Escolhe o plano gratuito M0 Sandbox
4. Em "Database Access", cria um usuário (anota o usuário e a senha)
5. Em "Network Access", clica em "Allow Access from Anywhere" (0.0.0.0/0)
6. Quando o cluster terminar de criar: Connect > Drivers > Node.js e copia a string de conexão

## 2. Rodar o backend

```bash
cd backend
npm install
cp .env.example .env
```

Abre o `.env` e cola a string de conexão do Atlas em `MONGODB_URI`, trocando username, password e dbname pelos seus dados.

```bash
npm run dev
```

Se conectar certo, aparece no terminal:
```
Conectado ao MongoDB Atlas com sucesso!
Servidor rodando na porta 3000
```

Pra testar: abre `http://localhost:3000/api/tasks` no navegador, tem que retornar `[]`.

### Rotas da API

| Método | Rota | O que faz |
|--------|------|-----------|
| GET | /api/tasks | lista as tarefas |
| GET | /api/tasks/:id | busca uma tarefa específica |
| POST | /api/tasks | cria tarefa (manda `{ "title": "..." }`) |
| PUT | /api/tasks/:id | atualiza tarefa (title e/ou completed) |
| DELETE | /api/tasks/:id | exclui tarefa |

## 3. Rodar o app mobile

Antes, descobre o IP da sua máquina na rede:
- Windows: `ipconfig`, procura "IPv4"
- Mac/Linux: `ipconfig getifaddr en0` ou `ifconfig`

Edita `mobile/src/config/api.js` e troca pelo seu IP:
```js
export const API_URL = 'http://SEU_IP:3000/api/tasks';
```

Se for testar no emulador Android, usa `http://10.0.2.2:3000/api/tasks` em vez do IP.

```bash
cd mobile
npm install
npx expo start
```

Escaneia o QR code com o Expo Go no celular. Celular e computador precisam estar na mesma rede Wi-Fi.

## 4. O que o app faz

- Lista as tarefas (busca na API quando abre)
- Adiciona tarefa nova
- Marca/desmarca como concluída
- Exclui tarefa (pede confirmação antes)
- Mostra loading enquanto carrega
- Mostra erro com botão de tentar de novo, se a API estiver fora do ar
- Pull-to-refresh na lista

## 5. Estrutura dos arquivos

```
backend/
  src/
    models/Task.js              - schema do Mongoose
    controllers/taskController.js - lógica do CRUD
    routes/taskRoutes.js        - rotas
    server.js                   - servidor Express e conexão com o Mongo
  .env.example
  package.json

mobile/
  src/
    config/api.js                - URL da API
    services/taskService.js      - funções de fetch (GET/POST/PUT/DELETE)
    components/TaskItem.js       - item da lista de tarefas
    screens/HomeScreen.js        - tela principal
  App.js
  package.json
```
