const express = require('express');
const multer = require('multer')
const sharp = require('sharp')
const Appartment = require('../models/appartment');
const router = new express.Router()
const adminAuth = require('../middlewares/adminAuth')

router.post('/appartments', adminAuth, async (req, res) => {
    const appartment = new Appartment({ ...req.body, addedBy: req.user._id });
    try {
        await appartment.save();
        res.status(201).send(appartment);
    } catch (e) {
        console.log(e)
        res.status(401).send('Unable to save');
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/appartments/:id/thumbnail', adminAuth, upload.single('thumbnail'), async (req, res) => {
    const appartment = await Appartment.findById(req.params.id);
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    appartment.thumbnail = buffer
    await appartment.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.patch('/appartments/:id', adminAuth, async (req, res) => {
    const updates = Object.keys(req.body)
    const appartment = await Appartment.findById(req.params.id);
    const allowedUpdates = ['title', 'price', 'numberOfBathRooms', 'numberOfBedRooms', 'location']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => appartment[update] = req.body[update])
        await appartment.save()
        res.send(appartment)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/appartments/:id', adminAuth, async (req, res) => {
    const appartment = await Appartment.findById(req.params.id);
    try {
        await appartment.remove()
        res.send(appartment)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/appartments', async (req, res) => {
    try {
        const appartment = await Appartment.find({});
        res.send(appartment);
    } catch (e) {
        res.status(404).send();
    }
})

router.get('/appartments/:id', async (req, res) => {
    try {
        const appartment = await Appartment.findById(req.params.id);
        res.send(appartment);
    } catch (error) {
        console.log(error)
        res.status(404).send();
    }
})

router.get('/appartments/:id/thumbnail', async (req, res) => {
    try {
        const appartment = await Appartment.findById(req.params.id);

        if (!appartment || !appartment.thumbnail) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(appartment.thumbnail)
    } catch (e) {
        res.status(404).send()
    }
})


module.exports = router;