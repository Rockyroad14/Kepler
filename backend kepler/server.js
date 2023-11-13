//server.js
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

//middleware
app.use(cors());
app.use(express.json());

//Routes

app.get('/api/data', (req, res) => {

    const data = { message: 'Hello from the server!'};
    res.json(data);
});

// Add more routes, Example above\

app.listen(port, () => {
    console.log('Server is running on http://localhost:${port}');
});