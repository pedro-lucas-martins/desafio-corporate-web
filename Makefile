# ==============================================================================
# Variáveis de Configuração
# ==============================================================================

BACKEND_DIR = desafio-corporate-web-backend
FRONTEND_DIR = desafio-corporate-web-frontend

DB_USER = postgres
DB_PASSWORD = 123
DB_NAME = notedb
DB_HOST = localhost
DB_PORT = 5434

FRONTEND_HOST_PORT = 3001
BACKEND_HOST_PORT = 3000
FRONTEND_HOST_URL = http://localhost:$(FRONTEND_HOST_PORT)
BACKEND_HOST_URL = http://localhost:$(BACKEND_HOST_PORT)

BACKEND_ENV = DATABASE_URL=postgres://$(DB_USER):$(DB_PASSWORD)@$(DB_HOST):$(DB_PORT)/$(DB_NAME) FRONTEND_URL=$(FRONTEND_HOST_URL) NODE_ENV=production

FRONTEND_BUILD_ENV = VITE_NOTES_BACKEND_URL=$(BACKEND_HOST_URL)

# ==============================================================================
# Comandos principais
# ==============================================================================

.PHONY: setup build start stop clean help

default: help

help:
	@echo "========================================================"
	@echo "           Comandos do Makefile (SEM DOCKER)            "
	@echo "========================================================"
	@echo " setup:     Instala todas as dependências do backend e frontend."
	@echo " build:     (Depende de setup) Compila o backend (NestJS) e o frontend (React)."
	@echo " start:     Inicia o backend (porta 3000) e o frontend (porta 3001)."
	@echo " stop:      Mata os processos do Node.js (rudimentar, apenas para desenvolvimento)."
	@echo " clean:     Limpa os diretórios de build (dist) e node_modules."
	@echo "========================================================"
	@echo "⚠️ IMPORTANTE: Este modo requer que Node.js, PostgreSQL e o pacote 'serve' (para frontend)"
	@echo "estejam instalados. O pacote 'cross-env' é necessário para o 'build' funcionar no Windows."

# ------------------------------------------------------------------------------
# 1. SETUP: Instala dependências (simula o Stage 2)
# ------------------------------------------------------------------------------
setup:
	@echo "--- Instalando dependências do Backend..."
	npm ci --prefix $(BACKEND_DIR)
	@echo "--- Instalando dependências do Frontend..."
	npm ci --prefix $(FRONTEND_DIR)

# ------------------------------------------------------------------------------
# 2. BUILD: Compila o código (simula o Stage 3)
# ------------------------------------------------------------------------------
build: setup
	@echo "--- Gerando Prisma client e compilando Backend..."
	npx --yes prisma generate --schema $(BACKEND_DIR)/prisma/schema.prisma
	npm run prebuild --prefix $(BACKEND_DIR)
	npm run build:nest --prefix $(BACKEND_DIR)

	@echo "--- Compilando Frontend..."
	npx --yes cross-env $(FRONTEND_BUILD_ENV) npm run build --prefix $(FRONTEND_DIR)
	@echo "Frontend estático construído em $(FRONTEND_DIR)/dist."

# ------------------------------------------------------------------------------
# 3. START: Inicia o projeto (simula o Stage 4)
# ------------------------------------------------------------------------------
start:
	@echo "--- Executando migrações do Prisma (requer PostgreSQL rodando na porta $(DB_PORT))..."
	$(BACKEND_ENV) npx --yes prisma migrate deploy --schema $(BACKEND_DIR)/prisma/schema.prisma

	@echo "--- Iniciando Backend (porta $(BACKEND_HOST_PORT))..."
	$(BACKEND_ENV) node $(BACKEND_DIR)/dist/src/main.js &

	@echo "--- Iniciando Frontend com 'serve' (porta $(FRONTEND_HOST_PORT)), simulando Nginx..."
	npx --yes serve -s $(FRONTEND_DIR)/dist -l $(FRONTEND_HOST_PORT) &

	@echo "--- Projeto iniciado. Backend em $(BACKEND_HOST_URL). Frontend em $(FRONTEND_HOST_URL)."

# ------------------------------------------------------------------------------
# 4. STOP: Para os serviços (rudimentar)
# ------------------------------------------------------------------------------
stop:
	@echo "--- Tentando parar processos Node.js e Serve..."
	pkill -f "node $(BACKEND_DIR)/dist/src/main.js" || true
	pkill -f "serve -s $(FRONTEND_DIR)/dist" || true
	@echo "Processos parados (pode exigir verificação manual)."

# ------------------------------------------------------------------------------
# 5. CLEAN: Limpeza de build e módulos
# ------------------------------------------------------------------------------
clean:
	@echo "--- Removendo diretórios de build e módulos..."
	rm -rf $(BACKEND_DIR)/node_modules $(BACKEND_DIR)/dist
	rm -rf $(FRONTEND_DIR)/node_modules $(FRONTEND_DIR)/dist
	@echo "Limpeza concluída."