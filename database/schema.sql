CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(30) UNIQUE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  duration INTEGER NOT NULL CHECK (duration > 0),
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE barbers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE barber_services (
  barber_id INT REFERENCES barbers(id) ON DELETE CASCADE,
  service_id INT REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (barber_id, service_id)
);

CREATE TABLE working_hours (
  id SERIAL PRIMARY KEY,
  barber_id INT NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  UNIQUE (barber_id, day_of_week)
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  barber_id INT NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
  service_id INT NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'confirmada' CHECK (status IN ('confirmada', 'cancelada', 'completada')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT appointments_time_check CHECK (end_at > start_at)
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  appointment_id INT NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_appointments_barber_time ON appointments (barber_id, start_at, end_at);
CREATE INDEX idx_clients_search ON clients USING gin ((name || ' ' || phone) gin_trgm_ops);
