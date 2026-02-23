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


4.3 Formulario de correo y datos personales/académicos
Form-Email.tsx: pide el correo institucional y verifica reCAPTCHA. Al enviar, se comunica con /api/Data-Email. Si el usuario ya existe, redirige según su progreso; si no, lo crea y redirige a /home. Además, genera un JWT y lo guarda en una cookie HttpOnly.

Form-Personal.tsx: envía nombre y apellidos a /api/Data-Personal.

Form-Academic.tsx: envía pregrado, segundo pregrado y semestre a /api/Data-Academic.

Estos formularios son los primeros pasos del flujo principal y comparten la misma estructura básica que los formularios de grupo.

4.4 Panel de análisis (analytics)
Ruta: /analytics. Muestra gráficos y estadísticas globales de las inscripciones. Está protegido por una contraseña fija definida en la variable de entorno NEXT_PUBLIC_ANALY_TSS. Una vez autenticado, se muestra el componente <Dashboard /> que contiene varios subcomponentes:

career.tsx: gráfico de inscritos por carrera (usando recharts).

days.tsx: inscritos por día.

groups.tsx: inscritos por grupo estudiantil.

hours.tsx: inscritos por hora del día.

semester.tsx: inscritos por semestre.

top-group.tsx: grupo con más inscritos.

totalpersons.tsx: total de personas registradas.

Todos estos componentes obtienen datos de los endpoints de la API (ej: /api/analytics/days, /api/analytics/groups, etc.) y se actualizan automáticamente cada 5 segundos mediante setInterval.

4.5 Paneles de listas (lists)
Ruta: /lists/[grupo] (ej: /lists/aiesec). Cada grupo tiene su propia página que muestra la lista de personas inscritas, agrupada por algún criterio (departamento, horario, comité, etc.). También están protegidas por contraseñas individuales definidas en variables de entorno como NEXT_PUBLIC_AIESEC_TSS, NEXT_PUBLIC_NOVA_TSS, etc.

Cada página consulta su correspondiente endpoint en /api/lists/[grupo] y muestra los datos en tablas. Incluye un botón para exportar a CSV y un botón para cambiar entre vista agrupada y lista plana.

4.6 Autenticación (JWT + cookies)
La autenticación se maneja mediante JWT almacenado en una cookie HttpOnly llamada jwtToken. Esto evita que el token sea accesible desde JavaScript en el cliente, protegiéndolo contra ataques XSS.

Generación: en /api/Data-Email (y otros endpoints similares) se firma un JWT con la clave secreta JWT_SECRET_KEY y se envía al cliente mediante Set-Cookie.

Verificación en cliente: el hook useAuthCheck (en src/app/hooks/useAuthCheck.ts) se encarga de verificar si el token es válido llamando a /api/cookieCheck. Si no es válido, redirige al inicio (/).

Verificación en servidor: muchos endpoints usan el helper verifyJwtFromCookies (en cookieManagement.ts) para extraer y verificar el token, devolviendo el email del usuario.

Importante: La cookie tiene un tiempo de vida corto (12 minutos en /api/Data-Email) para reforzar la seguridad, pero se renueva en cada paso del flujo.

4.7 API routes
Todas las rutas API están dentro de src/pages/api/. Siguen la estructura de archivos de Next.js (páginas/api). Los endpoints más importantes son:

Data-Email.ts, Data-Personal.ts, Data-Academic.ts: manejan los pasos iniciales del formulario.

forms/[grupo].ts: reciben los datos de los formularios de grupos y los insertan en la tabla correspondiente (ej: aiesec, nova). Verifican duplicados usando ON CONFLICT.

analytics/*.ts: devuelven datos agregados para los gráficos.

lists/[grupo].ts: devuelven los registros de cada grupo, con joins a la tabla persona para obtener información adicional.

redirecting.ts: recibe el grupo seleccionado y redirige al formulario correspondiente, verificando si el usuario ya está inscrito.

cookieCheck.ts: verifica la validez del JWT.

authMiddleware.ts: (actualmente no se usa, pero es un ejemplo de middleware para proteger rutas).

4.8 Utilidades de encriptación
src/lib/crypto.ts y src/lib/decrypt.ts implementan un sistema de encriptación híbrida:

Cliente (crypto.ts): genera una clave AES aleatoria, encripta los datos con AES‑CBC, luego encripta la clave AES con la clave pública RSA (obtenida de NEXT_PUBLIC_RSA_PUBLIC_KEY). Envía al servidor { encryptedKey, encryptedData, iv }.

Servidor (decrypt.ts): recibe el payload, desencripta la clave AES usando la clave privada RSA (RSA_PRIVATE_KEY), luego desencripta los datos con AES. También incluye un helper getRequestBody que desencripta automáticamente si el header X-Encrypted está presente.

Esto asegura que incluso si alguien intercepta la petición, no pueda leer los datos sin la clave privada.

4.9 Capa de base de datos
La conexión a PostgreSQL se maneja en src/pages/api/db.ts. Exporta:

getPool(): devuelve un pool de conexiones (singleton) configurado con variables de entorno (preferiblemente SUPABASE_DB_URL o variables individuales).

dbQuery(): ejecuta una consulta y maneja reconexiones automáticas en caso de fallos de conexión.

withTransaction(): ejecuta múltiples consultas dentro de una transacción.

Las tablas principales son:

persona: datos básicos de cada usuario (correo, nombre, pregrado, semestre, etc.).

Tablas específicas por grupo: aiesec, nova, club_in, etc., que contienen las respuestas de los formularios, con una clave foránea a persona(correo).

Esquema simplificado (no exhaustivo):

sql
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
4.10 Componentes de UI reutilizables
En src/app/globalcomponents/UI/ encontramos componentes de interfaz genéricos:

Button.tsx: botón con múltiples temas (default, fifa, china) y variantes de color. El tema "fifa" tiene un diseño especial con sombra y un balón animado.

Input.tsx y Select.tsx: inputs y selects estilizados, con soporte para errores y temas de color.

FormContainer.tsx: un contenedor que envuelve los formularios con un diseño de tarjeta con bordes redondeados.

ConfettiAnimation.tsx y Pixels_animation.tsx: animaciones en canvas para darle vida a las páginas.

ExportCSV.tsx: botón para exportar datos a CSV.

Footer_NOVA_blanco/negro.tsx: pies de página con el logo de NOVA.

Estos componentes son utilizados en todas las páginas para mantener una apariencia consistente.

4.11 Configuración y assets
Tailwind CSS: configurado en tailwind.config.ts y postcss.config.mjs. Se definen fuentes personalizadas (EA Font, FIFA26, FWC26) y utilidades para viewport dinámico (dvh).

Next.js config: en next.config.ts se ignoran errores de ESLint en builds y se configuran patrones remotos para imágenes (usamos blob storage de Azure).

Fuentes e imágenes: en public/ y src/fonts/. El script scripts/optimize-images.mjs convierte PNG a WebP para optimizar carga.

Variables de entorno: necesitas crear un archivo .env.local con las claves que se detallan en la siguiente sección.

🚀 Guía de ejecución local
Sigue estos pasos para poner el proyecto en funcionamiento en tu máquina.

5.1 Clonar el repositorio
bash
git clone https://github.com/gruponovaeafit/VTG-WebForm.git
cd VTG-WebForm
5.2 Configurar variables de entorno
Crea un archivo .env.local en la raíz del proyecto. Pide al director o al encargado del proyecto los valores reales. Aquí tienes un ejemplo con las variables necesarias:

env
# Base de datos (Supabase)
SUPABASE_DB_URL=postgresql://usuario:contraseña@host:puerto/basedatos
# o si usas variables individuales:
# SUPABASE_DB_HOST=...
# SUPABASE_DB_PASSWORD=...
# etc.

# JWT
JWT_SECRET_KEY=una_clave_secreta_muy_larga

# reCAPTCHA
NEXT_PUBLIC_CLIENT_KEY_CAPTCHA=clave_publica_del_sitio
SERVER_KEY_CAPTCHA=clave_secreta_del_servidor

# RSA (pares de llaves)
NEXT_PUBLIC_RSA_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
RSA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Contraseñas para paneles (cada grupo y analytics)
NEXT_PUBLIC_ANALY_TSS=clave_analytics
NEXT_PUBLIC_AIESEC_TSS=clave_aiesec
NEXT_PUBLIC_NOVA_TSS=clave_nova
... # y así para cada grupo
Nota: Las llaves RSA deben tener los saltos de línea representados como \n (así como vienen en el ejemplo). Si tienes dudas, pide ayuda.

5.3 Instalar dependencias
Usamos pnpm:

bash
pnpm install
5.4 Inicializar la base de datos
La base de datos en la nube (Supabase) ya debería tener las tablas creadas. Si necesitas crearlas localmente, puedes usar el script init.sql (aunque está pensado para MySQL). Para PostgreSQL, deberías ejecutar manualmente las sentencias CREATE TABLE correspondientes. Consulta el esquema en el código (archivos de API) para conocer la estructura de cada tabla.

Si tienes Docker y quieres probar con PostgreSQL local, puedes levantar un contenedor:

bash
docker run --name vtg-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
Luego crea las tablas usando un cliente SQL o mediante las migraciones que tengas.

5.5 Ejecutar en modo desarrollo
bash
pnpm dev
La aplicación estará disponible en http://localhost:3000.

5.6 Verificar que todo funciona
Abre http://localhost:3000 – deberías ver la página de inicio con animación y después de 5 segundos redirigir a /email.

Completa el formulario de correo con un correo @eafit.edu.co y resuelve el reCAPTCHA. Si es la primera vez, te redirigirá a /home.

Llena los datos personales y académicos; luego en /groupslist selecciona un grupo y completa su formulario.

Al finalizar, deberías ver la página /90+1 con un botón para volver al inicio.

Prueba los paneles: /analytics (requiere contraseña) y /lists/aiesec (con su propia contraseña). Deberías ver datos si ya hay inscripciones.

Si todo funciona, ¡felicitaciones! Ya tienes el entorno listo.

❗ Solución de problemas comunes
Error: NEXT_PUBLIC_RSA_PUBLIC_KEY no está configurada
Asegúrate de tener el archivo .env.local completo y con las variables correctas. Las llaves RSA deben incluir los saltos de línea como \n.

Error de conexión a la base de datos: password authentication failed o ENOTFOUND
Verifica que las variables de entorno de la base de datos sean correctas (especialmente SUPABASE_DB_URL). Si usas Supabase, asegúrate de que la IP de tu máquina esté permitida en la configuración de Supabase (Network Restrictions).

Error de validación de reCAPTCHA
Asegúrate de que las claves de reCAPTCHA estén bien configuradas y que el dominio localhost esté agregado en la consola de Google reCAPTCHA.

No se guardan los datos al enviar un formulario de grupo
Revisa la consola del navegador y del servidor. Posibles causas: token JWT expirado (vuelve a empezar desde /email), conflicto de clave primaria (ya estás registrado), o error en la API.

Si ves el error "Ya estás registrado en este grupo", es normal: significa que ya te inscribiste antes.

La cookie JWT no se está enviando
Verifica que la cookie tenga el flag HttpOnly y que el navegador la esté enviando. Puedes verlo en las herramientas de desarrollo (pestaña Application > Cookies).

Problemas con las animaciones (confeti, píxeles)
Las animaciones usan canvas y pueden consumir muchos recursos. Si notas lentitud, puedes reducir el número de partículas en los componentes (numPieces en ConfettiAnimation).

Error de tipos en TypeScript
Asegúrate de tener las versiones correctas de las dependencias. Ejecuta pnpm install nuevamente.

No encuentras una variable de entorno
Pregunta al director del proyecto o busca en el canal de Discord/WhatsApp del equipo. Nunca subas las claves reales al repositorio.
