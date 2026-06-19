# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run (Chỉ lấy file đã build)
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
# Chỉ cài thư viện cần để CHẠY, không cài tsc nữa
RUN npm install --omit=dev
# Copy file đã build (dist) từ stage builder sang
COPY --from=builder /app/dist ./dist

EXPOSE 5000
CMD ["node", "dist/server.js"]