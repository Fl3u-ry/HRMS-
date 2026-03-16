const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const departments = await Department.getAll();
    const counts = await Department.getEmployeeCount();
    
    const departmentsWithCount = departments.map(d => {
      const count = counts.find(c => c.department_id === d.department_id);
      return { ...d, employee_count: count ? count.count : 0 };
    });
    
    res.json(departmentsWithCount);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const department = await Department.getById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const departmentId = await Department.create(req.body);
    const department = await Department.getById(departmentId);
    res.status(201).json(department);
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const result = await Department.update(req.params.id, req.body);
    if (result === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    const department = await Department.getById(req.params.id);
    res.json(department);
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Department.delete(req.params.id);
    if (result === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
