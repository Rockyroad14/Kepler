//server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('./datamodels/user');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT;
const mongoURI = process.env.URI;


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
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {

        const user = await User.findOne({ email });
        console.log(email);
        console.log(password);

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password'});
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password'});
        }

    
        const userId = user.id;
        const token = generateToken(userId);

        res.status(200).json({ token });

    } catch (error) {
        res.status(401).json({ message: 'Invalid credentials' });
    }

})

// Creating the User by Admin or Super Admin.
// Salting and Hashing for added security
app.post('/api/createuser', async (req, res) => {
    const { name ,email, password } = req.body;
    
})


// Add more routes, Example above

app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
});