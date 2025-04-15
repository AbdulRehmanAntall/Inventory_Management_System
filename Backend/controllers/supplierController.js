const { request } = require('express');
const { sql, poolPromise } = require('../config/db');

// This function inserts a new supplier 
exports.insertNewSupplier = async (req, res) => {

    const {
        SupplierName,
        SupplierContactPerson,
        SupplierEmail,
        SupplierPhoneNumber,
        SupplierAddress,
        SupplierPerformanceRating = 5.0
    } = req.body;

    console.log("Inserting Supplier:", {
        SupplierName,
        SupplierContactPerson,
        SupplierEmail,
        SupplierPhoneNumber,
        SupplierAddress,
        SupplierPerformanceRating
    });

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('SupplierName', sql.VarChar(100), SupplierName);
        request.input('SupplierContactPerson', sql.VarChar(100), SupplierContactPerson);
        request.input('SupplierEmail', sql.VarChar(100), SupplierEmail);
        request.input('SupplierPhoneNumber', sql.VarChar(20), SupplierPhoneNumber);
        request.input('SupplierAddress', sql.VarChar(1000), SupplierAddress);
        request.input('SupplierPerformanceRating', sql.Decimal(3, 2), SupplierPerformanceRating);
        request.output('Success', sql.Int);

        const result = await request.execute('Insert_New_Supplier');
        const success = result.output.Success;

        console.log("✅ Stored Procedure Output - Success:", success);

        if (success === 1) {
            res.status(201).json({ message: 'Supplier inserted successfully' });
        } else {
            res.status(400).json({ message: 'Failed to insert supplier' });
        }

    } catch (error) {
        console.error("❌ Error inserting supplier:", error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

//this function gets data for all the suppliers
exports.getAllSuppliers = async (req, res) => {
    console.log("📤 Retrieving all suppliers...");

    try {
        const pool = await poolPromise;
        const request = pool.request();

        const result = await request.execute('Retrieve_All_Suppliers');
        console.log("✅ Suppliers Retrieved:", result.recordset);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("❌ Error fetching suppliers:", error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

// This function gets Supplier Data using its ID
exports.getSupplierById = async (req, res) => {
    const { SupplierID } = req.body;
    console.log(" Fetching supplier by ID:", SupplierID);

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('SupplierID', sql.Int, SupplierID);

        const result = await request.execute('Retrieve_Supplier_By_ID');
        console.log("✅ Supplier Retrieved:", result.recordset);

        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Supplier not found' });
        } else {
            res.status(200).json(result.recordset);
        }
    } catch (error) {
        console.error("❌ Error fetching supplier by ID:", error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

// This function gets Supplier Data using its Name
exports.getSupplierByName = async (req, res) => {
    const { SupplierName } = req.body;
    console.log("Fetching supplier by Name:", SupplierName);

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('SupplierName', sql.VarChar(100), SupplierName);

        const result = await request.execute('Retrieve_Supplier_By_Name');
        console.log("✅ Supplier(s) Retrieved:", result.recordset);

        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Supplier not found' });
        } else {
            res.status(200).json(result.recordset);
        }
    } catch (error) {
        console.error("❌ Error fetching supplier by name:", error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};


//this function deletes a suppliear
exports.deleteSupplier = async (req, res) => {
    const { SupplierID } = req.body;
    console.log("Deleting supplier with ID:", SupplierID);

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('SupplierID', sql.Int, SupplierID);
        request.output('Success', sql.Int);

        const result = await request.execute('Delete_Supplier');
        console.log("✅ Delete Operation Output:", result.output.Success);

        if (result.output.Success === 1) {
            res.status(200).json({ message: 'Supplier deleted successfully' });
        } else {
            res.status(404).json({ message: 'Supplier not found or linked to products' });
        }
    } catch (error) {
        console.error("❌ Error deleting supplier:", error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};


// This function shows only suppliers associated with a specific product
exports.getSuppliersByProduct = async (req, res) => {
    const { ProductID } = req.body;
    console.log("Getting suppliers for ProductID:", ProductID);

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('ProductID', sql.Int, ProductID);

        const result = await request.execute('Retrieve_Suppliers_For_Specific_Product');
        console.log("✅ Suppliers for Product Retrieved:", result.recordset);

        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'No suppliers associated with this product' });
        } else {
            res.status(200).json(result.recordset);
        }
    } catch (error) {
        console.error("❌ Error fetching suppliers for product:", error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};
