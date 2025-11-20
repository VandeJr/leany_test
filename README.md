# **E-commerce API (NestJS Challenge)**

Esta é uma API RESTful robusta simulando um backend de e-commerce, desenvolvida como parte de um desafio técnico. O projeto utiliza **NestJS**, **TypeORM**, **PostgreSQL** e segue rigorosos padrões de arquitetura (camadas isoladas, injeção de dependência) e boas práticas de segurança.

## **🛠 Tecnologias Utilizadas**

* **Framework:** NestJS  
* **Linguagem:** TypeScript  
* **Banco de Dados:** PostgreSQL  
* **ORM:** TypeORM  
* **Containerização:** Docker & Docker Compose  
* **Autenticação:** JWT \+ Passport \+ Argon2  
* **Testes:** Jest (Unitários e Integração com SQLite em memória)  
* **Documentação:** Swagger (OpenAPI)

## **🚀 Instruções de Instalação e Execução**

Siga os passos abaixo para rodar o projeto em seu ambiente local.

### **Pré-requisitos**

* [Node.js](https://nodejs.org/) (v18 ou superior)  
* [pnpm](https://pnpm.io/) (Gerenciador de pacotes)  
* [Docker](https://www.docker.com/) e Docker Compose

### **1\. Clonar o Repositório**

git clone \<URL\_DO\_SEU\_REPOSITORIO\>  
cd leany\_test

### **2\. Instalar Dependências**

Utilize o pnpm para instalar todas as dependências listadas no package.json.

pnpm install

### **3\. Configurar Variáveis de Ambiente**

O projeto possui um arquivo de exemplo .env.example. Crie um arquivo .env na raiz do projeto e configure as variáveis.

cp .env.example .env

**⚠️ Importante:** Além das variáveis do .env.example, você deve adicionar as chaves de segurança JWT no seu .env final:

\# Adicione estas linhas ao seu .env  
JWT\_SECRET=UmaSenhaMuitoSecretaAqui  
JWT\_EXPIRES\_IN=1d

### **4\. Subir o Banco de Dados (Docker)**

Utilize o Docker Compose para subir o container do PostgreSQL (ecommerce\_db) configurado no arquivo compose.yml.

docker compose up \-d

*Aguarde alguns instantes para o banco de dados inicializar completamente.*

### **5\. Rodar a Aplicação**

Inicie o servidor em modo de desenvolvimento (com watch mode):

pnpm start:dev

O terminal deverá exibir logs indicando que a conexão com o banco foi bem-sucedida e que os módulos foram inicializados.

## **📚 Documentação da API (Swagger)**

A API está totalmente documentada utilizando Swagger. Após iniciar a aplicação, acesse o seguinte endpoint no seu navegador:

👉 **URL:** http://localhost:3000/api/docs

Lá você encontrará todos os endpoints disponíveis, schemas dos DTOs e poderá testar as requisições diretamente.

## **🧪 Rodando os Testes**

O projeto inclui testes unitários, de integração (utilizando SQLite em memória para simular o banco) e E2E.

\# Rodar testes unitários e de integração  
pnpm test

\# Rodar testes E2E (Ponta a Ponta)  
pnpm test:e2e

\# Verificar cobertura de testes  
pnpm test:cov

## **🔐 Guia de Uso e Autenticação**

A API possui rotas públicas e rotas protegidas. Para acessar as rotas protegidas (ex: Carrinho, Pedidos), siga o fluxo:

1. **Criar Usuário:** Utilize a rota POST /users para criar uma conta.  
2. **Login:** Utilize a rota POST /auth/login com o e-mail e senha criados.  
3. **Obter Token:** A resposta do login conterá um access\_token.  
4. **Autenticar no Swagger:**  
   * Clique no botão **Authorize** (cadeado) no topo da página do Swagger.  
   * Cole o token JWT.  
   * Clique em **Authorize**.  
5. Agora você pode fazer requisições para rotas como POST /cart/items ou POST /orders que o sistema identificará seu usuário automaticamente.

### **Observações Adicionais**

* **Integrações:**  
  * Rota de CEP: GET /integrations/cep/{cep} (Proxy para ViaCEP).  
  * Rota de Pokemon: GET /integrations/pokemon (Proxy para PokeAPI com paginação).  
* **Banco de Dados:** O TypeORM está configurado com synchronize: true e autoLoadEntities: true para facilitar o desenvolvimento, criando as tabelas automaticamente ao iniciar.
