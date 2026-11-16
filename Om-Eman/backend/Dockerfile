
# ==========================================
# Stage 1: BUILDER
# Install dependencies, generate Prisma Client
# and compile TypeScript
# ==========================================

FROM node:22-alpine AS builder

WORKDIR /app

# Install compatibility library
RUN apk add --no-cache libc6-compat

# Copy package manifests first for better caching
COPY package.json package-lock.json ./

# Install all dependencies required for building
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Compile TypeScript
RUN npm run build


# ==========================================
# Stage 2: PRODUCTION DEPENDENCIES
# Install runtime dependencies only
# ==========================================

FROM node:22-alpine AS prod-deps

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev \
    && npm cache clean --force


# ==========================================
# Stage 3: PRODUCTION
# Minimal runtime image
# ==========================================

FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy production dependencies
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules

# Copy generated Prisma Client
COPY --from=builder --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma

# Copy package metadata
COPY --chown=node:node package.json ./

# Copy compiled application
COPY --from=builder --chown=node:node /app/dist ./dist

# Copy Prisma schema and migrations
COPY --from=builder --chown=node:node /app/prisma ./prisma

# If your Prisma config is needed for migrations,
# keep it available in the production image
COPY --from=builder --chown=node:node /app/prisma.config.ts ./prisma.config.ts

# Run as non-root user
USER node

EXPOSE 3002

# Start application directly without npm wrapper
CMD ["node", "dist/server.js"]
