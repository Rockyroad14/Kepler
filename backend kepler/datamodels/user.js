const mongoose = require('mongoose');

// Need a way to reference teams
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: Number,
        required: true,
    }
});

// Need a way to reference Users
const teamSchema = new mongoose.Schema({
    name: String,
    members: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});



const User = mongoose.model('User', userSchema);
const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
module.exports = User;
