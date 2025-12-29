# Conferencias App - Wheelwright

## Descripción
Aplicación web progresiva (PWA) desarrollada con Angular y Firebase para la gestión integral de conferencias públicas, arreglos de oradores y eventos especiales de la congregación Wheelwright.

Esta herramienta permite a los encargados de conferencias administrar el programa semanal, coordinar visitas de oradores, gestionar salidas a otras congregaciones y mantener informado al auditorio mediante una vista pública moderna y accesible.

## Características Principales

### 🏠 Vista Pública (Home)
*   **Cartelera Digital**: Visualización clara de la conferencia de la semana en curso.
*   **Roadmap de Eventos**: Línea de tiempo con las próximas visitas, salidas y eventos especiales (Asambleas, Visitas del Superintendente).
*   **Filtros**: Alternancia fácil entre "Conferencias" (entrantes/eventos) y "Salidas" (oradores locales que visitan otras congregaciones).
*   **Diseño Adaptativo**: Interfaz moderna con soporte nativo para **Modo Oscuro** y **Modo Claro**.
*   **PWA**: Instalable como aplicación nativa en dispositivos iOS y Android.

### ⚙️ Panel de Administración
*   **Gestión de Arreglos**: 
    *   Creación de visitas, salidas y eventos.
    *   Validación inteligente para evitar conflictos y duplicados.
    *   Autocompletado de oradores y congregaciones.
*   **Base de Datos de Oradores**:
    *   Registro de oradores locales y visitantes.
    *   Gestión de repertorios (temas) por orador.
*   **Gestión de Congregaciones**: Agenda de congregaciones vecinas para coordinar intercambios.
*   **Catálogo de Temas**: Base de datos completa de bosquejos públicos.
*   **Acciones Rápidas**: Compartir arreglos por WhatsApp, editar y eliminar registros.

## Tecnologías Utilizadas

*   **Framework**: Angular (Última versión, Standalone Components, Signals).
*   **Estilos**: Tailwind CSS (Diseño utility-first).
*   **Backend & DB**: Firebase (Firestore Database).
*   **Hosting**: Firebase Hosting.
*   **Internacionalización**: Configurado totalmente en Español (fechas, formatos).

## Guía de Instalación y Uso

### Requisitos Previos
Asegúrate de tener instalado [Node.js](https://nodejs.org/) (LTS) y Angular CLI.

### 1. Instalación
Clona el proyecto e instala las dependencias:

```bash
git clone <url-del-repo>
cd conferencias-app
npm install
```

### 2. Ejecución en Desarrollo
Para levantar el servidor local y ver la aplicación:

```bash
npm start
```
La aplicación se abrirá en `http://localhost:4200/`.

### 3. Construcción (Build)
Para compilar la aplicación para producción (genera la carpeta `dist`):

```bash
npm run build
```

### 4. Despliegue (Deploy)
Para subir la aplicación a Firebase Hosting (requiere permisos de administrador en Firebase):

```bash
firebase deploy
```

## Estructura del Proyecto

*   `src/app/components`: Contiene toda la lógica visual (Admin, Home, Cards, Forms).
*   `src/app/core/models`: Interfaces TypeScript (Arrangement, Speaker, etc.).
*   `src/app/core/services`: Lógica de negocio y comunicación con Firestore.
*   `src/app/core/data`: Datos estáticos (ej. lista de Cánticos).

---
© 2025 - Desarrollado para la Congregación Wheelwright
