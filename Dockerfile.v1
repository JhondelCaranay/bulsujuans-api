# ----------------------
# Stage 1: Build
# ----------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
COPY public ./public

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npx tsc

# ----------------------
# Stage 2: Production
# ----------------------
FROM node:20-alpine AS production

WORKDIR /app

# Copy only compiled files and node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

# Expose the port your app uses
EXPOSE 4000

# Start the app
CMD ["node", "dist/server.js"]
