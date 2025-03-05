const express = require('express');
const cors = require('cors'); // Make sure this line is after requiring express

const app = express(); // Ensure this line comes before using app

// Middleware
app.use(cors());
app.use(express.json()); // If you're handling JSON requests

// Sample Route
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
