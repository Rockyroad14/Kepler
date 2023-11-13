const mongoose = require('mongoose');

// Need a way to reference teams
const userSchema = new mongoose.Schema({
    uid: Number,
    name: String,
    email: String,
    password: String,
});

// Need a way to reference Users
const teamSchema = new mongoose.Schema({
    tid: Number,
    name: String,
    members: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});


const programSchema = new mongoose.Schema({
    pid: Number,
    statecode: Number,
    members: {
        type
    }
})


const User = mongoose.model('User', userSchema);
const Team = mongoose.model('Team', teamSchema);
const Program = mongoose.model('Program', programSchema);

module.exports = Program;
module.exports = Team;
module.exports = User;
