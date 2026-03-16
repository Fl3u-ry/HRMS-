const db = require('../config/db');

class Department {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT d.*, e.first_name as head_first_name, e.last_name as head_last_name
      FROM departments d
      LEFT JOIN employees e ON d.head_of_department = e.employee_id
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(`
      SELECT d.*, e.first_name as head_first_name, e.last_name as head_last_name
      FROM departments d
      LEFT JOIN employees e ON d.head_of_department = e.employee_id
      WHERE d.department_id = ?
    `, [id]);
    return rows[0];
  }

  static async create(departmentData) {
    const { department_name, head_of_department } = departmentData;
    
    const [result] = await db.query(`
      INSERT INTO departments (department_name, head_of_department)
      VALUES (?, ?)
    `, [department_name, head_of_department]);
    
    return result.insertId;
  }

  static async update(id, departmentData) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(departmentData)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    values.push(id);
    
    const [result] = await db.query(`
      UPDATE departments SET ${fields.join(', ')} WHERE department_id = ?
    `, values);
    
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM departments WHERE department_id = ?', [id]);
    return result.affectedRows;
  }

  static async getEmployeeCount() {
    const [rows] = await db.query(`
      SELECT department_id, COUNT(*) as count 
      FROM employees 
      GROUP BY department_id
    `);
    return rows;
  }
}

module.exports = Department;
