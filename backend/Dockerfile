FROM oven/bun:1.4-slim AS base
WORKDIR /usr/src/app
USER root
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package.json bun.lock ./
RUN bun install

FROM base AS development
COPY . .
CMD ["bun", "run", "dev"]

FROM base AS builder
COPY . .
RUN bun run build
