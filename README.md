# Prueba Técnica – Desarrollador Backend JavaScript (Node.js)

## Descripción

API RESTful para la gestión de una cadena de almacenes, desarrollada en Node.js + TypeScript, con PostgreSQL, Prisma ORM y Redis. Incluye autenticación, validaciones, pruebas automáticas y documentación OpenAPI.

---

## Instrucciones de instalación y ejecución

### 1. Clonar el repositorio

```bash





git  clone  <URL_DEL_REPO>





cd  <NOMBRE_DEL_REPO>





```

### 2. Variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash



cp  .env.example  .env



```

Luego, edita el archivo `.env` con los valores apropiados para tu entorno. Ejemplo de variables:

```



DATABASE_URL=postgresql://usuario:password@localhost:5432/mi_basededatos



REDIS_URL=redis://localhost:6379



JWT_SECRET=alguna_clave_secreta



PORT=3000



```

Consulta el archivo `.env.example` para ver todas las variables requeridas y su formato.

### 3. Levantar servicios con Docker

```bash





docker-compose  up  -d





```

Esto inicia PostgreSQL y Redis.

### 4. Instalar dependencias

```bash





npm  install





```

### 5. Ejecutar migraciones y seeds

```bash





npx  prisma  migrate  dev





npx  prisma  db  seed





```

### 6. Iniciar la API

```bash





npm  run  dev





```

### 7. Acceder a la documentación OpenAPI

Disponible en: [http://localhost:3000/docs](http://localhost:3000/docs)

> Nota: la documentación es generada en ejecución.

---

## Scripts útiles

- `npm run dev`: Inicia el servidor en modo desarrollo

- `npm run build`: Compila el proyecto

- `npm run start`: Inicia el servidor en producción

- `npm run test`: Ejecuta todas las pruebas

- `npm run lint`: Linter

---

## DFD – Diagrama de Flujo de Datos

El siguiente diagrama resume el flujo principal de la API y sus componentes:

```

[Cliente/Empleado]

|

v

(API - Express)

|

v

[Servicios de Dominio / Casos de Uso]

|

v

[Repositorios / Prisma ORM]

|

v

[Base de Datos PostgreSQL]

|

+--> [Auth/JWT]

+--> [Validaciones (Zod)]

+--> [Logging / Manejo de errores]

+--> [Cache Redis]

```

Flujos principales:

- Gestión de catálogos: artículos, fabricantes, ubicaciones, colocaciones.

- Compras: alta y acumulación de unidades por (cliente, colocación).

- Seguridad: registro y login de usuarios; alta de empleados con validaciones.

---

## Supuestos y decisiones de diseño

- Contraseñas hasheadas con bcrypt.

- Validaciones robustas con Zod.

- Acumulación de compras por (cliente, colocación) usando upsert.

- Cache Redis en todos los GET de catálogos.

- Seguridad: CORS, Helmet, manejo de errores centralizado.

- Formato de cédula y teléfono: República Dominicana.

- Proyecto organizado bajo principios de Clean Architecture.

---

## Cobertura de pruebas

- Ejecuta `npm run test -- --coverage` para ver el reporte.

- Umbral sugerido: 80% líneas/branches.

---

## Documentación OpenAPI/Swagger

- Anotaciones en los archivos de rutas.

- Accesible en `/docs`.

---

## Estructura del proyecto

- `src/` Código fuente

- `prisma/` Esquema y migraciones

- `tests/` Pruebas unitarias e integración

- `docker-compose.yml` Infraestructura

---

## Contacto

Cualquier duda o sugerencia: [andymreyes@outlook.es]
