// Dependecies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('./datamodels/user');
const Job = require('./datamodels/program');
const bodyParser = require('body-parser');
const multer = require('multer');
const { spawn } = require('child_process');
const fs = require('fs');
require('dotenv').config();

// Initial variables
const app = express();
const port = process.env.PORT;
const mongoURI = process.env.URI;
const saltRounds = parseInt(process.env.SALTROUNDS, 10);

// Middleware for CORS and JSON
app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(bodyParser.json());
const upload = multer();

app.use(express.static(path.join(__dirname, '/../frontend_kepler/dist')));


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

const getUserType = async (userId) => {
    try {
        const user = await User.findOne({ _id: userId });
        return user.userType;
    } catch (error) {
        throw new Error('Error getting user type');
    }
}

const isJobAuthor = async (userId, jobId) => {
}

// Endpoints

// Check to see if request body is JSON web token or has email and password
app.post('/api/login', async (req, res) => {

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

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

// Token Login Function
app.post('/api/tokenlogin', async (req, res) => {
    const { token } = req.body;
    try {
        const secretKey = process.env.JWT_SECRET;
        // Verify the token: Note: jwt.verify does check to see if the token is expired
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.userId;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        res.status(200).json({ message: 'Token validated successfully' });
    } catch (error) {

        if(error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token expired' });
        }

        res.status(401).json({ message: 'Internal Server Error' });
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

// Change user password
app.put('/api/users/password', async (req, res) => {
    const { password } = req.body;
    const token = req.headers.authorization.split(' ')[1]; // Assuming 'Bearer <token>' format

    if (!token || !password) {
        return res.status(400).json({ message: 'Token and password are required.' });
    }

    let _id;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        _id = decodedToken.userId;
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.findByIdAndUpdate(_id, { password: hashedPassword }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ message: 'Password updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the password.' });
    }
});

// Upgrade user priveleges to admin
app.put('/api/users/usertypeUpgrade', async (req, res) => {
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

// Gets list of current users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users', error);
        res.status(500).json({ error: 'Error getting users' });
    }
});

//checks token and returns current user type
app.post('/api/verifyAdminToken', async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token.' });
        }

        // Fetch the user from your database
        // This is just a placeholder, replace it with your actual database query
        const user = await User.findOne({ _id: decodedToken.userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ userType: user.userType });
    });
});


app.post('/api/users/loadtables' , async (req, res) => {
    // Get the token from the request header under authorization
    const body = req.body;
    const token = body.token;

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        let stagedJobs, completedJobs, activeJobsWithOwnership;

        const activeJobs = await Job.find({ stateCode: 'active'});

        // Check to see if user is an admin or super admin
        if(getUserType(userId) === 0  || getUserType(userId) === 1){
        
            // Get all jobs from the database and return them in the response
            stagedJobs = await Job.find({ stateCode: 'staged' });
            completedJobs = await Job.find({ stateCode: 'completed'});
            // Add a field to each job to indicate the user is the author since they are an admin
            activeJobsWithOwnership = activeJobs.map(job => ({...job._doc, isAuthor: true}));
        }
        else{
            // Get all jobs from the database and return them in the response
            stagedJobs = await Job.find({author: userId, stateCode: 'staged'});
            completedJobs = await Job.find({author: userId, stateCode: 'completed'});
            activeJobsWithOwnership = activeJobs.map(job => ({
                ...job._doc,
                isAuthor: String(job.author) === userId
            }));
        }

        res.status(200).json({stagedJobs, activeJobs: activeJobsWithOwnership, completedJobs});
    }
    catch (error) {

        console.error('Error getting jobs', error);

        if(error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token expired' });
        }
        
        res.status(500).json({ error: 'Error getting jobs' });
    }
});

// returns state code of 200 if the user is an admin or super admin
app.get('/api/users/usertype' , async (req, res) => {
    const token = req.headers['kepler-token'];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const userType = await getUserType(userId);

        if(userType === 0 || userType === 1){
            res.status(200).send({message:'Admin'});
        }
        else{
            res.status(401).send( {message: 'Not an Admin'} );
        }
    }
    catch (error) {
        if(error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token expired' });
        }
        console.error('Error getting user type', error);
        res.status(500).json({ error: 'Error getting user type' });
    }
});

app.post('/api/users/stagejob', upload.single('file'), async (req, res) => {
  
    try {
        const token = req.headers['kepler-token'];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Check to see if jobName is unique and return an error if it is not
        const { jobName, cpus, memory, maxTime } = req.body;

        const existingJob = await Job.findOne({ jobName });

        if (existingJob) {
            return res.status(400).json({ error: 'Job with this name already exists' });
        }
        // Console print statements for debugging
        console.log(cpus, memory, maxTime, jobName, userId);

        // With request body, create a new job and save it to the database and save the container file in the jobs folder with jobName
        const newJob = new Job({ jobName, author: userId, stateCode: 'staged', cpus, memory, maxTime });

        await newJob.save();

        // Save the container file in the jobs folder with another folder with the jobName and a folder in that named ouput
        // This is where the output will be stored
        const container = req.file;
        const containerPath = path.join(__dirname, '/jobs', jobName);
        const outputPath = path.join(containerPath, '/output');
        fs.mkdirSync(containerPath, { recursive: true });
        fs.mkdirSync(outputPath , { recursive: true });
        fs.writeFileSync(path.join(containerPath, container.originalname), container.buffer);

        res.status(201).json({ message: 'Job staged successfully' });

    } catch (error) {

        if(error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token expired' });
        }

        console.error('Error staging job', error);
        res.status(500).json({ error: 'Error staging job' });
    }

});

// Delete user given an email
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
app.post('/submit-job',(req, res) => {
    // Get the request body
    const job = req.body;

    // Run the command on a new thread
    const submittedJob = spawn('sudo', ['sbatch','-N'+job.nodes,'-n'+job.cpusPerTask,'--mem-per-cpu='+job.memory+'M','-t'+job.maxTime,'--output=/home/kepler/Kepler/backend_kepler/job_output/','--job-name='+job.jobName,'--qos=test','/home/kepler/Kepler/backend_kepler/build_container.sh',job.container]);

    // Listen for stdout data
    submittedJob.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    // Listen for stderr data
    submittedJob.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    // Listen for process exit
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

app.use((req, res, next) => {
    const validPaths = ['/', '/dashboard']; // add your valid paths here
    if (!validPaths.includes(req.path)) {
        return res.redirect('/');
    }
    next();
});

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/../frontend_kepler/dist', 'index.html'));
});

// Runs on localhost by default, for remote testing change to port, host,
app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
