import dayjs from 'dayjs';
import { query } from '../config/db.js';

const notify = async (appointmentId, type, message) => {
  await query('INSERT INTO notifications(appointment_id, type, message) VALUES($1,$2,$3)', [appointmentId, type, message]);
};

const hasOverlap = async (barberId, startAt, endAt, excludeId = null) => {
  const params = [barberId, startAt, endAt];
  let sql = `SELECT id FROM appointments
             WHERE barber_id = $1 AND status <> 'cancelada'
             AND tstzrange(start_at, end_at, '[)') && tstzrange($2::timestamptz, $3::timestamptz, '[)')`;
  if (excludeId) {
    params.push(excludeId);
    sql += ` AND id <> $4`;
  }
  const { rowCount } = await query(sql, params);
  return rowCount > 0;
};

export const listAppointments = async (req, res, next) => {
  try {
    const { barberId, from, to } = req.query;
    const params = [from || dayjs().startOf('week').toISOString(), to || dayjs().endOf('week').toISOString()];
    let sql = `SELECT a.*, c.name AS client_name, c.phone AS client_phone, s.name AS service_name, b.name AS barber_name
               FROM appointments a
               JOIN clients c ON c.id = a.client_id
               JOIN services s ON s.id = a.service_id
               JOIN barbers b ON b.id = a.barber_id
               WHERE a.start_at BETWEEN $1 AND $2`;
    if (barberId) {
      params.push(barberId);
      sql += ` AND a.barber_id = $3`;
    }
    sql += ' ORDER BY a.start_at';
    const { rows } = await query(sql, params);
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

export const createAppointment = async (req, res, next) => {
  try {
    const { clientId, barberId, serviceId, startAt } = req.body;
    const service = (await query('SELECT duration FROM services WHERE id=$1 AND enabled=true', [serviceId])).rows[0];
    if (!service) return res.status(400).json({ message: 'Servicio no disponible' });

    const start = dayjs(startAt);
    const end = start.add(service.duration, 'minute');

    const day = start.day();
    const hours = (await query('SELECT * FROM working_hours WHERE barber_id=$1 AND day_of_week=$2', [barberId, day])).rows[0];
    if (!hours) return res.status(400).json({ message: 'El barbero no trabaja en ese horario' });

    const startTime = start.format('HH:mm:ss');
    const endTime = end.format('HH:mm:ss');
    if (startTime < hours.start_time || endTime > hours.end_time) {
      return res.status(400).json({ message: 'Fuera del horario laboral del barbero' });
    }

    if (await hasOverlap(barberId, start.toISOString(), end.toISOString())) {
      return res.status(409).json({ message: 'Horario ocupado, evita doble reserva' });
    }

    const { rows } = await query(
      `INSERT INTO appointments(client_id, barber_id, service_id, start_at, end_at, status)
       VALUES($1,$2,$3,$4,$5,'confirmada') RETURNING *`,
      [clientId, barberId, serviceId, start.toISOString(), end.toISOString()]
    );

    await notify(rows[0].id, 'confirmacion', 'Tu cita fue confirmada correctamente.');
    return res.status(201).json(rows[0]);
  } catch (error) {
    return next(error);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { startAt, status } = req.body;
    const appointment = (await query('SELECT * FROM appointments WHERE id=$1', [id])).rows[0];
    if (!appointment) return res.status(404).json({ message: 'Cita no encontrada' });

    let start = dayjs(appointment.start_at);
    let end = dayjs(appointment.end_at);

    if (startAt) {
      const duration = end.diff(start, 'minute');
      start = dayjs(startAt);
      end = start.add(duration, 'minute');
      if (await hasOverlap(appointment.barber_id, start.toISOString(), end.toISOString(), id)) {
        return res.status(409).json({ message: 'No se puede reagendar: horario ocupado' });
      }
    }

    const { rows } = await query(
      `UPDATE appointments
       SET start_at=$1, end_at=$2, status=$3, updated_at=NOW()
       WHERE id=$4 RETURNING *`,
      [start.toISOString(), end.toISOString(), status || appointment.status, id]
    );

    if (status === 'cancelada') await notify(id, 'cancelacion', 'Tu cita fue cancelada.');
    if (startAt) await notify(id, 'recordatorio', 'Tu cita fue reagendada.');
    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    await query('DELETE FROM appointments WHERE id=$1', [req.params.id]);
    return res.json({ message: 'Cita eliminada' });
  } catch (error) {
    return next(error);
  }
};

export const availableSlots = async (req, res, next) => {
  try {
    const { barberId, serviceId, date } = req.query;
    const service = (await query('SELECT duration FROM services WHERE id=$1', [serviceId])).rows[0];
    const dayOfWeek = dayjs(date).day();
    const working = (await query('SELECT * FROM working_hours WHERE barber_id=$1 AND day_of_week=$2', [barberId, dayOfWeek])).rows[0];

    if (!service || !working) return res.json([]);

    const startDay = dayjs(`${date}T${working.start_time}`);
    const endDay = dayjs(`${date}T${working.end_time}`);
    const { rows: apps } = await query(
      'SELECT start_at, end_at FROM appointments WHERE barber_id=$1 AND DATE(start_at) = $2::date AND status <> $3',
      [barberId, date, 'cancelada']
    );

    const slots = [];
    for (let cursor = startDay; ; cursor = cursor.add(15, 'minute')) {
      const slotEnd = cursor.add(service.duration, 'minute');
      if (slotEnd.isAfter(endDay)) break;
      const overlap = apps.some((a) => cursor.isBefore(dayjs(a.end_at)) && slotEnd.isAfter(dayjs(a.start_at)));
      if (!overlap) slots.push(cursor.toISOString());
    }
    return res.json(slots);
  } catch (error) {
    return next(error);
  }
};
