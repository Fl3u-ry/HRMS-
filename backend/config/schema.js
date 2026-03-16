const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'st_luke_hr',
  port: process.env.DB_PORT || 3306
};

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    port: dbConfig.port
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
  console.log('Database created or already exists');
  await connection.end();
}

async function createTables() {
  const connection = await mysql.createConnection(dbConfig);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS positions (
      position_id INT AUTO_INCREMENT PRIMARY KEY,
      position_name VARCHAR(100) NOT NULL,
      description TEXT,
      salary_range VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS departments (
      department_id INT AUTO_INCREMENT PRIMARY KEY,
      department_name VARCHAR(100) NOT NULL,
      head_of_department INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS employees (
      employee_id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      date_of_birth DATE NOT NULL,
      gender ENUM('Male', 'Female', 'Other') NOT NULL,
      phone VARCHAR(20),
      email VARCHAR(100) UNIQUE NOT NULL,
      address TEXT,
      hire_date DATE NOT NULL,
      salary DECIMAL(10, 2),
      status ENUM('Active', 'On Leave', 'Terminated') DEFAULT 'Active',
      department_id INT,
      position_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
      FOREIGN KEY (position_id) REFERENCES positions(position_id) ON DELETE SET NULL
    )
  `);

  await connection.query(`
    ALTER TABLE departments ADD CONSTRAINT fk_dept_head FOREIGN KEY (head_of_department) REFERENCES employees(employee_id) ON DELETE SET NULL
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS user_accounts (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('Admin', 'HR', 'Doctor', 'Nurse', 'Pharmacist', 'Staff') DEFAULT 'Staff',
      employee_id INT UNIQUE,
      last_login TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
    )
  `);

  console.log('Tables created');
  await connection.end();
}

async function initDatabase() {
  try {
    await createDatabase();
    await createTables();
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

module.exports = initDatabase;
