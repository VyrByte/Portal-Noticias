# 📰 Portal de Noticias — Proyecto Final

Un **Portal de Noticias** completo e interactivo desarrollado como proyecto final de la materia **Programación Profesional**. El proyecto cuenta con un diseño editorial de alta gama en formato blanco y negro (estilo periódico tradicional *The New York Times*) y está implementado con **Vue 3** para el cliente y **JSON Server** para el backend.

Tanto el FrontEnd como el BackEnd comparten el mismo lenguaje de desarrollo (**JavaScript**).

---

## 🚀 Guía de Instalación y Ejecución

### Requisitos Previos
Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 16 o superior) y **npm** en tu sistema.

---

### Paso 1: Instalación de Dependencias
El proyecto cuenta con un script automatizado en la raíz para instalar todos los módulos necesarios tanto para el cliente como para el servidor de base de datos. Abre una terminal en la carpeta principal del proyecto y ejecuta:

```bash
npm run install:all
```

---

### Paso 2: Levantar los Servicios

Tienes dos opciones de comandos desde la terminal en la raíz según tu flujo de trabajo:

#### Opción A: Modo Producción (Recomendado para entrega/demostración)
Compila el frontend de manera optimizada, levanta la base de datos local en una ventana independiente e inicia el servidor de vista previa de Vite:
```bash
npm run levantar
```
* **FrontEnd (Vite Preview):** `http://localhost:4173`
* **BackEnd (JSON Server):** `http://localhost:3001`

#### Opción B: Modo Desarrollo (Con Hot-Reload)
Inicia los servidores de desarrollo interactivos para que cualquier cambio en el código se refleje al instante en el navegador:
```bash
npm run dev
```
* **FrontEnd (Vite Dev Server):** `http://localhost:5173`
* **BackEnd (JSON Server):** `http://localhost:3001`

---

## 🎨 Diseño Visual: Estética Editorial "The New York Times"
El portal cuenta con un diseño impecable, sobrio y altamente profesional:
* **Tema Monocromático:** Un entorno visual "tinta sobre papel" con fondo blanco puro (`#ffffff`), tipografías en negro carbón (`#111111`) y grises apagados.
* **Tipografía de Alta Gama:** Uso de la elegante tipografía Serif clásica **Playfair Display** para cabeceras y títulos de noticias principales, y **Inter** (sans-serif) para el texto de la interfaz.
* **Líneas y Divisores de Prensa Escrita:** Implementación de doble línea tradicional en separadores y bordes rectangulares finos (radios de esquina de 2px-4px) sin degradados ni efectos RGB de neón.
* **Interacciones Clásicas:** Los titulares se subrayan sutilmente al pasar el mouse, los botones son planos y de alto contraste, y las insignias de categorías emulan etiquetas de secciones impresas.

---

## 📁 Estructura del Repositorio

```text
portal-noticias/
├── backend/
│   ├── db.json              ← Base de datos simulada (JSON Server)
│   ├── package.json         ← Configuración y dependencias del backend
│   └── package-lock.json
├── frontend/
│   ├── index.html           ← Punto de entrada HTML (SEO, fuentes)
│   ├── vite.config.js       ← Proxy de API a http://localhost:3001
│   ├── package.json         ← Dependencias del cliente (Vue 3, Vuex, Router, Axios)
│   └── src/
│       ├── main.js          ← Archivo principal de inicialización de Vue 3
│       ├── App.vue          ← Componente contenedor y transiciones de páginas
│       ├── assets/
│       │   ├── main.css     ← Sistema de estilos y variables monocromáticas
│       │   └── hero.png     ← Imagen representativa de portada
│       ├── router/
│       │   └── index.js     ← Definición de rutas y Guards de título dinámico
│       ├── store/
│       │   └── index.js     ← Estado global Vuex (CRUD de favoritos y noticias)
│       ├── utils/
│       │   └── localStorage.js ← Utilidades para persistencia del almacenamiento
│       ├── services/
│       │   ├── newsApi.js   ← Integración con GNews API y mock data de respaldo
│       │   └── localApi.js  ← Operaciones de fetch CRUD para JSON Server
│       ├── components/      ← 7 componentes interactivos (Mínimo: 5)
│       │   ├── NavBar.vue
│       │   ├── CategoryFilter.vue
│       │   ├── NewsCard.vue
│       │   ├── SearchBar.vue
│       │   ├── NewsForm.vue
│       │   ├── Spinner.vue
│       │   └── ErrorMessage.vue
│       └── views/           ← Vistas principales asociadas a rutas
│           ├── HomeView.vue
│           ├── DetailView.vue
│           ├── SearchView.vue
│           ├── FavoritesView.vue
│           └── CreateView.vue
├── package.json             ← Scripts de ejecución en la raíz
└── README.md                ← Documentación del proyecto
```

---

## ✅ Requisitos Obligatorios Cubiertos

### 1. JavaScript ES6+
* **let y const:** Utilizados en todo el código para la asignación y declaración de variables.
* **Funciones Flecha:** Definidas en todas las acciones de Vuex, servicios API y métodos reactivos de los componentes Vue.
* **Operador Spread y Rest:** 
  * *Spread (`...`):* Integración de campos al crear favoritos, clonación del estado en Vuex y combinación de datos.
  * *Rest (`...`):* Extracción de datos en formularios y edición de noticias.
* **Desestructuración:** Empleado en la carga de noticias (`const [first, ...rest] = news`) y extracción de propiedades críticas de los objetos.

### 2. Vue.js (Core)
* **Componentes:** Separación de la interfaz en componentes SFC (.vue) enfocados y altamente reutilizables.
* **Directivas principales:** 
  * `v-if` / `v-else` para cargas condicionales, vacíos y modales de error.
  * `v-for` para grids de noticias, sub-enlaces de navegación y filtros.
  * `v-model` con modificadores para formularios e inputs en tiempo real.

### 3. Vue Router (Navegación)
Configurado en `frontend/src/router/index.js` con **Lazy Loading** para optimizar la carga de las 6 rutas principales y un **Navigation Guard** global que actualiza de manera dinámica el título de la página en la pestaña del navegador:
* `/` → Inicio (`HomeView`)
* `/news/:id` → Detalles (`DetailView`)
* `/search` → Buscador (`SearchView`)
* `/favorites` → Favoritos (`FavoritesView`)
* `/create` → Creación (`CreateView`)
* `/edit/:id` → Edición (`CreateView` con carga condicional)

### 4. Vuex (Manejo de Estado Global)
Implementado de forma completa y estructurada en `frontend/src/store/index.js`:
* **State:** Datos centralizados (`news`, `favorites`, `selectedCategory`, `loading`, `error`, `recentSearches`).
* **Mutations:** Modificaciones sincrónicas del estado (`SET_NEWS`, `ADD_FAVORITE`, `DELETE_FAVORITE`, etc.).
* **Actions:** Peticiones asíncronas para cargar datos de APIs y sincronizarlos con la base de datos local y el store.
* **Getters:** Selectores calculados (`filteredNews`, `totalFavorites`, `isFavorite`).

### 5. Consumo de API
* **API Local (JSON Server):** Servicios CRUD en `frontend/src/services/localApi.js` para persistir las noticias favoritas directamente a la base de datos local `db.json` en el puerto `3001` mediante operaciones Fetch.
* **API Externa (GNews API):** Integración en `frontend/src/services/newsApi.js` para consumir noticias reales del mundo. En caso de fallas de red o límite de API superado, el servicio cuenta con un robusto **fallback a 12 artículos mock estructurados**.

### 6. Formularios con Validación en Tiempo Real
Localizado en `frontend/src/components/NewsForm.vue`. Valida los datos conforme el usuario interactúa:
* Título: Requerido, mínimo 5 caracteres.
* Descripción: Requerida, mínimo 20 y máximo 300 caracteres.
* Categoría: Selección obligatoria.
* Imagen y URL: Estructura de enlace web válida.
* **Vista previa instantánea** de imagen al proporcionar una URL.
* **Contador dinámico** de caracteres para la descripción con advertencia visual de exceso de caracteres.

### 7. CRUD Completo
* **Create:** Adición de una nueva noticia mediante formulario y POST a la base de datos.
* **Read:** Renderizado del listado de favoritos y lectura de artículos completos.
* **Update:** Edición y actualización reactiva de las noticias agregadas mediante formulario reutilizado en `/edit/:id` (PUT).
* **Delete:** Remoción de favoritos desde la interfaz con un modal de confirmación sobrio.

### 8. Persistencia con LocalStorage
Manejo de utilidades en `frontend/src/utils/localStorage.js` para guardar de forma local:
* Filtros de categorías seleccionados previamente.
* Lista de búsquedas recientes (limita a las últimas 8 búsquedas del usuario).
* Estado de sincronización rápida.
