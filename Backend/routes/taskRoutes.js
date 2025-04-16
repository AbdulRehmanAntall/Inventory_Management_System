const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');
const supplierController = require('../controllers/supplierController');
const customerController = require('../controllers/customerController');
const productController = require('../controllers/productController');


//user Routes
router.get('/users', userController.getAllUsers);
router.post('/login', userController.authenticateUser);
router.post('/insert-user', userController.insertNewUser);
router.post('/getUserDetailsByName', userController.getUserDetailsByName);
router.post('/Update-User-Password', userController.updateUserPassword);
router.post('/Delete-User', userController.deleteUserAccount);

//category routes
router.post('/insert-category', categoryController.insertNewCategory);
router.post('/delete-category', categoryController.deleteCategory);

//supplierRoutes
router.post('/insert-new-supplier', supplierController.insertNewSupplier);
router.get('/get-all-supplier', supplierController.getAllSuppliers);
router.post('/get-supplier-By-Id', supplierController.getSupplierById);
router.post('/get-supplier-By-Name', supplierController.getSupplierByName);
router.post('/delete-Supplier', supplierController.deleteSupplier);
router.post('/get-supplier-By-Products', supplierController.getSuppliersByProduct);

//customer Routes
router.post('/insert-customer', customerController.insertCustomer);
router.post('/delete-customer', customerController.deleteCustomer);
router.get('/show-all-customers', customerController.showAllCustomers);

// ----- Product Routes -----
router.post('/insert-product', productController.insertNewProduct);
router.get('/get-all-products', productController.getAllProducts);
router.post('/get-product-by-id-name', productController.getProductbyIdorName);
router.post('/update-product-price', productController.updateProductPrice);
router.post('/delete-product', productController.deleteProduct);
router.post('/get-products-by-category', productController.getProductsByCategory);

module.exports = router;

