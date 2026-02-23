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
```

### 4.3 Formulario de correo y datos personales/académicos

- **Form-Email.tsx**: pide correo institucional y verifica reCAPTCHA. Se comunica con `/api/Data-Email`. Si el usuario ya existe, redirige según su progreso; si no, lo crea y redirige a `/home`. Genera un JWT y lo guarda en cookie HttpOnly.
- **Form-Personal.tsx**: envía nombre y apellidos a `/api/Data-Personal`.
- **Form-Academic.tsx**: envía pregrado, segundo pregrado y semestre a `/api/Data-Academic`.

Estos formularios comparten la misma estructura básica que los de grupo.

---

### 4.4 Panel de análisis (analytics)

Ruta: `/analytics`. Protegido por la variable `NEXT_PUBLIC_ANALY_TSS`. Muestra el componente `<Dashboard />` con varios subcomponentes:

- `career.tsx` – Inscritos por carrera.
- `days.tsx` – Inscritos por día.
- `groups.tsx` – Inscritos por grupo estudiantil.
- `hours.tsx` – Inscritos por hora del día.
- `semester.tsx` – Inscritos por semestre.
- `top-group.tsx` – Grupo con más inscritos.
- `totalpersons.tsx` – Total de personas registradas.

Todos obtienen datos de los endpoints `/api/analytics/*` y se actualizan cada 5 segundos con `setInterval`.


### 4.5 Paneles de listas (lists)

Ruta: `/lists/[grupo]` (ej. `/lists/aiesec`). Cada grupo tiene su propia página, protegida por contraseñas individuales (`NEXT_PUBLIC_AIESEC_TSS`, `NEXT_PUBLIC_NOVA_TSS`, etc.). Consultan su endpoint `/api/lists/[grupo]` y muestran los datos en tablas, con opción de exportar a CSV y cambiar entre vista agrupada y lista plana.

---

### 4.6 Autenticación (JWT + cookies)

Se usa **JWT** almacenado en cookie **HttpOnly** llamada `jwtToken`. Esto protege contra XSS.

- **Generación**: en `/api/Data-Email` (y otros endpoints) se firma el JWT con `JWT_SECRET_KEY` y se envía mediante `Set-Cookie`.
- **Verificación en cliente**: el hook `useAuthCheck` (en `hooks/useAuthCheck.ts`) llama a `/api/cookieCheck`. Si no es válido, redirige a `/`.
- **Verificación en servidor**: muchos endpoints usan `verifyJwtFromCookies` (en `cookieManagement.ts`) para extraer y verificar el token, devolviendo el email.

La cookie tiene una duración corta (12 minutos) pero se renueva en cada paso.


### 4.7 API routes

Todas las rutas están en `src/pages/api/`. Principales endpoints:

- `Data-Email.ts`, `Data-Personal.ts`, `Data-Academic.ts` – manejan los pasos iniciales.
- `forms/[grupo].ts` – reciben datos de formularios de grupos e insertan en la tabla correspondiente (con `ON CONFLICT` para evitar duplicados).
- `analytics/*.ts` – devuelven datos agregados para gráficos.
- `lists/[grupo].ts` – devuelven registros de cada grupo con joins a `persona`.
- `redirecting.ts` – recibe el grupo seleccionado, verifica si ya está inscrito y redirige al formulario correspondiente.
- `cookieCheck.ts` – verifica validez del JWT.
- `authMiddleware.ts` – ejemplo de middleware (no usado actualmente).

---

### 4.8 Utilidades de encriptación

`src/lib/crypto.ts` y `src/lib/decrypt.ts` implementan encriptación híbrida RSA + AES.

- **Cliente (`crypto.ts`)**: genera una clave AES aleatoria, encripta los datos con AES‑CBC, luego encripta la clave AES con la clave pública RSA (`NEXT_PUBLIC_RSA_PUBLIC_KEY`). Envía `{ encryptedKey, encryptedData, iv }`.
- **Servidor (`decrypt.ts`)**: desencripta la clave AES con la clave privada RSA (`RSA_PRIVATE_KEY`), luego desencripta los datos con AES. El helper `getRequestBody` desencripta automáticamente si el header `X-Encrypted` está presente.

---

### 4.9 Capa de base de datos

`src/pages/api/db.ts` maneja la conexión a PostgreSQL (Supabase). Exporta:

- `getPool()` – devuelve un pool de conexiones (singleton).
- `dbQuery()` – ejecuta una consulta, con reconexión automática en caso de fallo.
- `withTransaction()` – ejecuta múltiples consultas dentro de una transacción.

Tablas principales:

- `persona`: datos básicos (correo, nombre, pregrado, semestre, etc.)
- Tablas por grupo: `aiesec`, `nova`, `club_in`, etc. (clave foránea a `persona(correo)`)

Esquema simplificado:

```sql
persona (
  correo VARCHAR PRIMARY KEY,
  nombre VARCHAR,
  pregrado VARCHAR,
  pregrado_2 VARCHAR,
  semestre INTEGER,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

aiesec (
  id_grupo INTEGER,
  correo VARCHAR REFERENCES persona(correo),
  departamento VARCHAR,
  PRIMARY KEY (id_grupo, correo)
);
-- similar para otros grupos
```


### 4.10 Componentes de UI reutilizables

En `src/app/globalcomponents/UI/`:

- **Button.tsx**: botones con temas (default, fifa, china) y variantes de color.
- **Input.tsx** y **Select.tsx**: inputs y selects estilizados, con soporte para errores.
- **FormContainer.tsx**: contenedor con diseño de tarjeta para formularios.
- **ConfettiAnimation.tsx** y **Pixels_animation.tsx**: animaciones en canvas.
- **ExportCSV.tsx**: botón para exportar a CSV.
- **Footer_NOVA_blanco/negro.tsx**: pies de página con logo NOVA.

---

### 4.11 Configuración y assets

- **Tailwind CSS**: configurado en `tailwind.config.ts` y `postcss.config.mjs`. Se definen fuentes personalizadas (`EA Font`, `FIFA26`, `FWC26`) y utilidades para viewport dinámico (`dvh`).
- **Next.js config**: en `next.config.ts` se ignoran errores de ESLint en builds y se configuran patrones remotos para imágenes (Azure Blob Storage).
- **Fuentes e imágenes**: en `public/` y `src/fonts/`. El script `scripts/optimize-images.mjs` convierte PNG a WebP para optimizar carga.
- **Variables de entorno**: se definen en `.env.local` (ver sección 5.2).



Guía de ejecución local
5.1 Clonar el repositorio
bash
git clone https://github.com/gruponovaeafit/VTG-WebForm.git
cd VTG-WebForm
5.2 Configurar variables de entorno
Crea un archivo .env.local en la raíz. Pide al director del proyecto los valores reales. Ejemplo:

env
# Base de datos (Supabase)
SUPABASE_DB_URL=postgresql://usuario:contraseña@host:puerto/basedatos

# JWT
JWT_SECRET_KEY=una_clave_secreta_muy_larga

# reCAPTCHA
NEXT_PUBLIC_CLIENT_KEY_CAPTCHA=clave_publica_del_sitio
SERVER_KEY_CAPTCHA=clave_secreta_del_servidor

# RSA
NEXT_PUBLIC_RSA_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
RSA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Contraseñas para paneles
NEXT_PUBLIC_ANALY_TSS=clave_analytics
NEXT_PUBLIC_AIESEC_TSS=clave_aiesec
NEXT_PUBLIC_NOVA_TSS=clave_nova
# ... para cada grupo
Las llaves RSA deben incluir los saltos de línea como \n.

5.3 Instalar dependencias
Usamos pnpm:

bash
pnpm install

