const db = require('../config/db');
const bcrypt = require('bcryptjs');

class UserAccount {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT u.*, e.first_name, e.last_name, e.email as employee_email
      FROM user_accounts u
      LEFT JOIN employees e ON u.employee_id = e.employee_id
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(`
      SELECT u.*, e.first_name, e.last_name, e.email as employee_email
      FROM user_accounts u
      LEFT JOIN employees e ON u.employee_id = e.employee_id
      WHERE u.user_id = ?
    `, [id]);
    return rows[0];
  }

  static async getByUsername(username) {
    const [rows] = await db.query(`
      SELECT u.*, e.first_name, e.last_name
      FROM user_accounts u
      LEFT JOIN employees e ON u.employee_id = e.employee_id
      WHERE u.username = ?
    `, [username]);
    return rows[0];
  }

  static async create(userData) {
    const { username, password, role, employee_id } = userData;
    const password_hash = await bcrypt.hash(password, 10);
    
    const [result] = await db.query(`
      INSERT INTO user_accounts (username, password_hash, role, employee_id)
      VALUES (?, ?, ?, ?)
    `, [username, password_hash, role || 'Staff', employee_id]);
    
    return result.insertId;
  }

  static async update(id, userData) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(userData)) {
      if (key === 'password') {
        fields.push('password_hash = ?');
        values.push(await bcrypt.hash(value, 10));
      } else if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    values.push(id);
    
    const [result] = await db.query(`
      UPDATE user_accounts SET ${fields.join(', ')} WHERE user_id = ?
    `, values);
    
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM user_accounts WHERE user_id = ?', [id]);
    return result.affectedRows;
  }

  static async verifyPassword(plainPassword, hash) {
    return await bcrypt.compare(plainPassword, hash);
  }

  static async updateLastLogin(id) {
    await db.query('UPDATE user_accounts SET last_login = NOW() WHERE user_id = ?', [id]);
  }
}

module.exports = UserAccount;
