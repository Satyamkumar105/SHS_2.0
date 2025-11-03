const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
const { auth } = require('../middleware/auth');

// Get all materials
router.get('/', async (req, res) => {
  try {
    const { branch, semester, subject, type } = req.query;
    let filter = { isApproved: true };
    if (branch) filter.branch = branch;
    if (semester) filter.semester = semester;
    if (subject) filter.subject = subject;
    if (type) filter.type = type;
    const materials = await Material.find(filter).populate('uploadedBy', 'name').sort({ createdAt: -1 });
    res.json(materials);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Upload material
router.post('/', auth, async (req, res) => {
  try {
    const material = new Material({ ...req.body, uploadedBy: req.user._id, isApproved: req.user.role === 'faculty' || req.user.role === 'admin' });
    await material.save();
    await material.populate('uploadedBy', 'name');
    res.status(201).json(material);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/:id/download', async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } }, { new: true });
    if (!material) return res.status(404).json({ error: 'Material not found' });
    res.json(material);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;
