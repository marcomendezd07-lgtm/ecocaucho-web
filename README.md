# Barber SaaS (Gestión integral para barberías)

Aplicación SaaS full stack para administrar clientes, citas, barberos y servicios con panel administrativo y página pública de reservas online.

## Estructura

- `backend/` API REST en Node.js + Express + PostgreSQL.
- `frontend/` panel React + Tailwind CSS (tema claro/oscuro).
- `database/schema.sql` esquema completo de base de datos.

## Funcionalidades incluidas

- Autenticación segura con JWT en cookie HTTP-only.
- Dashboard con métricas clave (citas de hoy, clientes, ingresos semanales, servicios populares, próximas citas).
- Gestión completa de clientes, barberos y servicios.
- Calendario semanal tipo agenda con drag & drop para reagendar citas.
- Prevención de doble reserva y cálculo de horarios disponibles según duración del servicio y horario laboral del barbero.
- Estados de cita: `confirmada`, `cancelada`, `completada`.
- Página pública `/reservar` para reservas online.
- Exportación de citas CSV.
- Interfaz completa en español y responsive.

## Requisitos

- Node.js 18+
- PostgreSQL 14+

## Instalación rápida

### 1) Base de datos

```bash
createdb barber_saas
psql -d barber_saas -f database/schema.sql
```

### 2) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3) Frontend

```bash
cd frontend
npm install
npm run dev
```

## Variables de entorno backend

Archivo `backend/.env`:

```env
PORT=4000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/barber_saas
JWT_SECRET=cambia-esta-clave-super-segura
CORS_ORIGIN=http://localhost:5173
```

## Rutas principales API

- `POST /api/auth/register` (crear admin)
- `POST /api/auth/login`
- `GET /api/dashboard`
- `CRUD /api/clients`
- `CRUD /api/barbers` + `PUT /api/barbers/:barberId/working-hours`
- `CRUD /api/services`
- `CRUD /api/appointments`
- `GET /api/appointments/available-slots`
- `GET /api/public/metadata`
- `POST /api/public/book`

## Flujo recomendado de arranque

1. Registrar admin (`/api/auth/register`).
2. Iniciar sesión en `/login`.
3. Crear servicios.
4. Crear barberos y asignar servicios.
5. Configurar horarios laborales de cada barbero.
6. Crear/gestionar clientes y citas.
7. Compartir `/reservar` para reservas de clientes.
