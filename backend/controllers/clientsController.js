import { query } from '../config/db.js';

export const listClients = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const { rows } = await query(
      `SELECT c.*, COUNT(a.id)::int AS visitas
       FROM clients c
       LEFT JOIN appointments a ON a.client_id = c.id
       WHERE c.name ILIKE $1 OR c.phone ILIKE $1
       GROUP BY c.id
       ORDER BY c.created_at DESC`,
      [`%${search}%`]
    );
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

export const createClient = async (req, res, next) => {
  try {
    const { name, phone, notes } = req.body;
    const { rows } = await query(
      'INSERT INTO clients(name, phone, notes) VALUES($1, $2, $3) RETURNING *',
      [name, phone, notes || null]
    );
    return res.status(201).json(rows[0]);
  } catch (error) {
    return next(error);
  }
};

export const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, notes } = req.body;
    const { rows } = await query(
      'UPDATE clients SET name=$1, phone=$2, notes=$3, updated_at=NOW() WHERE id=$4 RETURNING *',
      [name, phone, notes || null, id]
    );
    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
};

export const deleteClient = async (req, res, next) => {
  try {
    await query('DELETE FROM clients WHERE id=$1', [req.params.id]);
    return res.json({ message: 'Cliente eliminado' });
  } catch (error) {
    return next(error);
  }
};

export const clientHistory = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT a.*, s.name AS servicio, b.name AS barbero
       FROM appointments a
       JOIN services s ON s.id = a.service_id
       JOIN barbers b ON b.id = a.barber_id
       WHERE a.client_id = $1
       ORDER BY a.start_at DESC`,
      [req.params.id]
    );
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};
