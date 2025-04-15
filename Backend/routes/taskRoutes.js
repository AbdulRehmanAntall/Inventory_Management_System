const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');
const supplierController = require('../controllers/supplierController');


//user Routes
router.get('/users', userController.getAllUsers);
router.post('/login', userController.authenticateUser);
router.post('/insert-user', userController.insertNewUser);
router.post('/getUserDetailsByName', userController.getUserDetailsByName);
router.post('/Update-User-Password', userController.updateUserPassword);
router.post('/Delete-User', userController.deleteUserAccount);

//category routes
router.post('/insert-category', categoryController.insertNewCategory);

//supplierRoutes
router.post('/insert-new-supplier', supplierController.insertNewSupplier);
router.get('/get-all-supplier', supplierController.getAllSuppliers);
router.post('/get-supplier-By-Id', supplierController.getSupplierById);
router.post('/get-supplier-By-Name', supplierController.getSupplierByName);
router.post('/delete-Supplier', supplierController.deleteSupplier);
router.post('/get-supplier-By-Products', supplierController.getSuppliersByProduct);




module.exports = router;
