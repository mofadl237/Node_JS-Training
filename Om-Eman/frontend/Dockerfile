
# ==============================
# Stage 1: Dependencies
# ==============================

FROM node:22-alpine AS deps

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package*.json ./

RUN npm ci


# ==============================
# Stage 2: Builder
# ==============================

FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

# Ensure public directory exists
RUN mkdir -p public

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build


# ==============================
# Stage 3: Production
# ==============================

FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/public ./public

COPY --from=builder /app/.next/standalone ./

COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3003

CMD ["node", "server.js"]
