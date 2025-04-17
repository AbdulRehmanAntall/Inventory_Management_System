const { request } = require('express');
const { sql, poolPromise } = require('../config/db');  // Destructure to get both sql and poolPromise


//this function is used to enter a new sale
exports.insertNewSale = async (req, res) => {
    const { SaleUserID, CustomerID, InvoiceTotalAmount, InvoiceTax = 0.00 } = req.body;

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('SaleUserID', sql.Int, SaleUserID);
        request.input('CustomerID', sql.Int, CustomerID);
        request.input('InvoiceTotalAmount', sql.Decimal(10, 2), InvoiceTotalAmount);
        request.input('InvoiceTax', sql.Decimal(10, 2), InvoiceTax);
        request.output('SaleID', sql.Int);

        const result = await request.execute('Insert_New_Sale');
        const SaleID = result.output.SaleID;
        console.log(result);

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
