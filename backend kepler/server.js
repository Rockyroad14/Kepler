//server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3001;

//Connecting to Database
mongoose.connect('mongodb://10.171.25.37:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.2');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Mongo connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB!');
});

//middleware
app.use(cors());
app.use(express.json());

//Routes

app.get('/api/data', (req, res) => {

    const data = { message: 'Hello from the server!'};
    res.json(data);
});

app.get('/api/login', (req, res) => {

})

// Add more routes, Example above

app.listen(port, () => {
    console.log('Server is running on http://localhost:${port}');
});