# syntax=docker/dockerfile:1

FROM node:22-slim AS build
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY tsconfig.json prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src
# Placeholder only — `prisma generate` needs DATABASE_URL to resolve but
# never actually connects. The real value is injected at runtime.
ENV DATABASE_URL="mysql://user:pass@localhost:3306/placeholder"
RUN npx prisma generate
RUN npm run build

FROM node:22-slim AS runtime
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
RUN npm install --omit=dev && npm cache clean --force
COPY --from=build /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build /app/dist ./dist
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN useradd --system --uid 1001 app && chown -R app:app /app
USER app

EXPOSE 8080
CMD ["node", "dist/server.js"]
