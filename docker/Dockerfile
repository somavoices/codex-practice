FROM node:20-alpine AS base

WORKDIR /app

COPY package.json tsconfig.json tailwind.config.ts postcss.config.js next.config.mjs ./
COPY prisma ./prisma
COPY app ./app
COPY backend ./backend
COPY components ./components
COPY public ./public
COPY types ./types

RUN npm install
RUN npm run build

EXPOSE 3000

ENV PORT=3000 \
    NODE_ENV=production \
    DATABASE_URL="file:./prisma/dev.db" \
    NEXTAUTH_URL="http://localhost:3000"

CMD ["/bin/sh", "-c", "npx prisma migrate deploy && npm run start"]
