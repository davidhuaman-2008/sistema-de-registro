# 📊 Sistema de Registro con Excel como Base de Datos

Sistema CRUD (Crear, Leer, Actualizar, Eliminar) que utiliza un archivo **Excel** (`.xlsx`) como base de datos. Construido con **Node.js**, **Express** y **JavaScript modular** en el frontend.

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![Node](https://img.shields.io/badge/node-%3E%3D%2018.x-green)
![License](https://img.shields.io/badge/license-ISC-blue)

---

## 📋 Tabla de contenido

- [Características](#-características)
- [Demo](#-demo)
- [Tecnologías](#-tecnologías)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Arquitectura](#-arquitectura)
- [Cómo funciona](#-cómo-funciona)
- [Próximas mejoras](#-próximas-mejoras)
- [Autor](#-autor)

---

## ✨ Características

- ✅ **CRUD completo** sobre archivo Excel
- 🔍 **Filtros en tiempo real** por nombre, DNI, edad y ciudad
- 🧮 **Cálculo automático bidireccional**: Edad ↔ Fecha de nacimiento
- 🎨 **Diseño responsive** con variables CSS
- 📦 **Arquitectura modular** (separación por capas: api, modules, utils, config)
- 🚫 **Validación de DNI duplicado**
- 💾 **Persistencia real** en archivo `.xlsx`
- 🧩 **Componentes HTML reutilizables** (header, footer)

---

## 🎥 Demo

> Próximamente se agregará un GIF de la aplicación en funcionamiento.

---

## 🛠 Tecnologías

### Backend
- [Node.js](https://nodejs.org/) v18+
- [Express](https://expressjs.com/) — Servidor web
- [SheetJS (xlsx)](https://sheetjs.com/) — Lectura/escritura de Excel
- [CORS](https://www.npmjs.com/package/cors) — Manejo de peticiones cruzadas

### Frontend
- HTML5 semántico
- CSS3 (variables, grid, flexbox)
- JavaScript ES6+ (módulos nativos)
- Fetch API

---

## 📁 Estructura del proyecto

```
sistema-de-registro/
│
├── backend/                        # Servidor Node.js
│   └── app.js                      # API REST + acceso al Excel
│
├── database/                       # Base de datos
│   └── datos.xlsx                  # Archivo Excel (base de datos real)
│
├── public/                         # Carpeta pública (servida por Express)
│   │
│   ├── components/                 # Componentes HTML reutilizables
│   │   ├── header.html
│   │   └── footer.html
│   │
│   ├── css/
│   │   └── styles.css              # Estilos globales (con variables CSS)
│   │
│   ├── js/                         # JavaScript modular
│   │   ├── config/
│   │   │   └── config.js           # Constantes y endpoints
│   │   │
│   │   ├── utils/
│   │   │   ├── fechas.js           # Utilidades de fechas
│   │   │   └── ui.js               # Utilidades de interfaz
│   │   │
│   │   ├── api/
│   │   │   └── api.js              # Capa de comunicación con el backend
│   │   │
│   │   ├── modules/
│   │   │   ├── tabla.js            # Renderizado de la tabla
│   │   │   ├── formulario.js       # Lógica del formulario
│   │   │   └── filtros.js          # Filtros en tiempo real
│   │   │
│   │   └── main.js                 # Punto de entrada (orquestador)
│   │
│   ├── contacto.html
│   └── index.html
│
├── node_modules/
├── package.json
└── README.md
```

---

## 🚀 Instalación

### Requisitos previos
- [Node.js](https://nodejs.org/) instalado (v18 o superior)
- Git (opcional)
- Excel, LibreOffice o cualquier editor de hojas de cálculo

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/davidhuaman-2008/sistema-de-registro.git
cd sistema-de-registro
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Verificar la estructura del Excel**

El archivo `database/datos.xlsx` debe tener la siguiente estructura en la **fila 1** (encabezados):

| nombre | apellido | edad | fechaNacimiento | dni | celular | ciudad |
|--------|----------|------|-----------------|-----|---------|--------|
| Juan   | Perez    | 34   | 15/05/1989      | 45678912 | 987654321 | Lima |

> ⚠️ **Importante:** Los encabezados deben estar en **minúsculas** y sin espacios.

---

## 🎬 Uso

1. **Iniciar el servidor**
```bash
cd backend
node app.js
```

Verás:
```
✅ Servidor corriendo en http://localhost:3000
📁 Base de datos: .../database/datos.xlsx
📁 Carpeta pública: .../public
```

2. **Abrir en el navegador**
```
http://localhost:3000
```

3. **Operaciones disponibles**
- ➕ Agregar un nuevo registro
- ✏️ Editar un registro existente (botón lápiz)
- 🗑️ Eliminar un registro (botón papelera)
- 🔍 Filtrar por nombre, DNI, edad o ciudad
- 🧮 Autocompletar edad ↔ fecha de nacimiento

---

## 🔌 API Endpoints

| Método | Endpoint | Descripción | Body (ejemplo) |
|--------|----------|-------------|----------------|
| `GET` | `/api/datos` | Obtener todos los registros | — |
| `POST` | `/api/agregar` | Agregar un registro | `{ "nombre": "Juan", "dni": "12345678", ... }` |
| `PUT` | `/api/actualizar/:dniOriginal` | Actualizar un registro | `{ "nombre": "Juan Editado", ... }` |
| `DELETE` | `/api/eliminar/:dni` | Eliminar un registro | — |

### Ejemplo de respuesta — `GET /api/datos`
```json
[
  {
    "nombre": "Juan",
    "apellido": "Perez",
    "edad": 34,
    "fechaNacimiento": 32643,
    "dni": "45678912",
    "celular": "987654321",
    "ciudad": "Lima"
  }
]
```

> ℹ️ `fechaNacimiento` se almacena como **número de serie de Excel** (días desde 1900). El frontend lo convierte automáticamente a `DD/MM/AAAA`.

---

## 🏗 Arquitectura

El proyecto sigue una arquitectura **modular tipo "LEGO"**, donde cada archivo tiene una única responsabilidad:

### Backend
| Bloque | Descripción |
|--------|-------------|
| **Configuración** | Importaciones, puerto y rutas |
| **Acceso al Excel** | Funciones `leerExcel()` y `escribirExcel()` |
| **API REST** | Endpoints GET, POST, PUT, DELETE |
| **Servidor** | Arranque con `app.listen()` |

### Frontend
| Capa | Responsabilidad |
|------|-----------------|
| **config/** | Constantes globales (URLs, endpoints) |
| **utils/** | Funciones puras reutilizables (fechas, UI) |
| **api/** | Comunicación con el backend (fetch) |
| **modules/** | Lógica de cada componente (tabla, formulario, filtros) |
| **main.js** | Orquestador que conecta todo |

---

## 🧠 Cómo funciona

1. **Al cargar la página**, `main.js` pide los datos al backend vía `GET /api/datos`.
2. El backend **lee el archivo Excel** con SheetJS y lo devuelve como JSON.
3. El frontend **renderiza la tabla** y conecta los filtros.
4. Cuando el usuario **guarda un nuevo registro**:
   - El frontend envía un `POST /api/agregar`.
   - El backend lee el Excel, agrega el nuevo registro y **sobrescribe el archivo**.
5. Lo mismo ocurre con **editar** (`PUT`) y **eliminar** (`DELETE`).

---

## 🚧 Próximas mejoras

- [ ] Autenticación de usuarios
- [ ] Paginación en la tabla
- [ ] Exportar datos filtrados a PDF
- [ ] Importación masiva desde CSV
- [ ] Tests unitarios con Jest
- [ ] Despliegue en la nube (Railway, Render, etc.)
- [ ] Modo oscuro
- [ ] Notificaciones tipo toast

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la licencia **ISC**. Consulta el archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**David Huaman**
- GitHub: [@davidhuaman-2008](https://github.com/davidhuaman-2008)

---

⭐ **Si este proyecto te resultó útil, no olvides darle una estrella en GitHub.** ⭐