const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { auth, authorize } = require('../middleware/auth');

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const contact = new Contact({ ...req.body, userId: req.body.userId || null });
    await contact.save();
    res.status(201).json({ message: 'Message sent successfully! We will get back to you soon.' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Get all contacts (Admin only)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const contacts = await Contact.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Update contact status
router.patch('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json(contact);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;
