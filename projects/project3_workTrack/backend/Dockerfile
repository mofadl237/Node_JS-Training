
# ==========================================
# Stage 1: BUILDER
# ==========================================

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install all dependencies
RUN npm ci

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build


# ==========================================
# Stage 2: PRODUCTION
# ==========================================

FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Install production dependencies only
COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

# Copy generated Prisma Client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy compiled application
COPY --from=builder /app/dist ./dist

# Copy Prisma files
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
