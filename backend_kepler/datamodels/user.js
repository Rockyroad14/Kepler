const mongoose = require('mongoose');

// User schema with associated data with references
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    
    email: { type: String, unique: true, required: true, unique: true,},
    
    password: { type: String, required: true },

    userType: { type: Number, required: true },

    program: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Program' }, ],
});

// Program Schema with associated data needed.


const User = mongoose.model('User', userSchema);

module.exports = User;
