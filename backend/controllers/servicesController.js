import { query } from '../config/db.js';

export const listServices = async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM services ORDER BY created_at DESC');
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const { name, duration, price, enabled } = req.body;
    const { rows } = await query(
      'INSERT INTO services(name, duration, price, enabled) VALUES($1,$2,$3,$4) RETURNING *',
      [name, duration, price, enabled ?? true]
    );
    return res.status(201).json(rows[0]);
  } catch (error) {
    return next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, duration, price, enabled } = req.body;
    const { rows } = await query(
      'UPDATE services SET name=$1, duration=$2, price=$3, enabled=$4, updated_at=NOW() WHERE id=$5 RETURNING *',
      [name, duration, price, enabled, id]
    );
    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    await query('DELETE FROM services WHERE id=$1', [req.params.id]);
    return res.json({ message: 'Servicio eliminado' });
  } catch (error) {
    return next(error);
  }
};
