const { request } = require('express');
const { sql, poolPromise } = require('../config/db');

//this function is used to enter a new product
exports.insertNewProduct = async (req, res) => {
    const {
        ProductName,
        ProductDescription,
        ProductCategoryID,
        ProductPrice,
        ProductStockQuantity,
        ProductReorderThreshold = 5,
        ProductExpiryDate = null
    } = req.body;

    console.log("Inserting New Product:", {
        ProductName,
        ProductDescription,
        ProductCategoryID,
        ProductPrice,
        ProductStockQuantity,
        ProductReorderThreshold,
        ProductExpiryDate
    });

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('ProductName', sql.VarChar(100), ProductName);
        request.input('ProductDescription', sql.VarChar(1000), ProductDescription);
        request.input('ProductCategoryID', sql.Int, ProductCategoryID);
        request.input('ProductPrice', sql.Decimal(10, 2), ProductPrice);
        request.input('ProductStockQuantity', sql.Int, ProductStockQuantity);
        request.input('ProductReorderThreshold', sql.Int, ProductReorderThreshold);
        request.input('ProductExpiryDate', sql.Date, ProductExpiryDate);
        request.output('Success', sql.Int);

        const result = await request.execute('Insert_New_Product');
        const success = result.output.Success;

        console.log("✅ Insert Success Output:", success);

        if (success === 1) {
            res.status(201).json({ success: true, message: 'Product inserted successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Failed to insert product' });
        }
    } catch (error) {
        console.error("❌ Error inserting product:", error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

//this function is used to retrieve all products
exports.getAllProducts = async (req, res) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        const result = await request.execute('Retrieve_All_Products');

        console.log("All Products:", result.recordset);

        res.status(200).json({ success: true, products: result.recordset });
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};


//this function is used to retrieve product by id 
exports.getProductbyIdorName = async (req, res) => {
    const { ProductID, ProductName } = req.body;

    console.log("Fetching Product:", { ProductID, ProductName });

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('ProductID', sql.Int, ProductID || null);
        request.input('ProductName', sql.VarChar(100), ProductName || null);

        const result = await request.execute('Retrieve_Product');

        if (result.recordset.length > 0) {
            res.status(200).json({ success: true, product: result.recordset });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        console.error("❌ Error retrieving product:", error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

//this function is used to update price of a product
exports.updateProductPrice = async (req, res) => {
    const { ProductID, ProductPrice } = req.body;

    console.log("Updating Product Price:", { ProductID, ProductPrice });

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('ProductID', sql.Int, ProductID);
        request.input('ProductPrice', sql.Decimal(10, 2), ProductPrice);

        await request.execute('Update_Product_Price');

        res.status(200).json({ success: true, message: '✅Product price updated successfully' });
    } catch (error) {
        console.error("❌ Error updating product price:", error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

//this function is used to delete a product
exports.deleteProduct = async (req, res) => {
    const { ProductID } = req.body;

    console.log("Deleting Product ID:", ProductID);

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('ProductID', sql.Int, ProductID);
        request.output('Success', sql.Int);

        const result = await request.execute('Delete_Product');
        const success = result.output.Success;

        console.log("✅ Delete Output:", success);

        if (success === 1) {
            res.status(200).json({ success: true, message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Product not found or could not be deleted' });
        }
    } catch (error) {
        console.error("❌ Error deleting product:", error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

//this function is used to fetch products by category
exports.getProductsByCategory = async (req, res) => {
    const { CategoryID } = req.body;

    console.log("Fetching Products by Category ID:", CategoryID);

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('CategoryID', sql.Int, CategoryID);

        const result = await request.execute('Fetch_Products_By_Category');

        if (result.recordset.length > 0) {
            res.status(200).json({ success: true, products: result.recordset });
        } else {
            res.status(404).json({ success: false, message: 'No products found for this category' });
        }
    } catch (error) {
        console.error("❌ Error fetching category products:", error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

