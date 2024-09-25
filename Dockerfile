FROM node:20.12.2-alpine3.18 AS base

# All deps stage
FROM base AS deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci

# Production only deps stage
FROM base AS production-deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci --omit=dev

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN node ace build

# Production stage
FROM base
ENV NODE_ENV=production
ENV APP_KEY=
ENV PORT=8080
ENV HOST=0.0.0.0
ENV LOG_LEVEL=info
ENV SESSION_DRIVER=cookie

WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
ADD --chmod=0755 startup.sh /app/startup.sh
EXPOSE 8080
ENTRYPOINT ["/app/startup.sh"]
