const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { auth, authorize } = require('../middleware/auth');

// Get all notices
router.get('/', async (req, res) => {
  try {
    const { branch, category } = req.query;
    let filter = { isActive: true };
    if (branch && branch !== 'All') filter.$or = [{ branch: 'All' }, { branch }];
    if (category) filter.category = category;
    const notices = await Notice.find(filter).populate('postedBy', 'name role').sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create, Update, Delete routes require faculty/admin - left as in guide
router.post('/', auth, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const notice = new Notice({ ...req.body, postedBy: req.user._id });
    await notice.save();
    await notice.populate('postedBy', 'name role');
    res.status(201).json(notice);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/:id', auth, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('postedBy', 'name role');
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    res.json(notice);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/:id', auth, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;
