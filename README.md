# Simit Consultant

> Documentación del proceso de diseño e implementación del sistema **Simit Consultant**.
> 
> *Juan José Jara Calle*

---

## Tabla de Contenidos

- [Arquitectura Propuesta](#arquitectura-propuesta)
- [Instrucciones de Ejecución](#instrucciones-de-ejecución)
- [Decisiones Técnicas](#decisiones-técnicas)
- [Limitaciones Encontradas](#limitaciones-encontradas)
- [Mejoras Futuras](#mejoras-futuras)

---

## Arquitectura Propuesta

### Diagrama de Arquitectura

> Ver diagrama completo en la [Wiki — Diagramas](https://github.com/JaraCalle/Simit-Consultant/wiki/Diagramas#diagrama-de-arquitectura)

### Entidad Base de Datos

> Ver diagrama de entidad en la [Wiki — Diagramas](https://github.com/JaraCalle/Simit-Consultant/wiki/Diagramas#entidad-base-de-datos)

### Solución al Problema de Ingeniería Inversa SIMIT
Las fotos del paso a paso las puse en la Wiki de este repositorio, puedes ir a comprobarlas allá. [Wiki - Pruebas del paso a paso](https://github.com/JaraCalle/Simit-Consultant/wiki/Soluci%C3%B3n-Problema-de-Ingenier%C3%ADa-Inversa-SIMIT)

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
