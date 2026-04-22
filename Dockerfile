FROM node:20-alpine

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

RUN npm install --omit=dev --legacy-peer-deps

# Copy backend source (excluding .env - use Render env vars instead)
COPY backend/ .
RUN rm -f .env

# Create public folder for static files
RUN mkdir -p public

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3000/health || exit 1

CMD ["node", "app.js"]
