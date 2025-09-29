# Desafio Corporate Web

> Este projeto full-stack foi criado para o desafio tecnico da empresa Corporate Web.

## Demonstração

![Demo](./docs/demo/demo.gif)

## Índice

- [ Instalação e execução](#instalação-e-execução)
- [ Tecnologias Utilizadas](#tecnologias-utilizadas)
- [ Estrutura do Projeto](#estrutura-do-projeto)
- [ Arquitetura do Sistema](#arquitetura-do-sistema)
- [ Desenvolvedor](#desenvolvedor)

## Funcionalidades

- **Desenvolvimento da API:** Implementação de um sistema de Gerenciamento de Anotações (CRUD: Criar, Ler, Atualizar, Excluir).

- **Persistência de Dados:** Integração com um banco de dados relacional local para armazenamento e gerenciamento das anotações.

- **Design de Interface:** Criação de uma interface de usuário responsiva, garantindo uma experiência consistente em desktops, tablets e dispositivos móveis.

- **Garantia de Qualidade:** Desenvolvimento de testes unitários para validar as regras de negócio e assegurar a confiabilidade e manutenibilidade do código.

- **Documentação da API:** Geração de documentação interativa e automatizada dos endpoints da API utilizando Swagger (OpenAPI).

- **Infraestrutura e Implantação:** Conteinerização da aplicação utilizando Docker e orquestração dos serviços (aplicação, banco de dados, etc.) com Docker Compose para simplificar a configuração e a implantação.

## Instalação e Execução

Existem duas maneiras de executar este projeto: utilizando Docker (recomendado) ou configurando o ambiente localmente usando Windows Powershell.

### Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) (para a execução via container)

<br>

---

### **Opção 1: Executando com Docker (Recomendado)**

Este é o método mais simples e rápido para colocar a aplicação no ar, pois ele gerencia todas as dependências e configurações automaticamente.

**1. Clone o repositório:**

```bash
git clone https://github.com/pedro-lucas-martins/desafio-corporate-web.git
```

**2. Navegue até o diretório do projeto:**

```bash
cd desafio-corporate-web
```

**3. Inicie os containers:**
Este comando irá construir as imagens (se necessário) e iniciar os serviços da aplicação e do banco de dados em segundo plano.

```bash
docker-compose up --build -d
```

_(**Nota:** O argumento `-d` executa os containers em modo "detached", liberando seu terminal.)_

**4. Pronto! A aplicação está disponível nos seguintes endereços:**

- **Aplicação (Frontend):** [`http://localhost:3001`](http://localhost:3001)
- **API (Backend):** [`http://localhost:3000`](http://localhost:3000)
- **Documentação da API (Swagger):** [`http://localhost:3000/api`](http://localhost:3000/api)
- **String de Conexão do Banco de dados:** `postgres://postgres:123@database:5434/notedb`

**Para parar a execução dos containers, utilize o comando:**

```bash
docker-compose down
```

<br>

---

### **Opção 2: Executando Localmente com Makefile (Ambiente Manual)**

Este método requer a instalação e configuração manual de todas as dependências via Windows usando powershell na sua máquina.

**1. Instale as dependências (Windows):**

- **PostgreSQL:** [Link para download](https://www.postgresql.org/download/windows/)
- **Node.js:** [Link para download](https://nodejs.org/en/download) (v20.19.5 LTS ou superior)
- **Utilitários de Build (Make):** Recomendamos usar um gerenciador de pacotes como o [Chocolatey](https://chocolatey.org/install) para instalar o `make`.
  ```powershell
  # Instala o Chocolatey (siga as instruções no site oficial)
  # Depois, instale o make:
  choco install make
  ```

**2. Clone o repositório e acesse o diretório:**

```bash
git clone https://github.com/pedro-lucas-martins/desafio-corporate-web.git
```

```bash
cd desafio-corporate-web
```

**3. Abra o arquivo Makefile e altere as seguintes variáveis de acordo com o seu PostgreSQL:**

```ini
# Configuração do Banco de Dados
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
```

**4. Instale as dependências do projeto e construa a aplicação:**
Este comando irá instalar os pacotes npm para o frontend e backend.

```bash
make build
```

**5. Inicie a aplicação:**

```bash
make start
```

_(**Nota:** Para os comandos make funcionarem, você deve estar na pasta raiz do projeto, onde o arquivo Makefile se encontra)_

**6. A aplicação estará disponível em [`http://localhost:3001`](http://localhost:3001).**

## Tecnologias Utilizadas

### **Frontend**

- **[ReactJS](https://react.dev/):**
- **[TailwindCSS](https://tailwindcss.com/):**

### **Backend**

- **[NestJS](https://nestjs.com/):**
- **[Prisma](https://www.prisma.io/):**
- **[TypeScript](https://www.typescriptlang.org/):**

### **Banco de Dados**

- **[PostgreSQL](https://www.postgresql.org/):**

### **Testes e Qualidade de Código**

- **[Jest](https://jestjs.io/):**
- **[Swagger (OpenAPI)](https://swagger.io/):**

### **Infraestrutura e DevOps**

- **[Docker](https://www.docker.com/):** Plataforma para criação e gerenciamento de contêineres.
- **[Docker Compose](https://docs.docker.com/compose/):** Ferramenta para orquestrar múltiplos contêineres.
- **[Makefile](https://www.gnu.org/software/make/):** Utilitário para automação de scripts e tarefas de build.

## Estrutura do Projeto

### Backend

```bash
desafio-corporate-web-backend/
├── config/                      # Arquivos de configuração do projeto
├── coverage/                    # Relatórios de cobertura de testes
├── decorator/                   # Decorators personalizados do NestJS
├── prisma/                      # Definição de schema e migrations do Prisma ORM
├── src/                         # Código-fonte principal da aplicação
│    ├── controller/             # Camada que recebe requisições HTTP e envia respostas
│    │   ├── dto/                # Data Transfer Objects (DTOs) para validação de dados
│    │   └── profiles/           # Perfis de mapeamento de objetos (ex: AutoMapper)
│    ├── filter/                 # Filtros para tratamento global de exceções
│    ├── infrastructure/         # Módulos e serviços de infraestrutura (ex: conexão com banco)
│    ├── model/                  # Definição dos modelos/entidades de domínio
│    ├── repository/             # Camada de repositório para abstrair o acesso aos dados
│    └── service/                # Camada de serviço, onde reside a lógica de negócio
├── test/                        # Testes automatizados (unitários e e2e)
├── Dockerfile                   # Dockerfile para containerização do backend
└── ...                          # Outros arquivos de configuração (package.json, tsconfig.json, etc.)
```

### Frontend

```bash
desafio-corporate-web-frontend/
├── public/                      # Arquivos estáticos (favicon, imagens, etc.)
├── src/                         # Código-fonte principal da aplicação
│    ├── components/             # Pasta para componentes React reutilizáveis
│    │   └── ui/                 # Componentes de UI genéricos (botões, inputs, cards, etc.)
│    ├── hooks/                  # Hooks customizados para lógica reutilizável
│    ├── lib/                    # Funções utilitárias e helpers da aplicação
│    ├── services/               # Camada de serviço para comunicação com APIs
│    └── types/                  # Definições de tipos e interfaces TypeScript
├── nginx.conf                   # Configuração do Nginx para servir a aplicação em produção
├── Dockerfile                   # Dockerfile para containerização do frontend
└── ...                          # Outros arquivos de configuração (tailwind, postcss, etc.)
```

## Arquitetura do Sistema

A aplicação é organizada em uma arquitetura de **três camadas**, containerizada via **Docker** e gerenciada via **Docker Compose**:

![Arch](./docs/demo/archi.png)

## Desenvolvedor

<table>
    <tr>
        <td align="center">
            <a href="https://github.com/pedro-lucas-martins">
                <img
                    src="https://avatars.githubusercontent.com/u/104742715?s=400&u=880b177e66f184d14f02c2f6c8e591cf240eeded&v=4"
                    width="100px;"
                    alt="Profile Image Pedro Lucas"
                />
                </br>
                <sub>
                    <b>Pedro Lucas</b>
                </sub>
            </a>
        </td>
        <td align="center">
            <p>Pedro Lucas –
                <a href="contato.plmartins@gmail.com">
                    contato.plmartins@gmail.com
                </a>
            </p>
        </td>
    </tr>
