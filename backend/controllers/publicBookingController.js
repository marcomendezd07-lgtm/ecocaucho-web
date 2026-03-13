import { query } from '../config/db.js';
import { createAppointment } from './appointmentsController.js';

export const metadata = async (req, res, next) => {
  try {
    const [services, barbers] = await Promise.all([
      query('SELECT * FROM services WHERE enabled=true ORDER BY name'),
      query('SELECT * FROM barbers WHERE enabled=true ORDER BY name')
    ]);
    return res.json({ services: services.rows, barbers: barbers.rows });
  } catch (error) {
    return next(error);
  }
};

export const bookPublic = async (req, res, next) => {
  try {
    const { clientName, phone, notes, ...rest } = req.body;
    const clientResult = await query(
      `INSERT INTO clients(name, phone, notes)
       VALUES($1,$2,$3)
       ON CONFLICT (phone) DO UPDATE SET name=EXCLUDED.name, notes=EXCLUDED.notes
       RETURNING *`,
      [clientName, phone, notes || null]
    );

    req.body.clientId = clientResult.rows[0].id;
    req.body = { ...rest, clientId: clientResult.rows[0].id };
    return createAppointment(req, res, next);
  } catch (error) {
    return next(error);
  }
};
