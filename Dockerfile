# ---- Etapa de Build ----
# Usa una imagen de Node v20 ligera para construir la aplicación
FROM node:20-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias de desarrollo
RUN npm install

# Copia todo el código fuente
COPY . .

# Construye la aplicación para producción
RUN npm run build

# ---- Etapa de Producción ----
# Usa la misma imagen ligera para la versión final
FROM node:20-alpine

WORKDIR /usr/src/app

# Copia solo los archivos de dependencias
COPY package*.json ./

# Instala únicamente las dependencias de producción
RUN npm install --only=production

# Copia la aplicación compilada desde la etapa de 'builder'
COPY --from=builder /usr/src/app/dist ./dist

# Expone el puerto en el que correrá la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "dist/main"]