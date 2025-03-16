# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de produção
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app ./
EXPOSE 4000

CMD ["npm", "start"]
