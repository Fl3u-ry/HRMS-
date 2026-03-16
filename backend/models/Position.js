const db = require('../config/db');

class Position {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM positions ORDER BY position_name');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM positions WHERE position_id = ?', [id]);
    return rows[0];
  }

  static async create(positionData) {
    const { position_name, description, salary_range } = positionData;
    
    const [result] = await db.query(`
      INSERT INTO positions (position_name, description, salary_range)
      VALUES (?, ?, ?)
    `, [position_name, description, salary_range]);
    
    return result.insertId;
  }

  static async update(id, positionData) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(positionData)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    values.push(id);
    
    const [result] = await db.query(`
      UPDATE positions SET ${fields.join(', ')} WHERE position_id = ?
    `, values);
    
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM positions WHERE position_id = ?', [id]);
    return result.affectedRows;
  }

  static async getEmployeeCount() {
    const [rows] = await db.query(`
      SELECT position_id, COUNT(*) as count 
      FROM employees 
      GROUP BY position_id
    `);
    return rows;
  }
}

module.exports = Position;
