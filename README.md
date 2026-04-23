# Simit Consultant

> Documentación del proceso de diseño e implementación del sistema **Simit Consultant**.
> 
> *Juan José Jara Calle*

**Link de la API**: https://simit-consultant.vercel.app/docs
**Link de la web**: https://simit-consultant-zc1y.vercel.app/

---

## Tabla de Contenidos

- [Arquitectura Propuesta](#arquitectura-propuesta)
- [Instrucciones de Ejecución](#instrucciones-de-ejecución)
- [Decisiones Técnicas](#decisiones-técnicas)
- [Limitaciones Encontradas](#limitaciones-encontradas)
- [Mejoras Futuras](#mejoras-futuras)
- [Script de Base de Datos](#script-de-base-de-datos)
- [Colección Postman](#colección-postman)

---

## Arquitectura Propuesta

### Diagrama de Arquitectura

> Ver diagrama completo en la [Wiki — Diagramas](https://github.com/JaraCalle/Simit-Consultant/wiki/Diagramas#diagrama-de-arquitectura)

### Entidad Base de Datos

> Ver diagrama de entidad en la [Wiki — Diagramas](https://github.com/JaraCalle/Simit-Consultant/wiki/Diagramas#entidad-base-de-datos)

### Solución al Problema de Ingeniería Inversa SIMIT

El SIMIT como aplicación no expone una API pública para consumo. Las opciones más comunes para consultar sus datos implican pagar una API de terceros. Ante este reto, se realizó ingeniería inversa a la página [SIMIT](https://www.fcm.org.co/simit/#/estado-cuenta) mediante los siguientes pasos:

1. Se accedió a la página web y se activó el modo inspeccionar en la sección de red.
2. Se analizó el tráfico generado al ingresar una placa de ejemplo (`QCK77G`).
3. Se identificaron dos endpoints relevantes con método POST:
   - `/consulta` — trae todos los datos de la placa digitada.
   - `/api.php` — se encarga de resolver el captcha.
4. Para descifrar el captcha, se recargó la página con el inspector de red abierto y se capturaron todos los paquetes. Tras un análisis exhaustivo, se encontró un archivo JavaScript que contenía el algoritmo de hasheo para resolver el captcha.
5. Ese algoritmo se tradujo a Python, se copiaron los headers necesarios y se logró enviar las consultas directamente desde la aplicación, bypaseando la validación del captcha.

---

## Instrucciones de Ejecución

Primero, clona el repositorio o descarga el `.zip` a tu máquina local.

### Requisitos

- Python 3.x
- Node.js

### Backend

1. Desde la carpeta raíz del repositorio, accede a la carpeta `backend`.

2. Crea un archivo `.env` dentro de `backend` con el siguiente contenido:

```env
PROJECT_NAME="Simit Consultant"
VERSION="0.1.0"
API_V1_STR="/api"
POSTGRES_URL="postgresql://neondb_owner:npg_rPFx40slwmcj@ep-patient-wind-an3p0nop-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
SIMIT_BASE="https://consultasimit.fcm.org.co/simit/microservices/estado-cuenta-simit/estadocuenta"
CAPTCHA_URL="https://qxcaptcha.fcm.org.co/api.php"
```

> **Opcional:** Puedes crear un entorno virtual con tu gestor de paquetes (`conda` o `pip`).

3. Instala los requerimientos ejecutando desde la carpeta `backend`:

```bash
pip install -e .
```

4. Si todo se instaló correctamente, corre el proyecto con:

```bash
uvicorn app.main:app --reload
```

### Frontend

1. Desde la carpeta raíz del repositorio, navega a la carpeta `frontend`.

2. Crea un archivo `.env` dentro de `frontend` con el siguiente contenido:

```env
VITE_API_URL=http://localhost:8000/api
```

3. Instala las dependencias:

```bash
npm install
```

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

---

Una vez completados ambos pasos, tendrás corriendo:

- **API:** http://localhost:8000/api
- **Frontend:** http://localhost:5173/

---

## Decisiones Técnicas

### Backend

Se utilizó **Python** con el framework **FastAPI**, por ser el lenguaje y framework con mayor experiencia del autor, lo que permitió reducir el tiempo de desarrollo. Además, Python se desempeña muy bien en contextos de automatización y extracción de datos.

### Frontend

Se usó **React + TypeScript**, que permiten montar una interfaz web estética de forma fácil y rápida, complementado con **Tailwind CSS**.

### Base de Datos

Se eligió **PostgreSQL** por su velocidad transaccional y la posibilidad de gestionar campos JSONB, lo que facilita la extracción de datos y el almacenamiento de logs.

### Despliegue

Aunque no era parte del reto, se desplegó el aplicativo completo para facilitar su testeo y uso:

- **Frontend y API:** desplegados en **Vercel**, por su integración directa con GitHub y su pipeline de comprobación automática por cada commit.
- **Base de datos:** desplegada en **Neon**, por ofrecer instancias de PostgreSQL gratuitas ideales para proyectos de tipo mockup.

---

## Limitaciones Encontradas

El tiempo de carga de la API se ve afectado directamente por el rendimiento de la API del SIMIT, lo cual representa una limitante externa fuera del control del desarrollador en cuanto a la velocidad de respuesta al realizar consultas.

Como mitigación, se implementó **concurrencia** para las consultas masivas, buscando reducir al máximo el tiempo de carga en esos escenarios.

---

## Mejoras Futuras

- **Pruebas formales:** El primer paso prioritario es implementar pruebas unitarias y de integración para formalizar el plan de pruebas y establecer una ruta de detección de errores.

- **Pool de hilos:** Aunque ya se implementó asincronismo, agregar un pool de hilos para las consultas masivas podría optimizar aún más los tiempos de carga para múltiples consultas simultáneas.

- **Normalización de base de datos:** Es necesario normalizar y extraer más tablas. Por ejemplo, los campos `multas`, `estado` y `tipo consulta` pueden convertirse en tablas independientes, aplicando una correcta normalización y estandarización de los datos.

---

## Script de Base de Datos

Script SQL para crear la tabla principal del sistema en PostgreSQL:

```sql
CREATE TABLE public."Consultas" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    placa VARCHAR(6) NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE NOT NULL,
    tipo VARCHAR NOT NULL,
    estado VARCHAR NOT NULL,
    respuesta_cruda JSONB,
    cantidad_multas INTEGER,
    mensaje_error VARCHAR,
    multas JSONB
);
```

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` | Identificador único generado automáticamente |
| `placa` | `VARCHAR(6)` | Placa consultada (máx. 6 caracteres) |
| `fecha` | `TIMESTAMP WITH TIME ZONE` | Fecha y hora de la consulta |
| `tipo` | `VARCHAR` | Tipo de consulta realizada |
| `estado` | `VARCHAR` | Estado del resultado (`SIN_MULTAS`, `CON_MULTAS`, `ERROR`) |
| `respuesta_cruda` | `JSONB` | Respuesta completa sin procesar del SIMIT |
| `cantidad_multas` | `INTEGER` | Número de multas encontradas |
| `mensaje_error` | `VARCHAR` | Mensaje de error en caso de fallo |
| `multas` | `JSONB` | Detalle estructurado de las multas encontradas |

---

## Colección Postman

La colección está disponible en el archivo [`SIMIT_API_Consultas.json`](./SIMIT_API_Consultas.json) en la raíz del repositorio. Impórtala directamente en Postman para probar todos los endpoints. De igual forma, tambien puedes probar toda la api desde [Vercel app](https://simit-consultant.vercel.app/docs)

**Variable de entorno:**

| Variable | Valor por defecto |
|---|---|
| `base_url` | `http://localhost:8000` |

### Endpoints disponibles

#### `POST /consultas` — Consulta individual

Consulta el estado de multas de una placa y persiste el resultado.

**Request body:**
```json
{
  "placa": "ABC123"
}
```

**Validación:** La placa debe tener formato de 3 letras + 2 números + 1 alfanumérico opcional (ej: `ABC12`, `ABC123`). Las placas con formato inválido retornan `422 Unprocessable Entity`.

**Respuesta exitosa (`201 Created`):**
```json
{
  "placa": "ABC123",
  "tipoConsulta": "SIMIT",
  "fechaConsulta": "2024-01-15T10:30:00Z",
  "estado": "CON_MULTAS",
  "cantidadMultas": 2,
  "multas": [
    { "numero": "12345", "valor": 150000.0, "estado": "PENDIENTE", "fecha": "2023-12-01" },
    { "numero": "67890", "valor": 300000.0, "estado": "PENDIENTE", "fecha": "2023-11-15" }
  ],
  "error": null
}
```

---

#### `POST /consultas/bulk` — Consultas masivas

Consulta múltiples placas en paralelo. Las placas inválidas se separan automáticamente en el campo `placas_invalidas`. Si una consulta válida falla, el error queda registrado en ese ítem.

**Request body:**
```json
{
  "placas": ["ABC123", "XYZ99", "DEF456", "INVALIDA", "GHI78A"]
}
```

**Respuesta exitosa (`201 Created`):**
```json
{
  "total": 4,
  "exitosas": 3,
  "fallidas": 1,
  "placas": [
    { "placa": "ABC123", "estado": "SIN_MULTAS", "cantidadMultas": 0, "multas": [], "error": null },
    { "placa": "XYZ99",  "estado": "CON_MULTAS", "cantidadMultas": 1, "multas": [...], "error": null },
    { "placa": "DEF456", "estado": "ERROR",       "cantidadMultas": 0, "multas": [], "error": "Timeout al consultar el servicio SIMIT" },
    { "placa": "GHI78A", "estado": "SIN_MULTAS", "cantidadMultas": 0, "multas": [], "error": null }
  ],
  "placas_invalidas": ["QCK77G"]
}
```

---

#### `GET /consultas` — Historial de consultas

Retorna todas las consultas históricas con paginación.

| Query param | Tipo | Descripción |
|---|---|---|
| `skip` | `integer` | Registros a omitir (por defecto `0`) |
| `limit` | `integer` | Máximo de registros a retornar (por defecto `100`) |

**Ejemplo:** `GET /consultas?skip=0&limit=100`

**Respuesta exitosa (`200 OK`):**
```json
[
  {
    "placa": "ABC123",
    "tipoConsulta": "SIMIT",
    "fechaConsulta": "2024-01-15T10:30:00Z",
    "estado": "CON_MULTAS",
    "cantidadMultas": 1,
    "multas": [{ "numero": "99999", "valor": 200000.0, "estado": "PAGADA", "fecha": "2023-09-10" }],
    "error": null
  }
]
```
