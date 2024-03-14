const mongoose = require('mongoose');


// Program Schema with associated data needed.
const programSchema = new mongoose.Schema({

    jobName: { type: String, required: true, unique: true, },
    
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    container: { type: String, required: true, },

    stateCode: { type: Number, required: true, },

    nodes: { type: Number, required: true, },

    cpus: { type: Number, required: true, },

    memory: { type: Number, required: true, },

    maxTime: { type: Number, required: true, },
})


const Program = mongoose.model('Program', programSchema);

module.exports = Program;