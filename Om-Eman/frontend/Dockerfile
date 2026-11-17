
# ==========================================
# Stage 1: DEPENDENCIES
# Install project dependencies
# ==========================================

FROM node:22-alpine AS deps

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./

RUN npm ci


# ==========================================
# Stage 2: BUILDER
# Build optimized Next.js application
# ==========================================

FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

# Ensure public directory exists
RUN mkdir -p public

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# API URL must be available during Next.js build
ARG NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Prevent building with missing API configuration
RUN test -n "$NEXT_PUBLIC_API_URL" || \
    (echo "ERROR: NEXT_PUBLIC_API_URL is missing" && exit 1)

# Build Next.js
RUN npm run build


# ==========================================
# Stage 3: PRODUCTION
# Minimal standalone runtime image
# ==========================================

FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

# Copy public assets
COPY --from=builder /app/public ./public

# Copy Next.js standalone server
COPY --from=builder /app/.next/standalone ./

# Copy static assets
COPY --from=builder /app/.next/static ./.next/static

# Internal application port
EXPOSE 3001

# Start Next.js standalone server
CMD ["node", "server.js"]
