# Use Node.js 20 LTS as base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accept build arguments for NEXT_PUBLIC_ environment variables
ARG NEXT_PUBLIC_WC_PROJECT_ID
ARG NEXT_PUBLIC_CHAINID
ARG NEXT_PUBLIC_CHAIN_NAME
ARG NEXT_PUBLIC_RPC_URL
ARG NEXT_PUBLIC_WS_URL
ARG NEXT_PUBLIC_EXPLORER_URL
ARG NEXT_PUBLIC_CLAIMING_CONTRACT_ADDRESS
ARG NEXT_PUBLIC_AGGREGAOTR_CONTRACT_ADDRESS
ARG NEXT_PUBLIC_AGGREGATOR_CONTRACT_ADDRESS
ARG NEXT_PUBLIC_DAO_CONTRACT_ADDRESS
ARG NEXT_PUBLIC_LOW_MAJORITY_CONTRACT_ADDRESS
ARG NEXT_PUBLIC_DEBUG_TX
ARG NEXT_PUBLIC_DEBUG_TX_LEVEL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_PORT

# Set them as environment variables for the build
ENV NEXT_PUBLIC_WC_PROJECT_ID=$NEXT_PUBLIC_WC_PROJECT_ID
ENV NEXT_PUBLIC_CHAINID=$NEXT_PUBLIC_CHAINID
ENV NEXT_PUBLIC_CHAIN_NAME=$NEXT_PUBLIC_CHAIN_NAME
ENV NEXT_PUBLIC_RPC_URL=$NEXT_PUBLIC_RPC_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_EXPLORER_URL=$NEXT_PUBLIC_EXPLORER_URL
ENV NEXT_PUBLIC_CLAIMING_CONTRACT_ADDRESS=$NEXT_PUBLIC_CLAIMING_CONTRACT_ADDRESS
ENV NEXT_PUBLIC_AGGREGAOTR_CONTRACT_ADDRESS=$NEXT_PUBLIC_AGGREGAOTR_CONTRACT_ADDRESS
ENV NEXT_PUBLIC_AGGREGATOR_CONTRACT_ADDRESS=$NEXT_PUBLIC_AGGREGATOR_CONTRACT_ADDRESS
ENV NEXT_PUBLIC_DAO_CONTRACT_ADDRESS=$NEXT_PUBLIC_DAO_CONTRACT_ADDRESS
ENV NEXT_PUBLIC_LOW_MAJORITY_CONTRACT_ADDRESS=$NEXT_PUBLIC_LOW_MAJORITY_CONTRACT_ADDRESS
ENV NEXT_PUBLIC_DEBUG_TX=$NEXT_PUBLIC_DEBUG_TX
ENV NEXT_PUBLIC_DEBUG_TX_LEVEL=$NEXT_PUBLIC_DEBUG_TX_LEVEL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_PORT=$NEXT_PUBLIC_PORT

# Uncomment the following line to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
