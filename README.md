# VTG WebForm – Documentación para miembros de Grupo NOVA

¡Bienvenido al equipo! Este documento te guiará a través del proyecto **VTG‑WebForm**, una aplicación desarrollada por **Grupo NOVA** para gestionar las inscripciones de estudiantes a los diferentes grupos estudiantiles durante el evento **VTG** (Vive Tu Grupo). El objetivo es que cualquier persona nueva en la organización pueda entender la estructura, ejecutar el proyecto localmente y empezar a contribuir sin problemas.

---

## 📋 Tabla de contenido

1. [Introducción](#introducción)  
2. [Requisitos previos](#requisitos-previos)  
3. [Estructura del proyecto](#estructura-del-proyecto)  
4. [Módulos principales](#módulos-principales)  
   - [4.1 Páginas y enrutamiento (App Router)](#41-páginas-y-enrutamiento-app-router)  
   - [4.2 Formularios de grupos](#42-formularios-de-grupos)  
   - [4.3 Formulario de correo y datos personales/académicos](#43-formulario-de-correo-y-datos-personalesacadémicos)  
   - [4.4 Panel de análisis (analytics)](#44-panel-de-análisis-analytics)  
   - [4.5 Paneles de listas (lists)](#45-paneles-de-listas-lists)  
   - [4.6 Autenticación (JWT + cookies)](#46-autenticación-jwt--cookies)  
   - [4.7 API routes](#47-api-routes)  
   - [4.8 Utilidades de encriptación](#48-utilidades-de-encriptación)  
   - [4.9 Capa de base de datos](#49-capa-de-base-de-datos)  
   - [4.10 Componentes de UI reutilizables](#410-componentes-de-ui-reutilizables)  
   - [4.11 Configuración y assets](#411-configuración-y-assets)  
5. [Guía de ejecución local](#guía-de-ejecución-local)  
   - [5.1 Clonar el repositorio](#51-clonar-el-repositorio)  
   - [5.2 Configurar variables de entorno](#52-configurar-variables-de-entorno)  
   - [5.3 Instalar dependencias](#53-instalar-dependencias)  
   - [5.4 Inicializar la base de datos](#54-inicializar-la-base-de-datos)  
   - [5.5 Ejecutar en modo desarrollo](#55-ejecutar-en-modo-desarrollo)  
   - [5.6 Verificar que todo funciona](#56-verificar-que-todo-funciona)  
6. [Solución de problemas comunes](#solución-de-problemas-comunes)  
7. [Contacto y contribución](#contacto-y-contribución)  

---

## 🧭 Introducción

**VTG‑WebForm** es una aplicación web construida con [Next.js](https://nextjs.org) (versión 15, App Router) y TypeScript. Su propósito es centralizar el proceso de inscripción de los estudiantes de la universidad a los distintos grupos estudiantiles durante la semana VTG. Cada grupo tiene su propio formulario con preguntas específicas, y toda la información se almacena en una base de datos PostgreSQL (usamos [Supabase](https://supabase.com) como proveedor en la nube).

La aplicación cuenta con:

- Un flujo de registro por pasos: correo → datos personales → datos académicos → selección de grupo → formulario específico del grupo.
- Autenticación mediante JWT almacenado en cookies HttpOnly.
- reCAPTCHA en el primer formulario para evitar spam.
- Encriptación híbrida (RSA + AES) de los datos sensibles enviados desde el frontend.
- Paneles de análisis (estadísticas generales) y paneles de listas (para que cada grupo pueda ver sus inscritos) protegidos por contraseñas fijas.
- Un diseño colorido y temático (estilo FIFA/videojuego) con animaciones (confeti, píxeles) para mejorar la experiencia de usuario.

Este documento está pensado para los nuevos miembros de **Grupo NOVA**, por lo que encontrarás explicaciones claras y ejemplos que te ayudarán a familiarizarte rápidamente con el código.

---

## 🛠️ Requisitos previos

Antes de empezar, asegúrate de tener instalado en tu máquina:

- **Node.js** versión 22 o superior (recomendada la LTS).  
- **npm** como gestor de paquetes (Puedes usar pnpm para que sea mas rapido).  
- **Git** para clonar el repositorio.  
- **Docker** y **Docker Compose** (opcional, solo si quieres levantar una base de datos local en lugar de usar Supabase).  
- Conocimientos básicos de:
  - React (componentes, hooks)
  - Next.js (enrutamiento, API routes)
  - TypeScript (tipado básico)
  - SQL (consultas simples)
  - Línea de comandos (terminal)

Si aún no dominas alguno de estos temas, no te preocupes: con la práctica irás aprendiendo. Lo importante es tener la actitud para explorar y preguntar.

---

## 📁 Estructura del proyecto

vtg-webform/
│
├── public/                # Assets estáticos (imágenes, logos, fuentes)
├── scripts/               # Scripts auxiliares y automatizaciones
├── src/
│   ├── app/               # Frontend (Next.js App Router)
│   ├── pages/api/         # Backend (API Routes)
│   ├── lib/               # Utilidades (ej: crypto, decrypt)
│   └── fonts/             # Tipografías personalizadas
│
├── docker-compose.yaml    # Configuración de servicios (MySQL + phpMyAdmin)
├── init.sql               # Script de inicialización de base de datos
├── package.json           # Dependencias y scripts del proyecto
└── README.md              # Documentación principal







**Nota:** El archivo `docker-compose.yaml` levanta una base de datos MySQL, pero **nuestro proyecto usa PostgreSQL (Supabase)**. Lo dejamos por si alguien quiere probar con MySQL local, pero la configuración activa apunta a Supabase.

---

## 🧩 Módulos principales

### 4.1 Páginas y enrutamiento (App Router)

Todas las rutas están en `src/app/`. Cada subcarpeta representa una ruta:

- `/` → página de inicio con animación de confeti y redirección automática a `/email`.
- `/email` → formulario de correo institucional con reCAPTCHA.
- `/home` → formulario de datos personales (nombre y apellidos).
- `/academic` → formulario de datos académicos (pregrado, segundo pregrado, semestre).
- `/groupslist` → selector de grupo estudiantil.
- `/groups/[grupo]` → formulario específico de cada grupo (ej: `/groups/aiesec`).
- `/90+1` → página final después de inscribirse a un grupo (con animación).
- `/analytics` → dashboard de estadísticas (requiere contraseña global).
- `/lists/[grupo]` → listado de inscritos por grupo (cada uno con su propia contraseña).
- `/assessment`, `/assessmentassistance`, `/talk`, `/talk_animation` → páginas para el proceso de assessment de NOVA (otro flujo).

Cada página es un componente de React (`page.tsx`) que puede incluir lógica de autenticación, formularios y animaciones.

### 4.2 Formularios de grupos

Los formularios específicos de cada grupo se encuentran en `src/app/globalcomponents/Forms/` y tienen nombres como `Form-Aiesec.tsx`, `Form-NOVA.tsx`, etc. Todos siguen una estructura similar:

- Importan `FormContainer`, `Select`, `Input`, `Button` de `@/app/globalcomponents/UI`.
- Usan el hook `useState` para manejar el estado de envío.
- Al enviar, llaman a `encryptedFetch` (ver sección 4.8) para enviar los datos a la API correspondiente (ej: `/api/forms/aiesec`).
- Muestran notificaciones con `react-toastify`.
- Redirigen a `/90+1` en caso de éxito (excepto algunos grupos que redirigen a otro lado).

**Ejemplo mínimo de un formulario de grupo:**

```tsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  const formData = new FormData(e.currentTarget);
  const response = await encryptedFetch('/api/forms/aiesec', Object.fromEntries(formData));
  // manejo de respuesta...
};
