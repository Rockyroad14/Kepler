// Dependecies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('./datamodels/user');
const multer = require('multer');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const { cwd } = require('process');
const upload = multer({ dest: 'jobs/' });
require('dotenv').config();

// Initial variables
const app = express();
const port = process.env.PORT;
const host = process.env.HOST;
const mongoURI = process.env.URI;
const saltRounds = parseInt(process.env.SALTROUNDS, 10);

// Middleware for CORS and JSON
app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/../frontend_kepler/dist')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/..frontend_kepler/dist', 'index.html'));
});



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
function generateJobScript(jobName, nodes, cpusPerTask, memory, maxTime, scriptName/*, containerImage*/) {
    const script = `-H -N${nodes} -n${cpusPerTask} --mem-per-cpu=${memory}M -t${maxTime} --qos=test -J ${jobName} ${scriptName}.sh`;

    console.log(script)
    // TODO
    // Modify or create a script to run the docker file

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

//upgrade user priveleges to admin
app.put('/api/users/usertype', async (req, res) => {
    const userToUpdate = req.body;

    try {
        const user = await User.findOne({ email: userToUpdate.email});

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }


        user.userType = 1;
        await user.save();
        
        res.status(200).json({ message: 'User type updated successfully', user });
    } catch (error) {
        console.error('Error updating user type', error);
        res.status(500).json({ error: 'Error updating user type' });
    }
});

//gets list of current users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users', error);
        res.status(500).json({ error: 'Error getting users' });
    }
});

//delete user given an email
app.delete('/api/users', async (req, res) => {
    const userToDelete  = req.body;

    try {
        const userEmail = { email: userToDelete.email };
        const user = await User.findOneAndDelete( userEmail );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
});

// Endpoint to start a SLURM job based on an uploaded container
app.post('/submit-job',/* upload.single('container')*/(req, res) => {
    // Get the request body
    const job = req.body;

    // Verify a file has been uploaded
   // const containerFile = req.file;
    //if (!containerFile) {
        //return res.status(400).send('No container file uploaded.');
   // }

    
    // Create the job script
    const jobScript = generateJobScript(job.jobName, job.nodes, job.cpusPerTask, job.memory, job.maxTime,job.scriptName/*, containerFile.destination*/); 

    const options = {
        cwd: '/home/kepler/Kepler/backend_kepler/' // Replace with the desired working directory
    };

    // Run the command on a new thread
    const submittedJob = spawn('sudo',['sbatch',jobScript],options);

    submittedJob.stdout.on('data', (data) => {
        res.send(`Status: ${data}`);
    });
    // Error handling
    submittedJob.on('exit', (code) => {
        if (code != 0) {
            res.status(500).send(`Failed to submit job code ${code}`);
        } 
    });
});

// Endpoint to cancel a SLURM job
app.post('/stop-job', (req, res) => {
    const jobID = req.body.jobID;
    
    // Execute SLURM command to stop the job
    const stopJobProcess =  spawn('sudo', ['scancel', jobID]);

    // Error handling
    stopJobProcess.on('exit', (code) => {
        if (code === 0) {
            res.send(`Job ${jobID} stopped successfully`);
        } else {
            res.status(500).send(`Failed to stop job ${jobID} ${code}`);
        }
    });
});

// Endpoint to check the status of a SLURM job
app.post('/check-job', (req, res) => {
    const jobID = req.body.jobID;

    // Execute SLURM command to check job status
    const checkJobProcess = spawn('sudo', ['squeue','--job', jobID, '--format=%T']);

    // Monitor the output and send back the response
    checkJobProcess.stdout.on('data', (data) => {
        res.send(`Job ${jobID} status: ${data}`);
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
