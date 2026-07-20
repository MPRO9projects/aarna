FROM node:20-alpine AS client-builder

WORKDIR /app/client

# react-snap (postbuild) needs Chromium for static pre-rendering
RUN apk add --no-cache chromium

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

FROM node:20-alpine AS server

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=5010
ENV CLIENT_BUILD_DIR=/app/client/build

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY backend/server.js ./
COPY backend/data/ ./data/
COPY --from=client-builder /app/client/build /app/client/build

EXPOSE 5010

CMD ["npm", "start"]
