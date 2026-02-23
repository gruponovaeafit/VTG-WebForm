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
- **pnpm** como gestor de paquetes (lo usamos en lugar de npm por su velocidad y eficiencia).  
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

A continuación se muestra la organización de carpetas y archivos principales. No te asustes, es más sencillo de lo que parece.
