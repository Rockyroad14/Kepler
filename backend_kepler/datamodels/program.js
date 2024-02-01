const mongoose = require('mongoose');


// Program Schema with associated data needed.
const programSchema = new mongoose.Schema({

    programName: { type: String, required: true, unique: true, },
    
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    fileName: { type: String, required: true, },

    filePath: { type: String, required: true, },

    stateCode: { type: Number, required: true, },

})


const Program = mongoose.model('Program', programSchema);

module.exports = Program;