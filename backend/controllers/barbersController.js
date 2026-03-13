import { query } from '../config/db.js';

export const listBarbers = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT b.*, COALESCE(json_agg(DISTINCT bs.service_id) FILTER (WHERE bs.service_id IS NOT NULL), '[]') AS services
       FROM barbers b
       LEFT JOIN barber_services bs ON bs.barber_id = b.id
       GROUP BY b.id
       ORDER BY b.created_at DESC`
    );
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

export const createBarber = async (req, res, next) => {
  try {
    const { name, enabled, services = [] } = req.body;
    const { rows } = await query('INSERT INTO barbers(name, enabled) VALUES($1,$2) RETURNING *', [name, enabled ?? true]);
    const barber = rows[0];
    for (const serviceId of services) {
      await query('INSERT INTO barber_services(barber_id, service_id) VALUES($1,$2)', [barber.id, serviceId]);
    }
    return res.status(201).json(barber);
  } catch (error) {
    return next(error);
  }
};

export const updateBarber = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, enabled, services = [] } = req.body;
    const { rows } = await query(
      'UPDATE barbers SET name=$1, enabled=$2, updated_at=NOW() WHERE id=$3 RETURNING *',
      [name, enabled, id]
    );
    await query('DELETE FROM barber_services WHERE barber_id=$1', [id]);
    for (const serviceId of services) {
      await query('INSERT INTO barber_services(barber_id, service_id) VALUES($1,$2)', [id, serviceId]);
    }
    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
};

export const deleteBarber = async (req, res, next) => {
  try {
    await query('DELETE FROM barbers WHERE id=$1', [req.params.id]);
    return res.json({ message: 'Barbero eliminado' });
  } catch (error) {
    return next(error);
  }
};

export const setWorkingHours = async (req, res, next) => {
  try {
    const { barberId } = req.params;
    const { dayOfWeek, startTime, endTime } = req.body;
    const { rows } = await query(
      `INSERT INTO working_hours(barber_id, day_of_week, start_time, end_time)
       VALUES($1,$2,$3,$4)
       ON CONFLICT (barber_id, day_of_week) DO UPDATE
       SET start_time=EXCLUDED.start_time, end_time=EXCLUDED.end_time
       RETURNING *`,
      [barberId, dayOfWeek, startTime, endTime]
    );
    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
};
