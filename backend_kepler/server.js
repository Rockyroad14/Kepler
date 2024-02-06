// Dependecies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./datamodels/user');
const multer = require('multer');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const upload = multer({ dest: 'jobs/' });
require('dotenv').config();

// Initial variables
const app = express();
const port = process.env.PORT;
const host = process.env.HOST;
const mongoURI = process.env.URI;
const saltRounds = parseInt(process.env.SALTROUNDS, 10);

// Middleware for CORS and JSON
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Mongo database connection and error handler
mongoose.connect(mongoURI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo connection error:'));
db.once('open', () => {console.log('Connected to MongoDB!');});

// Generating a token to be stored on the client side if credentials are validated
const generateToken = (userId) => {
    try {
        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' })
        return token;
    } catch (error) {
        throw new Error('Error generating token');
    }
}

// Dynamically create job scripts based on the users needs
function generateJobScript(jobName, outputName, errorName, nodes, cpusPerTask, memory, maxTime, containerImage) {
    const script = `#!/bin/bash
#SBATCH --job-name=${jobName}
#SBATCH --output=${outputName}.txt
#SBATCH --error=${errorName}.txt
#SBATCH --nodes=${nodes}
#SBATCH --ntasks-per-node=1
#SBATCH --cpus-per-task=${cpusPerTask}
#SBATCH --mem=${memory}
#SBATCH --time=${maxTime}

# Load the Docker module
module load docker

# Run the Docker container
docker run --rm ${containerImage}`;

    return script;
}

// Endpoints

// Login Function TODO: handle Salting and Hashing the password. Implemented Successfully on 2/1/2024 by Jared Reich
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        console.log(email);
        console.log(password);

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password email not found'});
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password'});
        }
    
        const userId = user._id;
        const token = generateToken(userId);

        res.status(200).json({ token });

    } catch (error) {
        res.status(401).json({ message: 'Invalid credentials' });
    }

})

// Creating the User by Admin or Super Admin with Salting and Hashing for added security. Implemented Sucesssfully 2/1/2024 by Jared Reich
app.post('/api/createuser', async (req, res) => {
    const { name, email, password, userType } = req.body;
    
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({name, email, password: hashedPassword, userType});
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.error('Error creating user', error);
        res.status(500).json({ error: 'Error creating user' });
    }

});

// Endpoint to start a SLURM job based on an uploaded container
app.post('/submit-job', upload.single('container'),(req, res) => {
    // Get the request body
    const job = req.body;

    // Verify a file has been uploaded
    const containerFile = req.file;
    if (!containerFile) {
        return res.status(400).send('No container file uploaded.');
    }

    // Create the job script
    const jobScript = generateJobScript(job.jobName, job.outputName, job.errorName, job.nodes, job.cpusPerTask, job.memory, job.maxTime, containerFile.destination); 

    // Run the command on a new thread
    const submittedJob = spawn(jobScript);

    // Error handling
    submittedJob.on('exit', (code) => {
        if (code === 0) {
            res.send(`Job submitted successfully`);
        } else {
            res.status(500).send(`Failed to submit job`);
        }
    });
});

// Endpoint to cancel a SLURM job
app.post('/stop-job', (req, res) => {
    const jobID = req.body.jobID;
    
    // Execute SLURM command to stop the job
    const stopJobProcess =  spawn('scancel', [jobID]);

    // Monitor the commands output
    stopJobProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    // Error handling
    stopJobProcess.on('exit', (code) => {
        if (code === 0) {
            res.send(`Job ${jobID} stopped successfully`);
        } else {
            res.status(500).send(`Failed to stop job ${jobID}`);
        }
    });
});

// Endpoint to check the status of a SLURM job
app.post('/check-job', (req, res) => {
    const jobID = req.body.jobID;

    // Execute SLURM command to check job status
    const checkJobProcess = spawn('squeue', ['--job', jobID, '--format=%T']);

    // Monitor the output and send back the response
    checkJobProcess.stdout.on('data', (data) => {
        const status = data.toString().trim();
        res.send(`Job ${jobID} status: ${status}`);
    });

    // Handle error
    checkJobProcess.stderr.on('data', (data) => {
        res.status(500).send(`Error checking job ${jobID} status`);
    });
});

// Endpoint to send output data from a SLURM job
app.post('/job-output', (req, res) => {
    const jobID = req.body.jobID;

    // TODO: Once output type is determined this can be setup
    // Output will most likely be put in jobs folder
    // Grab the output based on the jobs outputName
    res.send(`Output data for job ${jobID}`);
});

// Runs on localhost by default, for remote testing change to port, host,
app.listen(port, () => {
    console.log('Server is running on port ' + port);
});