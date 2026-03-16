const db = require('../config/db');

class Employee {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT e.*, d.department_name, p.position_name 
      FROM employees e 
      LEFT JOIN departments d ON e.department_id = d.department_id 
      LEFT JOIN positions p ON e.position_id = p.position_id
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(`
      SELECT e.*, d.department_name, p.position_name 
      FROM employees e 
      LEFT JOIN departments d ON e.department_id = d.department_id 
      LEFT JOIN positions p ON e.position_id = p.position_id
      WHERE e.employee_id = ?
    `, [id]);
    return rows[0];
  }

  static async create(employeeData) {
    const { first_name, last_name, date_of_birth, gender, phone, email, address, hire_date, salary, status, department_id, position_id } = employeeData;
    
    const [result] = await db.query(`
      INSERT INTO employees (first_name, last_name, date_of_birth, gender, phone, email, address, hire_date, salary, status, department_id, position_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [first_name, last_name, date_of_birth, gender, phone, email, address, hire_date, salary, status || 'Active', department_id, position_id]);
    
    return result.insertId;
  }

  static async update(id, employeeData) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(employeeData)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    values.push(id);
    
    const [result] = await db.query(`
      UPDATE employees SET ${fields.join(', ')} WHERE employee_id = ?
    `, values);
    
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM employees WHERE employee_id = ?', [id]);
    return result.affectedRows;
  }

  static async getByDepartment(departmentId) {
    const [rows] = await db.query(`
      SELECT e.*, d.department_name, p.position_name 
      FROM employees e 
      LEFT JOIN departments d ON e.department_id = d.department_id 
      LEFT JOIN positions p ON e.position_id = p.position_id
      WHERE e.department_id = ?
    `, [departmentId]);
    return rows;
  }
}

module.exports = Employee;
