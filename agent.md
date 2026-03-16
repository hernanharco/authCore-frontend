# Agent Documentation - AuthCore Frontend

## 📋 Overview

AuthCore Frontend es una aplicación web moderna construida con Next.js 16 y React 19 que proporciona una interfaz completa para autenticación y gestión de usuarios. Este documento sirve como guía para agentes de IA que trabajan en este proyecto.

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + TypeScript
- **Estilos**: Tailwind CSS 4
- **Iconos**: Lucide React
- **OAuth**: @react-oauth/google
- **Package Manager**: pnpm

### Estructura de Directorios
```
src/
├── app/                    # Páginas Next.js (App Router)
│   ├── layout.tsx         # Layout principal con proveedores
│   ├── page.tsx           # Página de inicio (redirect a login)
│   ├── login/             # Autenticación completa
│   ├── dashboard/         # Dashboard administrativo
│   │   ├── page.tsx       # Overview principal
│   │   └── users/         # Gestión CRUD de usuarios
│   ├── health/            # Monitoreo de salud
│   └── globals.css        # Estilos globales Tailwind
├── components/             # Componentes reutilizables
│   ├── AuthView.tsx       # Formularios de autenticación
│   ├── HealthCheck.tsx    # Panel de monitoreo en tiempo real
│   ├── dashboard/         # Componentes del dashboard
│   └── layout/            # Layout components
├── hooks/                 # Lógica de negocio personalizada
│   ├── useAuth.ts         # Estado de autenticación
│   ├── useHealthCheck.ts  # Health check con polling
│   └── useUsers.ts        # Gestión CRUD de usuarios
├── types/                 # Definiciones TypeScript
│   ├── auth.ts            # Tipos de autenticación
│   └── user.ts            # Tipos de usuario y API
└── config/                # Configuración centralizada
    └── api.ts             # Configuración de cliente HTTP
```

## 🔧 Configuración Clave

### Variables de Entorno
```env
# Backend real (uso del servidor)
BACKEND_URL=http://localhost:8000

# API proxy (uso del cliente)
NEXT_PUBLIC_API_URL=/backend

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu_google_client_id
```

### Configuración de Proxy
El proyecto utiliza rewrites en `next.config.ts` para evitar CORS:
- `/backend/*` → `${BACKEND_URL}/*`

## 🎯 Componentes Principales

### AuthView.tsx
Componente principal de autenticación que maneja:
- Login tradicional (email/password)
- Login con Google OAuth
- Recuperación de contraseña
- Restablecimiento con token
- Validaciones y manejo de errores

**Estado**: Utiliza `useAuth` hook para gestión de estado

### useAuth Hook
Gestiona el estado de autenticación:
- Persistencia con localStorage
- Estados de carga/error
- Manejo de tokens OAuth
- Redirects automáticos

### UsersDashboard.tsx
Panel completo de gestión de usuarios:
- Listado paginado
- CRUD operations inline
- Gestión de roles (admin/moderator/user)
- Activación/desactivación
- Búsqueda y filtrado

### useUsers Hook
Lógica CRUD para usuarios:
- Sincronización con backend
- Estado optimista para UX
- Manejo de errores detallado
- Actualizaciones en tiempo real

### HealthCheck.tsx
Monitoreo de salud del sistema:
- Verificación periódica (polling)
- Estado de conexión en tiempo real
- Información del entorno
- Botón de refresh manual

## 🌐 API Integration

### Endpoints Implementados
```typescript
// Autenticación
POST /auth/login
POST /auth/google
POST /auth/forgot-password
POST /auth/reset-password

// Usuarios
GET /users
GET /users/me
POST /users
PUT /users/:id
DELETE /users/:id

// Sistema
GET /health
```

### Cliente HTTP
Configurado en `src/config/api.ts` con:
- Base URL dinámica
- Headers de autenticación
- Manejo de errores centralizado
- Interceptors para refresh de token

## 🎨 Sistema de Diseño

### Tailwind CSS Configuration
- Utiliza Tailwind CSS 4 con configuración personalizada
- Paleta de colores consistente
- Componentes responsive
- Dark mode ready (no implementado aún)

### Iconos
- Lucide React para iconos consistentes
- Tema unificado en todo el aplicación

## 🔒 Flujo de Autenticación

### Login Tradicional
1. Usuario ingresa email/password
2. Validación en frontend
3. Petición a `/auth/login`
4. Token guardado en localStorage
5. Redirect a dashboard

### Login con Google
1. Click en botón Google
2. Popup de OAuth Google
3. Token recibido del popup
4. Petición a `/auth/google`
5. Proceso similar al tradicional

### Persistencia de Sesión
- Token guardado en localStorage
- Verificación al cargar la app
- Redirect automático si está logueado
- Logout limpia localStorage

## 📊 Gestión de Estado

### Arquitectura de Hooks
- Sin Redux/Context global
- Hooks específicos por dominio
- Estado local en componentes
- Props drilling minimizado

### Estados de Carga
- Indicadores de carga específicos
- Estados de error detallados
- UI optimista para mejor UX

## 🚀 Scripts y Comandos

### Desarrollo
```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Build de producción
pnpm start        # Servidor de producción
pnpm lint         # Linting con ESLint
```

### Scripts Personalizados
```bash
pnpm setup:dev    # Configuración desarrollo
pnpm setup:prod   # Configuración producción
```

## 🐛 Troubleshooting Común

### Problemas Frecuentes
1. **CORS**: Verificar configuración de proxy
2. **Environment**: Usar `.env.local` no `.env`
3. **OAuth**: Configurar Google Cloud Console
4. **Sesión**: Verificar localStorage disponible

### Debug Tips
- Revisar DevTools Network
- Verificar variables de entorno
- Logs del backend FastAPI
- Estado en Redux DevTools

## 🔄 Flujo de Trabajo para Agentes

### Al Modificar Componentes
1. Identificar hook relevante
2. Verificar tipos en `types/`
3. Mantener consistencia de estilos
4. Actualizar tests si aplica

### Al Agregar Nuevas Features
1. Crear tipos en `types/`
2. Implementar hook personalizado
3. Agregar endpoint a `api.ts`
4. Actualizar documentación

### Buenas Prácticas
- Usar TypeScript estrictamente
- Seguir estructura de directorios
- Mantener componentes pequeños
- Manejar errores correctamente
- Usar Tailwind para estilos
- Documentar cambios importantes

## 📱 Consideraciones de UX

### Responsive Design
- Mobile-first approach
- Breakpoints consistentes
- Touch-friendly interactions

### Accesibilidad
- Semantic HTML
- ARIA labels donde necesario
- Keyboard navigation
- Screen reader friendly

### Performance
- Lazy loading de componentes
- Optimización de imágenes
- Bundle size optimizado
- Client-side navigation

## 🔮 Futuras Mejoras

### Planeado
- Dark mode implementation
- Testing unitario con Jest
- E2E testing con Playwright
- Internacionalización (i18n)
- PWA capabilities

### Technical Debt
- Migrar a server components
- Implementar cache strategy
- Optimizar bundle size
- Add error boundaries

---

## 📞 Contacto y Soporte

Para dudas técnicas o problemas específicos:
- Revisar este documento primero
- Consultar README.md del proyecto
- Verificar issues existentes
- Seguir flujo de contribución establecido
