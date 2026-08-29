FROM node:22-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends chromium ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app/whatsapp-service

COPY whatsapp-service/package.json whatsapp-service/package-lock.json ./
RUN npm ci --omit=dev

WORKDIR /app
COPY . .

WORKDIR /app/whatsapp-service
EXPOSE 3001
CMD ["npm", "start"]