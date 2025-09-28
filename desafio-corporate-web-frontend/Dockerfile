# ===== Estágio 1: Builder =====
# Usamos uma imagem Node.js leve para construir a aplicação.
# O alias 'builder' nos permite referenciar este estágio posteriormente.
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do contêiner.
WORKDIR /app

# Copia os arquivos de manifesto de pacotes para o diretório de trabalho.
# Usar um wildcard (*) para o lockfile garante que funcione mesmo se o arquivo não existir inicialmente.
COPY package.json package-lock.json* ./

# Instala todas as dependências (incluindo devDependencies) necessárias para o build.
# O Docker armazena essa camada em cache. Ele só a executará novamente se os arquivos de manifesto mudarem.
RUN npm install

# Copia todo o código-fonte restante da sua aplicação.
COPY . .

# Executa o script de build para gerar os arquivos estáticos de produção.
RUN npm run build

# ===== Estágio 2: Produção =====
# Agora, usamos uma imagem Nginx super leve para servir os arquivos estáticos.
FROM nginx:stable-alpine AS production

# Copia os arquivos de build do estágio 'builder' para o diretório padrão do Nginx.
# A aplicação React construída estará na pasta /app/dist do estágio anterior.
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia o arquivo de configuração customizado do Nginx.
# Isso é crucial para que o roteamento do React (react-router-dom) funcione corretamente.
# Ele redireciona todas as requisições para o index.html.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 3001.
EXPOSE 3001

# O comando para iniciar o servidor Nginx quando o contêiner for executado.
# A flag '-g "daemon off;"' garante que o Nginx rode em primeiro plano, o que é essencial para contêineres.
CMD ["nginx", "-g", "daemon off;"]

