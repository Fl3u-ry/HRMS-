const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const employees = await Employee.getAll();
    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.getById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const employeeId = await Employee.create(req.body);
    const employee = await Employee.getById(employeeId);
    res.status(201).json(employee);
  } catch (error) {
    console.error('Create employee error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const result = await Employee.update(req.params.id, req.body);
    if (result === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    const employee = await Employee.getById(req.params.id);
    res.json(employee);
  } catch (error) {
    console.error('Update employee error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Employee.delete(req.params.id);
    if (result === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/department/:departmentId', async (req, res) => {
  try {
    const employees = await Employee.getByDepartment(req.params.departmentId);
    res.json(employees);
  } catch (error) {
    console.error('Get employees by department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
