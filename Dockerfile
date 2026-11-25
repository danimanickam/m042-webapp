# App image for the M042 exercise. Built for linux/arm64 in GitHub Actions.
FROM node:24-alpine

WORKDIR /app

# Install only production dependencies, exactly as pinned in package-lock.json.
COPY app/package.json app/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

COPY app/server.js ./

# Commit hash from the CI build (build arg -> environment variable in the image).
ARG GIT_SHA=dev
ENV APP_VERSION=$GIT_SHA \
    NODE_ENV=production \
    PORT=3000

# Do not run as root.
USER node
EXPOSE 3000

# Healthy only if the app answers AND the database is reachable (/health checks the DB).
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/health || exit 1

CMD ["node", "server.js"]
