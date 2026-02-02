# 1. Usar una imagen de Node
FROM node:20-slim

# 2. INSTALAR PNPM GLOBALMENTE (Esto es lo que falta)
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# 3. Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml* ./

# 4. Instalar dependencias
RUN pnpm install

# 5. Copiar el resto del código
COPY . .

# 6. EL COMANDO DE INICIO
# Asegúrate de que NO diga algo como "node pnpm dev"
# Debe ser así:
CMD ["pnpm", "run", "dev"]