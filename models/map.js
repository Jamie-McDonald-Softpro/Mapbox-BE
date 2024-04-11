// models/task.js
const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
    polygonName: { type: String, required: true },
    polygonCoordinates: { type: Array }
});

const Map = mongoose.model('Map', mapSchema);

module.exports = Map;