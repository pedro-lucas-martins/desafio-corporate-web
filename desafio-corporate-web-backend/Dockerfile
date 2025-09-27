# ================= Stage 1: Base dependencies =================
FROM node:20-alpine AS base

# Install necessary dependencies
RUN apk add --no-cache \
    bash \
    openssl \
    libc6-compat \
    git

WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# ================= Stage 2: Install dependencies =================
FROM base AS deps
RUN npm ci

# ================= Stage 3: Build application =================
FROM deps AS build
COPY . .

# Generate Prisma client (doesn't require DB)
RUN npx prisma generate

# Build NestJS application
RUN npm run prebuild

# Build NestJS application
RUN npm run build:nest

# ================= Stage 4: Production setup =================
FROM base AS production

ENV NODE_ENV=production

# Copy necessary files from previous stages
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/package*.json ./

# Add non-root user for security
RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 3000

# Run migrations at runtime, then start the application
CMD npx prisma migrate deploy && node dist/src/main.js
