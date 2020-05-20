
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: 'string', required: true },
    password: { type: 'string', required: true },
    name: { type: 'string', required: true }
})

module.exports = mongoose.model('User', UserSchema);