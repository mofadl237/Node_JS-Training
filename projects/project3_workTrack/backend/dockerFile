
# ==========================================
# Stage 1: BUILD
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm i 


# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Compile TypeScript
RUN npm run build


# ==========================================
# Stage 2: PRODUCTION
# ==========================================
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy package manifests
COPY package*.json ./

# Install production dependencies only
RUN npm i --only=production && npm cache clean --force

# Copy compiled application
COPY --from=builder /app/dist ./dist

# Copy Prisma schema
COPY --from=builder /app/prisma ./prisma

# Start application
EXPOSE 3000

CMD ["npm", "start"]
