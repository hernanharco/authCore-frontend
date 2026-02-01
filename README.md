# AuthCore Frontend

Aplicación web moderna construida con Next.js para autenticación y gestión de usuarios con backend FastAPI.

## 🚀 Características

- **Autenticación completa** con login tradicional y OAuth (Google)
- **Gestión de usuarios** CRUD completo con roles y permisos
- **Dashboard administrativo** con estadísticas y actividad reciente
- **Sistema de recuperación** de contraseñas por email
- **Monitoreo de salud** de la base de datos en tiempo real
- **Diseño responsive** y moderno con Tailwind CSS
- **Arquitectura limpia** con separación de responsabilidades
- **Configuración centralizada** de la API
- **Manejo de errores** con visualización clara
- **Persistencia de sesión** con localStorage

## 🏗️ Arquitectura

```
src/
├── app/                    # Páginas y layout de Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página de inicio
│   ├── login/             # Página de autenticación
│   ├── dashboard/         # Dashboard principal
│   │   ├── page.tsx       # Overview del dashboard
│   │   └── users/         # Gestión de usuarios
│   ├── health/            # Monitoreo de salud
│   └── globals.css        # Estilos globales
├── components/             # Componentes de UI
│   ├── AuthView.tsx       # Formularios de autenticación
│   ├── HealthCheck.tsx    # Panel de monitoreo
│   ├── dashboard/         # Componentes del dashboard
│   │   └── Overview.tsx   # Vista principal del dashboard
│   └── layout/            # Componentes de layout
│       └── DashboardLayout.tsx
│       └── UsersDashboard.tsx
├── hooks/                 # Lógica de negocio
│   ├── useAuth.ts         # Hook de autenticación
│   ├── useHealthCheck.ts  # Hook para health check
│   └── useUsers.ts        # Hook de gestión de usuarios
├── types/                 # Definiciones TypeScript
│   ├── auth.ts            # Tipos de autenticación
│   └── user.ts            # Tipos de usuario
└── config/                # Configuración
    └── api.ts             # Configuración de API
```

## 📋 Prerrequisitos

- Node.js 18+ 
- pnpm (recomendado)
- Backend FastAPI corriendo en el puerto 8000
- Google OAuth credentials (para login social)

## 🛠️ Instalación

1. **Clonar el repositorio** (si aplica):
```bash
git clone <repository-url>
cd frontend-fastapi
```

2. **Instalar dependencias**:
```bash
pnpm install
```

3. **Configurar variables de entorno**:
```bash
# Copiar el archivo de entorno de ejemplo
cp .env.example .env.local
```

4. **Editar `.env.local`**:
```env
# La URL REAL de tu backend (Solo la usa el servidor para el túnel)
BACKEND_URL=http://localhost:8000

# La URL que usará tu Frontend (El túnel)
NEXT_PUBLIC_API_URL=/backend

# Client ID de Google OAuth (obtenido de Google Cloud Console)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

## 🚀 Ejecución

### Modo Desarrollo

1. **Iniciar el backend** (en otra terminal):
```bash
cd ../backend-fastApi
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

2. **Iniciar el frontend**:
```bash
pnpm dev
```

3. **Abrir el navegador**:
```
http://localhost:3000
```

### Modo Producción

1. **Construir la aplicación**:
```bash
pnpm build
```

2. **Iniciar servidor de producción**:
```bash
pnpm start
```

## 📁 Scripts Disponibles

- `pnpm dev` - Inicia servidor de desarrollo
- `pnpm build` - Construye para producción
- `pnpm start` - Inicia servidor de producción
- `pnpm lint` - Ejecuta ESLint

## 🔧 Configuración de la API

La aplicación utiliza un sistema de proxy para evitar problemas de CORS:

- **Backend URL**: Configurada en `BACKEND_URL` (solo uso del servidor)
- **Frontend URL**: Configurada en `NEXT_PUBLIC_API_URL` (uso del cliente)
- **Rewrites**: Configurados en `next.config.ts` para redirigir `/backend/*` al backend real

## 🎨 Componentes Principales

### AuthView Component
Componente principal de autenticación que incluye:
- Formulario de login tradicional
- Integración con Google OAuth
- Recuperación de contraseña
- Restablecimiento de contraseña con token
- Manejo de errores y validaciones

### useAuth Hook
Custom hook que maneja:
- Autenticación tradicional y OAuth
- Persistencia de sesión con localStorage
- Estados de carga y error
- Recuperación y restablecimiento de contraseña

### UsersDashboard Component
Panel completo para gestión de usuarios:
- Listado de usuarios con paginación
- Crear, editar y eliminar usuarios
- Gestión de roles (admin, moderator, user)
- Activación/desactivación de usuarios

### useUsers Hook
Hook para gestión CRUD de usuarios:
- Operaciones CRUD sincronizadas
- Manejo de estados optimizado
- Actualización en tiempo real de la UI

### Overview Component
Dashboard principal con:
- Estadísticas de usuarios
- Actividad reciente
- Acciones rápidas
- Navegación a otras secciones

### HealthCheck Component
Componente de monitoreo que muestra:
- Estado de conexión en tiempo real
- Información del entorno
- Última verificación
- Botón de refresh manual
- Manejo de errores con detalles

## 🌐 Endpoints de la API

### Autenticación
- `POST /auth/login` - Login tradicional
- `POST /auth/google` - Login con Google OAuth
- `POST /auth/forgot-password` - Enviar email de recuperación
- `POST /auth/reset-password` - Restablecer contraseña

### Usuarios
- `GET /users` - Listar todos los usuarios
- `GET /users/me` - Obtener usuario actual
- `POST /users` - Crear nuevo usuario
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### Sistema
- `GET /health` - Verificar estado de la conexión a la base de datos

### Respuestas Esperadas

**Login Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John",
    "lastName": "Doe",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Health Response:**
```json
{
  "status": "healthy",
  "environment": "development",
  "database": "connected"
}
```

## 🎯 Tecnologías Utilizadas

- **Next.js 16** - Framework React full-stack
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Framework de estilos
- **Lucide React** - Iconos modernos
- **@react-oauth/google** - Integración Google OAuth
- **pnpm** - Gestor de paquetes

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error de conexión al backend**:
   - Verifica que el backend esté corriendo en el puerto 8000
   - Revisa las variables de entorno en `.env.local`

2. **Problemas de CORS**:
   - La configuración de proxy debería manejar esto automáticamente
   - Verifica que `next.config.ts` tenga las reglas de rewrites correctas

3. **Variables de entorno no cargan**:
   - Asegúrate de usar `.env.local` (no `.env`)
   - Reinicia el servidor después de cambiar variables

4. **Error en Google OAuth**:
   - Verifica que las credenciales de Google OAuth estén configuradas
   - Asegúrate de que el redirect URI coincida con tu configuración

5. **Sesión no persiste**:
   - Verifica que localStorage esté disponible en el navegador
   - Revisa la configuración de cookies en el backend

### Logs Útiles

- **Backend**: Revisa los logs del servidor FastAPI
- **Frontend**: Usa las DevTools del navegador para ver errores de red

## 🤝 Contribuir

1. Fork del proyecto
2. Crear feature branch (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Soporte

Para cualquier duda o problema, por favor abre un issue en el repositorio.