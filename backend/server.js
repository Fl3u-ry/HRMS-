require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const initDatabase = require('./config/schema');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const departmentRoutes = require('./routes/departments');
const positionRoutes = require('./routes/positions');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'St. Luke HR System API is running' });
});

async function checkDatabaseConnection() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306
  };

  let connection;
  try {
    console.log('\n========================================');
    console.log('  St. Luke Hospital HR Management System');
    console.log('========================================\n');
    
    console.log('🔄 Connecting to MySQL...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected successfully!');
    
    const dbName = process.env.DB_NAME || 'st_luke_hr';
    console.log(`🔄 Checking if database "${dbName}" exists...`);
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✅ Database "${dbName}" ready!`);
    
    await connection.query(`USE ${dbName}`);
    
    console.log('🔄 Checking if tables exist...');
    const tables = ['departments', 'positions', 'employees', 'user_accounts'];
    const missingTables = [];
    
    for (const table of tables) {
      const [rows] = await connection.query(
        `SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = ?`,
        [dbName, table]
      );
      if (rows[0].count === 0) {
        missingTables.push(table);
      }
    }
    
    if (missingTables.length > 0) {
      console.log(`⚠️  Missing tables: ${missingTables.join(', ')}`);
      console.log('🔄 Creating tables and seeding data...');
      await initDatabase();
      console.log('✅ Tables created and seeded successfully!');
    } else {
      console.log('✅ All tables exist!');
    }
    
    await connection.end();
    return true;
  } catch (error) {
    console.error('\n❌ Database connection failed!');
    console.error('   Error:', error.message);
    if (connection) {
      await connection.end();
    }
    return false;
  }
}

async function seedAdminUser() {
  const db = require('./config/db');
  try {
    const [rows] = await db.query('SELECT user_id FROM user_accounts WHERE username = ?', ['admin']);
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.query(
        'INSERT INTO user_accounts (username, password_hash, role) VALUES (?, ?, ?)',
        ['admin', hashedPassword, 'Admin']
      );
      console.log('✅ Admin user created: admin / admin123');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error seeding admin user:', error.message);
  }
}

async function startServer() {
  const dbConnected = await checkDatabaseConnection();
  
  if (!dbConnected) {
    console.error('\n❌ Failed to start server due to database issues.');
    process.exit(1);
  }
  
  await seedAdminUser();
  
  app.listen(PORT, () => {
    console.log('========================================');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('========================================\n');
  });
}

startServer();
