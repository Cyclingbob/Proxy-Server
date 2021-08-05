const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    _id: String,
    type: String,
    domain: String,
    time: Number,
    ip: String,
    path: String,
    country: String,
});

module.exports = mongoose.model("logs", logSchema);
