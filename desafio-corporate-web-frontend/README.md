# Notes App - Aplicação de Anotações

Uma aplicação de anotações moderna e responsiva inspirada no Google Keep, desenvolvida com React, Tailwind CSS e integração com backend NestJS.

## 🚀 Funcionalidades

- ✅ **Criar Anotações**: Interface intuitiva para criar novas anotações com título e conteúdo
- ✅ **Editar Anotações**: Edição completa de anotações existentes
- ✅ **Deletar Anotações**: Remoção segura com confirmação
- ✅ **Buscar Anotações**: Sistema de busca em tempo real por título e conteúdo
- ✅ **Interface Responsiva**: Design adaptável para diferentes tamanhos de tela
- ✅ **Modo Online/Offline**: Funciona com ou sem conexão com o backend
- ✅ **Feedback Visual**: Indicadores de carregamento e mensagens de status
- ✅ **Design Clean**: Interface moderna inspirada no Google Keep

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces de usuário
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de interface pré-construídos
- **Lucide React** - Ícones modernos
- **Vite** - Build tool e servidor de desenvolvimento

### Backend (Integração)
- **NestJS** - Framework Node.js para APIs
- **PostgreSQL** - Banco de dados relacional
- **Prisma** - ORM para TypeScript/JavaScript

## 📁 Estrutura do Projeto

```
notes-app/
├── src/
│   ├── components/
│   │   └── ui/          # Componentes shadcn/ui
│   ├── services/
│   │   └── notesApi.js  # Serviço de integração com API
│   ├── App.jsx          # Componente principal
│   ├── App.css          # Estilos globais
│   └── main.jsx         # Ponto de entrada
├── public/              # Arquivos estáticos
├── package.json         # Dependências e scripts
└── README.md           # Este arquivo
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- pnpm (ou npm/yarn)

### Instalação e Execução

1. **Clone o repositório** (se aplicável)
   ```bash
   git clone <url-do-repositorio>
   cd notes-app
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   pnpm run dev
   ```

4. **Acesse a aplicação**
   - Abra [http://localhost:5173](http://localhost:5173) no navegador

### Executar com Backend

Para funcionalidade completa, certifique-se de que o backend NestJS esteja rodando:

1. **Configure o backend NestJS** (em outro terminal)
   ```bash
   # No diretório do backend
   npm run start:dev
   ```

2. **Verifique a URL da API**
   - A aplicação está configurada para `http://localhost:3000`
   - Ajuste em `src/services/notesApi.js` se necessário

## 🔧 Configuração da API

### Endpoints Utilizados

A aplicação integra com os seguintes endpoints do backend NestJS:

- `POST /note` - Criar nova anotação
- `GET /note?title=...` - Buscar anotações por título
- `GET /note/content/:title` - Obter conteúdo completo de uma anotação
- `PUT /note/:title` - Atualizar anotação existente
- `DELETE /note/:title` - Deletar anotação

### Estrutura dos Dados

```typescript
// NoteUpsertDTO (Criar/Atualizar)
{
  title: string;
  content: string;
}

// NoteReadDTO (Resposta)
{
  title: string;
  content: string;
  // outros campos conforme modelo do backend
}
```

## 🎨 Design e UX

### Características do Design
- **Layout em Grid**: Anotações organizadas em cards responsivos
- **Cores Suaves**: Paleta inspirada no Google Keep com tons amarelos
- **Hover Effects**: Interações visuais suaves
- **Indicadores de Status**: Feedback visual para ações do usuário
- **Modo Offline**: Funcionalidade degradada quando backend indisponível

### Responsividade
- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**: Adaptação automática para tablet e desktop
- **Grid Responsivo**: 1-4 colunas dependendo do tamanho da tela

## 🔄 Estados da Aplicação

### Modo Online
- Integração completa com backend NestJS
- Sincronização em tempo real
- Validação de dados no servidor

### Modo Offline
- Dados mockados para demonstração
- Funcionalidades básicas mantidas
- Indicador visual de status offline

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm run dev          # Servidor de desenvolvimento
pnpm run dev --host   # Servidor acessível na rede

# Build
pnpm run build        # Build para produção
pnpm run preview      # Preview do build

# Qualidade de Código
pnpm run lint         # Verificar código com ESLint
```

## 🤝 Integração com Backend

### Configuração do Backend NestJS

Certifique-se de que seu backend NestJS tenha:

1. **CORS habilitado** para permitir requisições do frontend
2. **Endpoints implementados** conforme especificação
3. **Validação de dados** usando DTOs
4. **Tratamento de erros** adequado

### Exemplo de Configuração CORS (NestJS)

```typescript
// main.ts
app.enableCors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

## 📝 Próximas Funcionalidades

- [ ] Autenticação de usuários
- [ ] Categorias/Tags para anotações
- [ ] Anexos de arquivos
- [ ] Compartilhamento de anotações
- [ ] Modo escuro
- [ ] Sincronização offline
- [ ] Exportação de dados

## 🐛 Solução de Problemas

### Backend não conecta
- Verifique se o backend está rodando na porta 3000
- Confirme se o CORS está configurado corretamente
- Ajuste a URL base em `src/services/notesApi.js`

### Erro de dependências
```bash
# Limpar cache e reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Problemas de build
```bash
# Verificar versão do Node.js
node --version  # Deve ser 18+

# Build limpo
pnpm run build
```

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e demonstração de integração frontend-backend.

---

**Desenvolvido com ❤️ usando React + Tailwind CSS + NestJS**
