const { request } = require('express');

const { sql, poolPromise } = require('../config/db');

// FUNCTION TOT GET Total Stock, Sales & Revenue
exports.getDashboardSummary = async (req, res) => {
    console.log("Fetching Dashboard Summary...");

    try {
        const pool = await poolPromise;
        const request = pool.request();

        const result = await request.execute('Get_Dashboard_Summary');
        console.log("✅ Dashboard Summary:", result.recordset);

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error("❌ Error fetching dashboard summary:", error);
        res.status(500).json({ message: 'An error occurred while retrieving dashboard summary', error: error.message });
    }
};

// function to get Most Frequently Sold Products
exports.getFrequentlySoldProducts = async (req, res) => {
    console.log("Fetching Most Frequently Sold Products...");

    try {
        const pool = await poolPromise;
        const request = pool.request();

        const result = await request.execute('Get_Frequently_Sold_Products');
        console.log("✅ Frequently Sold Products:", result.recordset);

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("❌ Error fetching frequently sold products:", error);
        res.status(500).json({ message: 'An error occurred while fetching frequently sold products', error: error.message });
    }
};

// function to find sale trends
exports.getSalesTrends = async (req, res) => {
    const { period } = req.body;
    console.log("📈 Fetching Sales Trends for:", period);

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('period', sql.VarChar(10), period);

        const result = await request.execute('Get_Sales_Trends');
        console.log(`✅ ${period} Sales Trends:`, result.recordset);

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("❌ Error fetching sales trends:", error);
        res.status(500).json({ message: 'An error occurred while retrieving sales trends', error: error.message });
    }
};

// function to get Supplier Performance Report
exports.getSupplierPerformance = async (req, res) => {
    console.log("Fetching Supplier Performance Report...");

    try {
        const pool = await poolPromise;
        const request = pool.request();

        const result = await request.execute('Get_Supplier_Performance');
        console.log("✅ Supplier Performance Data:", result.recordset);

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("❌ Error fetching supplier performance:", error);
        res.status(500).json({ message: 'An error occurred while fetching supplier performance report', error: error.message });
    }
};

