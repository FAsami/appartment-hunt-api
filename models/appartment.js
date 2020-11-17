const mongoose = require('mongoose');

appartmentSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    location: {
        type: String,
        trim: true,
        required: true,
    },
    numberOfBedRooms: {
        type: Number,
        trim: true,
        required: true,
    },
    price: {
        type: Number,
        trim: true,
        required: true
    },
    numberOfBathRooms: {
        type: Number,
        trim: true,
        required: true,
    },
    thumbnail: {
        type: Buffer
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Appartment = mongoose.model('Appartment', appartmentSchema);
module.exports = Appartment