const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name: String,
    email: String,
    promotedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Staff', staffSchema);
