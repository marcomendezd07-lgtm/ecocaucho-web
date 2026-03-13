import dayjs from 'dayjs';
import { query } from '../config/db.js';

export const getDashboard = async (req, res, next) => {
  try {
    const todayStart = dayjs().startOf('day').toISOString();
    const todayEnd = dayjs().endOf('day').toISOString();
    const weekStart = dayjs().startOf('week').toISOString();
    const weekEnd = dayjs().endOf('week').toISOString();

    const [today, clients, revenue, services, upcoming] = await Promise.all([
      query('SELECT COUNT(*)::int AS total FROM appointments WHERE start_at BETWEEN $1 AND $2', [todayStart, todayEnd]),
      query('SELECT COUNT(*)::int AS total FROM clients'),
      query(
        `SELECT COALESCE(SUM(s.price),0)::numeric(10,2) AS total
         FROM appointments a JOIN services s ON s.id = a.service_id
         WHERE a.status='completada' AND a.start_at BETWEEN $1 AND $2`,
        [weekStart, weekEnd]
      ),
      query(
        `SELECT s.name, COUNT(*)::int AS total
         FROM appointments a JOIN services s ON s.id = a.service_id
         GROUP BY s.name ORDER BY total DESC LIMIT 5`
      ),
      query(
        `SELECT a.id, a.start_at, c.name AS cliente, b.name AS barbero, s.name AS servicio
         FROM appointments a
         JOIN clients c ON c.id = a.client_id
         JOIN barbers b ON b.id = a.barber_id
         JOIN services s ON s.id = a.service_id
         WHERE a.start_at > NOW() AND a.status='confirmada'
         ORDER BY a.start_at LIMIT 8`
      )
    ]);

    return res.json({
      citasHoy: today.rows[0].total,
      totalClientes: clients.rows[0].total,
      ingresosSemanales: revenue.rows[0].total,
      serviciosPopulares: services.rows,
      proximasCitas: upcoming.rows
    });
  } catch (error) {
    return next(error);
  }
};
