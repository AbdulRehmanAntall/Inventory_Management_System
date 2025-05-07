const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');
const supplierController = require('../controllers/supplierController');
const customerController = require('../controllers/customerController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const reorderANDexpiryController = require('../controllers/reorder&expiryController');
const reportingController = require('../controllers/reportingController');
const salesANDRevenueController = require('../controllers/salesANDRevenueController');
const purchaseOrderController = require('../controllers/purchaseOrderController');

//user Routes
router.post('/login', userController.authenticateUser);
router.post('/insert-user', userController.insertNewUser);
router.get('/users', userController.getAllUsers);
router.post('/getUserDetailsByName', userController.getUserDetailsByName);
router.post('/Update-User-Password', userController.updateUserPassword);
router.post('/Delete-User', userController.deleteUserAccount);

//category routes
router.post('/insert-category', categoryController.insertNewCategory);
router.post('/delete-category', categoryController.deleteCategory);
router.get('/categories', categoryController.retrieveAllCategories);

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

//Order Routes
router.post('/insert-order', orderController.insertNewOrder);
router.post('/update-order-status', orderController.updateOrderStatus);
router.post('/delete-order', orderController.deleteOrder);
router.get('/show-all-orders', orderController.showAllOrders);

//Reoder and Expiry Routes
router.get('/reorder-products', reorderANDexpiryController.getReorderProducts);
router.post('/get-expiring-products', reorderANDexpiryController.getExpiringProducts);


//reporting Routes
router.get('/dashboard-summary', reportingController.getDashboardSummary);
router.get('/frequently-sold-products', reportingController.getFrequentlySoldProducts);
router.post('/sales-trends', reportingController.getSalesTrends);
router.get('/supplier-performance', reportingController.getSupplierPerformance);


//sales and revenue routes
router.post('/insert-sale', salesANDRevenueController.insertNewSale);
router.post('/sales-history', salesANDRevenueController.getSalesHistory);
router.post('/total-revenue', salesANDRevenueController.getTotalRevenue);
router.get('/best-selling-products', salesANDRevenueController.getBestSellingProducts);
router.post('/total-tax', salesANDRevenueController.getTotalTaxCollected);
router.get('/all-sales', salesANDRevenueController.showAllSales);
router.post('/return-sale-item', salesANDRevenueController.returnSaleItem);
router.post('/get-products-in-sale', salesANDRevenueController.getProductsInSale);

//purchase order routes
router.post('/get-purchase-orders', purchaseOrderController.getPurchaseOrders);
router.post('/get-purchase-history', purchaseOrderController.getPurchaseHistoryForProduct);
router.get('/get-best-supplier', purchaseOrderController.getBestSupplier);

module.exports = router;

