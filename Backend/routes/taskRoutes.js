const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to get all users
router.get('/users', userController.getAllUsers); // This will now hit the getAllUsers function
router.post('/login', userController.authenticateUser);

module.exports = router;
