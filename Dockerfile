# ============================
# 1) Etapa de build
# ============================
FROM node:22.17.0-alpine AS build

# Crear directorio
WORKDIR /app

# Copiar manifest (package.json / package-lock.json / pnpm-lock.yaml)
COPY package*.json ./

# Instalar dependencias
RUN npm install --production=false

# Copiar el resto del proyecto
COPY . .

# Compilar TypeScript → JavaScript
RUN npm run build

# ============================
# 2) Etapa de producción
# ============================
FROM node:22.17.0-alpine  AS runtime

WORKDIR /app

# Solo dependencias necesarias para producción
COPY package*.json ./
RUN npm install --only=production

# Copiar build final desde "build"
COPY --from=build /app/dist ./dist

# Exponer el puerto del API Gateway
EXPOSE 3000

# Comando final (ajusta si usas tsx u otro)
CMD ["node", "dist/main.js"]
