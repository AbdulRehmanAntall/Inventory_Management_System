const express = require('express');
const router = express.Router();
const { testConnection } = require('../controllers/userController');

router.get('/test-db', testConnection);

module.exports = router;
