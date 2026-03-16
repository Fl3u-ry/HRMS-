const express = require('express');
const router = express.Router();
const Position = require('../models/Position');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const positions = await Position.getAll();
    const counts = await Position.getEmployeeCount();
    
    const positionsWithCount = positions.map(p => {
      const count = counts.find(c => c.position_id === p.position_id);
      return { ...p, employee_count: count ? count.count : 0 };
    });
    
    res.json(positionsWithCount);
  } catch (error) {
    console.error('Get positions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const position = await Position.getById(req.params.id);
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }
    res.json(position);
  } catch (error) {
    console.error('Get position error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const positionId = await Position.create(req.body);
    const position = await Position.getById(positionId);
    res.status(201).json(position);
  } catch (error) {
    console.error('Create position error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const result = await Position.update(req.params.id, req.body);
    if (result === 0) {
      return res.status(404).json({ message: 'Position not found' });
    }
    const position = await Position.getById(req.params.id);
    res.json(position);
  } catch (error) {
    console.error('Update position error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Position.delete(req.params.id);
    if (result === 0) {
      return res.status(404).json({ message: 'Position not found' });
    }
    res.json({ message: 'Position deleted successfully' });
  } catch (error) {
    console.error('Delete position error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
