const mongoose = require('mongoose');


// Program Schema with associated data needed.
const JobSchema = new mongoose.Schema({

    jobName: { type: String, required: true, unique: true, },
    
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    containerName: { type: String, required: true, },

    stateCode: { type: String, required: true, },

    slurmCode: { type: String },

    cpus: { type: Number, required: true, },

    nodes: { type: Number, required: true, },

    memory: { type: Number, required: true, },

    maxTime: { type: String, required: true, },
})


const Job = mongoose.model('Job', JobSchema);

module.exports = Job;