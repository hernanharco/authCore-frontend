#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🎨 Iniciando automatización de AuthCore Frontend...${NC}"

# 1. Asegurar que las dependencias locales estén al día
echo -e "${BLUE}📦 Instalando dependencias con pnpm...${NC}"
pnpm install

# 2. Construir la imagen
echo -e "${BLUE}🏗️ Construyendo imagen de producción...${NC}"
docker build -t authcore-frontend .

# 3. Limpiar contenedores previos
echo -e "${BLUE}🛑 Limpiando contenedores antiguos...${NC}"
docker stop authcore-frontend-container 2>/dev/null || true
docker rm authcore-frontend-container 2>/dev/null || true

# 4. Correr el contenedor
echo -e "${GREEN}🏃 Corriendo Frontend en http://localhost:3000${NC}"
docker run -d \
  --name authcore-frontend-container \
  -p 3000:3000 \
  authcore-frontend

echo -e "${GREEN}✅ ¡Espectacular! Tu versión de producción está lista localmente.${NC}"