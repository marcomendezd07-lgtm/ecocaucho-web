import { query } from '../config/db.js';

export const findAll = async (table) => (await query(`SELECT * FROM ${table} ORDER BY id DESC`)).rows;

export const findById = async (table, id) =>
  (await query(`SELECT * FROM ${table} WHERE id = $1`, [id])).rows[0];

export const removeById = async (table, id) =>
  (await query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [id])).rows[0];
