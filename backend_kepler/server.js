//server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('./datamodels/user');
const Program = require('./datamodels/program');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT;
const mongoURI = process.env.URI;
const saltRounds = parseInt(process.env.SALTROUNDS, 10);


//Connecting to Database using Mongoose
// Reminder to change the uri to internal databse on head node
mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Mongo connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB!');
});


//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


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

// Routes


// Login Function
// Needs to handle Salting and Hashing the password.
// Implemented Successfully on 2/1/2024 by Jared Reich
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

// Creating the User by Admin or Super Admin.
// Salting and Hashing for added security

// Sucesssfully Implemented 2/1/2024 by Jared Reich
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




// Add more routes, Example above

app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
});