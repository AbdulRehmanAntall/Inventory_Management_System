const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to get all users
router.get('/users', userController.getAllUsers);
router.post('/login', userController.authenticateUser);
router.post('/insert-user', userController.insertNewUser);
router.post('/getUserDetailsByName', userController.getUserDetailsByName);
router.post('/Update-User-Password', userController.updateUserPassword);
router.post('/Delete-User', userController.deleteUserAccount);


module.exports = router;
