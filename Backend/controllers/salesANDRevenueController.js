const { request } = require('express');
const { sql, poolPromise } = require('../config/db');  // Destructure to get both sql and poolPromise


exports.insertNewSale = async (req, res) => {
    const { SaleUserID, CustomerID, InvoiceTotalAmount, InvoiceTax = 0.00, SaleItems } = req.body;

    try {
        const pool = await poolPromise;
        const table = new sql.Table('SaleItemType');
        table.columns.add('ProductID', sql.Int);
        table.columns.add('Quantity', sql.Int);
        table.columns.add('PricePerUnit', sql.Decimal(10, 2));

        SaleItems.forEach(item => {
            table.rows.add(item.ProductID, item.Quantity, item.PricePerUnit);
        });

        const request = pool.request();
        request.input('SaleUserID', sql.Int, SaleUserID);
        request.input('CustomerID', sql.Int, CustomerID);
        request.input('InvoiceTotalAmount', sql.Decimal(10, 2), InvoiceTotalAmount);
        request.input('InvoiceTax', sql.Decimal(10, 2), InvoiceTax);
        request.input('SaleItems', table);
        request.output('SaleID', sql.Int);

        const result = await request.execute('Insert_New_Sale');
        const SaleID = result.output.SaleID;

        if (!SaleID) {
            return res.status(500).json({ message: 'Sale insertion failed.' });
        }

        res.status(200).json({ message: 'Sale inserted successfully', SaleID });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error inserting sale', error: err.message });
    }
};



//this function is used to get sales history
exports.getSalesHistory = async (req, res) => {
    const { StartDate, EndDate } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('StartDate', sql.DateTime, StartDate)
            .input('EndDate', sql.DateTime, EndDate)
            .execute('Get_Sales_History');

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving sales history', error: err.message });
    }
};

// this function is used to get sales revenue between specific period of time
exports.getTotalRevenue = async (req, res) => {
    const { startDate, endDate } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('startDate', sql.Date, startDate)  // Using DATE type here
            .input('endDate', sql.Date, endDate)      // Using DATE type here
            .execute('get_total_revenue');

        const data = result.recordset[0];
        if (!data || data.totalrevenue === null) {
            return res.status(200).json({ totalrevenue: 0 });
        }
        console.log('Query result:', result.recordset);
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error calculating revenue', error: err.message });
    }
};

// this function gets the best selling products
exports.getBestSellingProducts = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().execute('get_best_selling_products');

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving best selling products', error: err.message });
    }
};

//function to get total tax 
exports.getTotalTaxCollected = async (req, res) => {
    const { startDate, endDate } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('startDate', sql.Date, startDate)  // Using DATE type here
            .input('endDate', sql.Date, endDate)
            .execute('get_total_tax_collected');

        const data = result.recordset[0];
        if (!data || data.totaltaxcollected === null) {
            return res.status(200).json({ totaltaxcollected: 0 });
        }
        console.log('Query result:', result.recordset);
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error calculating tax', error: err.message });
    }
};


//function to get all sales
exports.showAllSales = async (req, res) => {
    try {
        const pool = await poolPromise; // Get the database pool
        const request = pool.request(); // Create a request from the pool

        // Execute the stored procedure Get_All_Sales
        const result = await request.execute('Get_All_Sales'); 

        // Check if there are sales records
        if (result.recordset.length > 0) {
            res.status(200).json({
                success: true,
                sales: result.recordset
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No sales found'
            });
        }
    } catch (error) {
        // Log the error and send a 500 response
        console.error("❌ Error fetching sales:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
