const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');

// Route to get all users
router.get('/users', userController.getAllUsers); // This will now hit the getAllUsers function
router.post('/login', userController.authenticateUser);
router.post('/insert-user', userController.insertNewUser);
router.post('/getUserDetailsByName', userController.getUserDetailsByName);
router.post('/insert-category', categoryController.insertNewCategory);
module.exports = router;
