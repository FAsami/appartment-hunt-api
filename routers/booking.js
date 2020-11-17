const express = require('express');
const Booking = require('../models/booking');
const router = new express.Router()
const auth = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');
const mongoose = require('mongoose');
const User = require('../models/user');

router.post('/bookings', auth, async (req, res) => {
    const booking = new Booking({ ...req.body, createdBy: req.user._id });
    try {
        await booking.save();
        res.status(201).send(booking);
    } catch (e) {
        res.status(401).send('Unable to save');
    }
})

router.patch('/bookings/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const bookings = await Booking.findById(req.params.id);
    const allowedUpdates = ['name', 'email', 'phone', 'message']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => bookings[update] = req.body[update])
        await bookings.save()
        res.send(bookings)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/allBookings', adminAuth, async (req, res) => {
    try {
        const bookings = await Booking.find({});
        res.send(bookings);
    } catch (error) {
        res.status(400).send();
    }
});

router.get('/bookings', auth, async (req, res) => {
    const user = await User.findById(req.user._id)
    await user.populate('bookings').execPopulate();
    try {
        res.send(user.bookings)
    } catch (error) {
        console.log(error)
        res.status(400).send();
    }
})

router.delete('/bookings/:id', adminAuth, async (req, res) => {
    const bookings = await Booking.findById(req.params.id);
    try {
        await bookings.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router;