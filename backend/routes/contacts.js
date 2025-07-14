const express = require('express');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const router = express.Router();
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.userId });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});
router.post('/', auth, async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const contact = new Contact({ user: req.userId, name, email, phone });
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});
router.put('/:id', auth, async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    let contact = await Contact.findOne({ _id: req.params.id, user: req.userId });
    if (!contact) return res.status(404).json({ msg: 'Contact not found' });
    contact.name = name;
    contact.email = email;
    contact.phone = phone;
    await contact.save();
    res.json(contact);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!contact) return res.status(404).json({ msg: 'Contact not found' });
    res.json({ msg: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});
router.get('/search/:query', auth, async (req, res) => {
  try {
    const regex = new RegExp(req.params.query, 'i');
    const contacts = await Contact.find({ user: req.userId, $or: [ { name: regex }, { email: regex }, { phone: regex } ] });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router; 