# 🏥 MedClinic API

API RESTful para gestão e autenticação de usuários em uma clínica médica, desenvolvida com **Node.js**, **TypeScript**, **Express** e **TypeORM** integrado ao banco de dados **PostgreSQL**. A aplicação implementa autenticação segura via **JWT (JSON Web Token)** e controle de acesso baseado em papéis (**RBAC - Role-Based Access Control**).

---

## 📑 Sumário

- [Visão Geral](#-visão-geral)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Perfis de Acesso (RBAC)](#-perfis-de-acesso-rbac)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
  - [1. Clonar o Repositório](#1-clonar-o-repositório)
  - [2. Instalar Dependências](#2-instalar-dependências)
  - [3. Configurar Variáveis de Ambiente](#3-configurar-variáveis-de-ambiente)
- [Banco de Dados](#-banco-de-dados)
  - [Criação do Banco de Dados](#criação-do-banco-de-dados)
  - [Estrutura das Tabelas (SQL)](#estrutura-das-tabelas-sql)
  - [Sincronização via TypeORM](#sincronização-via-typeorm)
- [Executando a Aplicação](#-executando-a-aplicação)
  - [Modo Desenvolvimento](#modo-desenvolvimento)
  - [Build de Produção](#build-de-produção)
  - [Modo Produção](#modo-produção)
- [Documentação dos Endpoints](#-documentação-dos-endpoints)
  - [Resumo das Rotas](#resumo-das-rotas)
  - [Autenticação (`/auth`)](#autenticação-auth)
    - [POST /auth/register](#post-authregister)
    - [POST /auth/login](#post-authlogin)
  - [Usuário (`/user`)](#usuário-user)
    - [GET /user/me](#get-userme)
  - [Administração (`/admin`)](#administração-admin)
    - [GET /admin/ping](#get-adminping)
- [Tratamento de Erros](#-tratamento-de-erros)
- [Estrutura de Diretórios](#-estrutura-de-diretórios)

---

## 🎯 Visão Geral

O **MedClinic API** fornece a infraestrutura backend para gerenciar os colaboradores da clínica médica (atendentes e administradores), garantindo:

- Cadastro seguro de usuários com hash de senhas via `bcrypt`.
- Validação estrita de contratos de entrada via DTOs (`class-validator` e `class-transformer`).
- Autenticação stateless via `JWT`.
- Restrição de endpoints protegidos por perfis (`ADMIN` vs `ATENDENTE`).
- Camada de manipulação centralizada de exceções (`AppError` e `errorMiddleware`).

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia                                                          | Versão  | Descrição                                                           |
| :------------------------------------------------------------------ | :------ | :------------------------------------------------------------------ |
| [Node.js](https://nodejs.org/)                                      | >= 18.x | Ambiente de execução JavaScript server-side                         |
| [TypeScript](https://www.typescriptlang.org/)                       | ^6.0.0  | Superset tipado do JavaScript                                       |
| [Express](https://expressjs.com/)                                   | ^5.2.1  | Microframework web para roteamento e middlewares                    |
| [PostgreSQL](https://www.postgresql.org/)                           | >= 14   | Banco de dados relacional                                           |
| [TypeORM](https://typeorm.io/)                                      | ^1.1.1  | ORM para mapeamento de entidades e persistência (Data Mapper)       |
| [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)                | ^6.0.0  | Algoritmo de hash para armazenamento seguro de senhas               |
| [JSON Web Token](https://jwt.io/)                                   | ^9.0.3  | Padrão de token para autenticação stateless                         |
| [Class-Validator](https://github.com/typestack/class-validator)     | ^0.15.1 | Validação declarativa baseada em decorators para DTOs               |
| [Class-Transformer](https://github.com/typestack/class-transformer) | ^0.5.1  | Transformação de objetos planos em instâncias de classes DTO        |
| [ts-node-dev](https://github.com/wclr/ts-node-dev)                  | ^2.0.0  | Reinicialização automática e compilação em tempo de desenvolvimento |
| [Dotenv](https://github.com/motdotla/dotenv)                        | ^17.4.2 | Gerenciamento de variáveis de ambiente                              |

---

## 🏛️ Arquitetura do Projeto

A aplicação adota uma arquitetura em camadas baseada no padrão **MVC**, promovendo o desacoplamento de responsabilidades, facilidade de manutenção e testabilidade:

### Divisão das Camadas:

1. **`Routes` (`src/routes/`)**: Mapeamento das rotas HTTP, acoplando middlewares e direcionando a execução para os respectivos controladores.
2. **`Middlewares` (`src/middlewares/`)**:
   - `validateDTO`: Valida os dados de entrada das requisições contra as regras declaradas nos DTOs antes de atingir o controller.
   - `authMiddleware`: Extrai o Bearer token do header `Authorization`, valida a assinatura JWT e injeta os dados do usuário (`sub`, `role`) em `req.user`.
   - `roleMiddleware`: Garante que apenas usuários com o perfil requerido (ex.: `ADMIN`) possam acessar rotas restritas.
   - `asyncHandler`: Encapsula funções assíncronas de rotas para repassar erros não tratados diretamente ao pipeline de erro do Express.
   - `errorMiddleware`: Intercepta erros conhecidos (`AppError`) e inesperados (500), devolvendo respostas padronizadas em formato JSON.
3. **`Controllers` (`src/controllers/`)**: Responsáveis pelo recebimento dos parâmetros HTTP, chamada dos serviços adequados e formatação do status HTTP e corpo da resposta.
4. **`Services` (`src/services/`)**: Centralizam a lógica de negócio (ex.: verificação de duplicidade de email, aplicação de hash com `bcrypt` e criação de entidades).
5. **`Repositories` (`src/repositories/`)**: Encapsulam a comunicação com o banco de dados através da instância do repositório TypeORM.
6. **`Entities` (`src/entities/`)**: Modelagem das tabelas do banco de dados relacional com decorators TypeORM.
7. **`DTOs` (`src/dtos/`)**: Estruturas de dados fortemente tipadas contendo regras de validação para requests (`CreateUserDTO`, `LoginUserDTO`).
8. **`Utils` (`src/utils/`)**: Funções reutilizáveis para geração/verificação de tokens JWT, hash de senhas e higienização de objetos (ex.: remoção do campo `senha` das respostas).

---

## 👥 Perfis de Acesso (RBAC)

O sistema conta com dois perfis de acesso definidos pelo enum `UserRole`:

| Perfil          | Descrição                | Permissões                                                                                                                                                                                                                        |
| :-------------- | :----------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`ADMIN`**     | Administrador do sistema | Acesso total a todas as rotas da API, incluindo rotas exclusivas de gerenciamento administrativo (`/admin/*`).                                                                                                                    |
| **`ATENDENTE`** | Atendente da clínica     | Perfil padrão atribuído a novos cadastros caso a role não seja especificada. Acesso a recursos públicos e ao seu próprio perfil (`/user/me`). Bloqueado de rotas com `roleMiddleware(UserRole.ADMIN)` com status `403 Forbidden`. |

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

- **[Node.js](https://nodejs.org/)** (versão 18.x ou superior recomendada)
- **[npm](https://www.npmjs.com/)** (geralmente instalado junto ao Node.js)
- **[PostgreSQL](https://www.postgresql.org/)** (v14 ou superior) em execução local ou via container Docker
- **[Git](https://git-scm.com/)**

---

## ⚙️ Instalação e Configuração

### 1. Clonar o Repositório

```bash
git clone https://github.com/ViktorAmorim/MedClinic-API.git
cd MedClinic-API
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (ou copie a partir do exemplo abaixo):

```env
# Porta do Servidor HTTP
PORT=3000

# Conexão com o PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha_aqui
DB_DATABASE=MedClinic_api
DB_SSL=false

# Autenticação JWT
JWT_SECRET=sua_chave_secreta_super_segura
JWT_EXPIRES_IN=1d
```

#### Descrição das Variáveis de Ambiente:

| Variável         | Obrigatória | Padrão / Exemplo | Descrição                                                         |
| :--------------- | :---------: | :--------------- | :---------------------------------------------------------------- |
| `PORT`           |     Sim     | `3000`           | Porta onde o servidor Express irá escutar as requisições.         |
| `DB_HOST`        |     Sim     | `localhost`      | Endereço de rede do banco de dados PostgreSQL.                    |
| `DB_PORT`        |     Sim     | `5432`           | Porta TCP do PostgreSQL (ex.: 5432 ou 5433).                      |
| `DB_USERNAME`    |     Sim     | `postgres`       | Usuário para autenticação no PostgreSQL.                          |
| `DB_PASSWORD`    |     Sim     | `******`         | Senha de acesso ao banco de dados.                                |
| `DB_DATABASE`    |     Sim     | `MedClinic_api`  | Nome da base de dados no PostgreSQL.                              |
| `DB_SSL`         |     Não     | `false`          | Define se a conexão com o banco utilizará SSL/TLS.                |
| `JWT_SECRET`     |     Sim     | `secret_string`  | Segredo utilizado para assinar e validar os tokens JWT.           |
| `JWT_EXPIRES_IN` |     Sim     | `1d`             | Tempo de expiração do token gerado (ex.: `1h`, `8h`, `1d`, `7d`). |

---

## 🗄️ Banco de Dados

### Criação do Banco de Dados

Conecte-se ao seu PostgreSQL via terminal (`psql`) ou gerenciador visual (DBeaver, pgAdmin) e crie a base de dados:

```sql
CREATE DATABASE "MedClinic_api";
```

### Estrutura das Tabelas (SQL)

Caso deseje criar o schema manualmente via SQL (conforme arquivo `src/database/schema.sql`), execute o script abaixo:

```sql
-- Criação do tipo ENUM para os perfis de usuário
CREATE TYPE user_role AS ENUM ('ADMIN', 'ATENDENTE');

-- Criação da tabela de usuários
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR NOT NULL,
    role user_role NOT NULL DEFAULT 'ATENDENTE',
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

> [!NOTE]
> O PostgreSQL versão 13 ou superior já possui a função `gen_random_uuid()` nativamente. Para versões anteriores, habilite a extensão via `CREATE EXTENSION IF NOT EXISTS "pgcrypto";`.

### Sincronização via TypeORM

O arquivo `src/database/data-source.ts` está configurado com `synchronize: true` em ambiente de desenvolvimento. Isso significa que, ao inicializar a aplicação, o TypeORM criará automaticamente a tabela e as constraints caso elas ainda não existam.

---

## 🚀 Executando a Aplicação

### Modo Desenvolvimento

Inicia a aplicação com monitoramento de arquivos e reinicialização automática em tempo real via `ts-node-dev`:

```bash
npm run dev
```

O servidor estará disponível em: `http://localhost:3000`

### Build de Produção

Compila os arquivos TypeScript para código JavaScript otimizado na pasta `dist/`:

```bash
npm run build
```

### Modo Produção

Executa o código compilado gerado na pasta `dist/`:

```bash
npm start
```

---

## 📡 Documentação dos Endpoints

### Resumo das Rotas

| Método | Endpoint         |   Autenticação   |     Perfil Mínimo      | Descrição                                    |
| :----: | :--------------- | :--------------: | :--------------------: | :------------------------------------------- |
| `POST` | `/auth/register` |     Pública      |        Qualquer        | Cadastra um novo usuário no sistema          |
| `POST` | `/auth/login`    |     Pública      |        Qualquer        | Autentica o usuário e retorna o Token JWT    |
| `GET`  | `/user/me`       | Sim (Bearer JWT) | `ATENDENTE` ou `ADMIN` | Retorna os dados do usuário autenticado      |
| `GET`  | `/admin/ping`    | Sim (Bearer JWT) |        `ADMIN`         | Rota de teste exclusiva para administradores |

---

### Autenticação (`/auth`)

#### `POST /auth/register`

Cadastra um novo colaborador na clínica.

- **Headers:** `Content-Type: application/json`
- **Autenticação:** Não requer.
- **Corpo da Requisição (JSON):**

```json
{
  "nome": "Dr. Carlos Silva",
  "email": "carlos.silva@medclinic.com",
  "senha": "senhaSegura123",
  "role": "ADMIN"
}
```

> [!TIP]
> O campo `role` é opcional. Caso omitido, o usuário será criado com o perfil padrão `"ATENDENTE"`. Os valores permitidos são `"ADMIN"` ou `"ATENDENTE"`. O campo `senha` deve ter no mínimo 6 caracteres.

- **Resposta de Sucesso (Status 201 Created):**

```json
{
  "id": "c1f7a6e2-54b9-4821-82a0-435728a50de9",
  "nome": "Dr. Carlos Silva",
  "email": "carlos.silva@medclinic.com",
  "role": "ADMIN",
  "criado_em": "2026-09-09T18:30:00.000Z"
}
```

- **Respostas de Erro:**
  - **400 Bad Request** (Validação ou campos obrigatórios ausentes):
    ```json
    {
      "message": "Validação falhou",
      "errors": [
        {
          "property": "email",
          "constraints": {
            "isEmail": "email must be an email"
          }
        }
      ]
    }
    ```
  - **409 Conflict** (Email já cadastrado):
    ```json
    {
      "message": "Email já cadastrado."
    }
    ```

---

#### `POST /auth/login`

Autentica o usuário no sistema gerando um token JWT.

- **Headers:** `Content-Type: application/json`
- **Autenticação:** Não requer.
- **Corpo da Requisição (JSON):**

```json
{
  "email": "carlos.silva@medclinic.com",
  "senha": "senhaSegura123"
}
```

- **Resposta de Sucesso (Status 200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMWY3YTZlMi01NGI5LTQ4MjEtODJhMC00MzU3MjhhNTBkZTkiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE2ODU1MDAwMDAsImV4cCI6MTY4NTU4NjQwMH0.signature...",
  "user": {
    "id": "c1f7a6e2-54b9-4821-82a0-435728a50de9",
    "nome": "Dr. Carlos Silva",
    "email": "carlos.silva@medclinic.com",
    "role": "ADMIN",
    "criado_em": "2026-09-09T18:30:00.000Z"
  }
}
```

- **Respostas de Erro:**
  - **400 Bad Request** (Campos ausentes ou payload inválido):
    ```json
    {
      "message": "Email e senha são obrigatorios"
    }
    ```
  - **401 Unauthorized** (Credenciais inválidas):
    ```json
    {
      "message": "Email ou senha incorretos"
    }
    ```

---

### Usuário (`/user`)

#### `GET /user/me`

Retorna as informações do usuário autenticado a partir do token fornecido.

- **Headers:**
  - `Authorization`: `Bearer <token_jwt>`
- **Autenticação:** Requer token válido.
- **Permissão:** `ADMIN` ou `ATENDENTE`.

- **Resposta de Sucesso (Status 200 OK):**

```json
{
  "id": "c1f7a6e2-54b9-4821-82a0-435728a50de9",
  "nome": "Dr. Carlos Silva",
  "email": "carlos.silva@medclinic.com",
  "role": "ADMIN",
  "criado_em": "2026-09-09T18:30:00.000Z"
}
```

- **Respostas de Erro:**
  - **401 Unauthorized** (Token não enviado ou inválido):
    ```json
    {
      "message": "Token nao informado"
    }
    ```
    ou
    ```json
    {
      "message": "Token invalido"
    }
    ```
  - **404 Not Found** (Usuário do token não encontrado no banco):
    ```json
    {
      "message": "Usuario nao encontrado"
    }
    ```

---

### Administração (`/admin`)

#### `GET /admin/ping`

Verifica a conectividade e o privilégio de acesso à área administrativa da clínica.

- **Headers:**
  - `Authorization`: `Bearer <token_jwt>`
- **Autenticação:** Requer token válido.
- **Permissão:** Exclusivo para perfil **`ADMIN`**.

- **Resposta de Sucesso (Status 200 OK):**

```json
{
  "message": "Area administrativa acessada com sucesso"
}
```

- **Respostas de Erro:**
  - **401 Unauthorized** (Token ausente ou inválido):
    ```json
    {
      "message": "Token nao informado"
    }
    ```
  - **403 Forbidden** (Usuário autenticado não possui privilégios de `ADMIN`):
    ```json
    {
      "message": "Acesso negado"
    }
    ```

---

## 🛡️ Tratamento de Erros

A API possui um middleware global de interceptação de erros (`errorMiddleware`). Todas as exceções da classe customizada `AppError` retornam status HTTP e mensagem estruturada:

```json
{
  "message": "Descrição amigável do erro"
}
```

Erros imprevistos do servidor retornam status `500`:

```json
{
  "message": "Erro interno no servidor"
}
```

---

## 📂 Estrutura de Diretórios

```plaintext
MedClinic-API/
├── src/
│   ├── controllers/         # Controladores da aplicação (recebem req, retornam res)
│   │   ├── AdminController.ts
│   │   ├── AuthController.ts
│   │   └── UserController.ts
│   ├── database/            # Configuração de conexão e schema do banco de dados
│   │   ├── data-source.ts
│   │   └── schema.sql
│   ├── dtos/                # Data Transfer Objects com validações de entrada
│   │   ├── CreateUserDTO.ts
│   │   └── LoginUserDTO.ts
│   ├── entities/            # Entidades mapeadas pelo TypeORM
│   │   └── User.ts
│   ├── errors/              # Classes de tratamento de erros customizados
│   │   └── AppError.ts
│   ├── middlewares/         # Interceptadores de requisição (Auth, RBAC, Validação, Erros)
│   │   ├── asyncHandler.ts
│   │   ├── authMiddleware.ts
│   │   ├── errorMiddleware.ts
│   │   ├── roleMiddleware.ts
│   │   └── validateDTO.ts
│   ├── repositories/        # Repositórios para operações de banco de dados
│   │   └── UserRepository.ts
│   ├── routes/              # Definição e agrupamento de rotas da aplicação
│   │   ├── admin.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── index.ts
│   │   └── user.routes.ts
│   ├── services/            # Camada de lógica de negócio e regras da clínica
│   │   ├── AuthService.ts
│   │   └── UserService.ts
│   ├── utils/               # Utilitários (JWT, bcrypt, sanitização de objetos)
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   └── removePassword.ts
│   └── server.ts            # Ponto de entrada da aplicação Express e TypeORM
├── .env                     # Variáveis de ambiente locais (ignorado no git)
├── .env.example             # Modelo de exemplo para variáveis de ambiente
├── .gitignore               # Arquivos e diretórios ignorados pelo Git
├── package.json             # Manifesto de dependências e scripts do projeto
├── tsconfig.json            # Configurações do compilador TypeScript
└── README.md                # Documentação técnica oficial do projeto
```
