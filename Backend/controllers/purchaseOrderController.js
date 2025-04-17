const { sql, poolPromise } = require('../config/db');

//Function to retreive purchase orders by time or supplier
exports.getPurchaseOrders = async (req, res) => {
    const { orderSupplierID = null, startDate = null, endDate = null } = req.body;

    console.log("🔍 Fetching Purchase Orders With Filters:", {
        orderSupplierID,
        startDate,
        endDate
    });

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('orderSupplierID', sql.Int, orderSupplierID);
        request.input('startDate', sql.DateTime, startDate);
        request.input('endDate', sql.DateTime, endDate);

        const result = await request.execute('Get_Purchase_Orders');

        if (result.recordset && result.recordset.length > 0) {
            res.status(200).json({
                success: true,
                message: 'Purchase orders retrieved successfully',
                orders: result.recordset
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No purchase orders found with the given filters'
            });
        }
    } catch (error) {
        console.error("❌ Error retrieving purchase orders:", error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

//Function for purchase history of a product
exports.getPurchaseHistoryForProduct = async (req, res) => {
    const { productID } = req.body;

    console.log("📦 Fetching purchase history for product ID:", productID);

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('productID', sql.Int, productID);

        const result = await request.execute('Get_Purchase_History_For_Product');

        if (result.recordset && result.recordset.length > 0) {
            res.status(200).json({
                success: true,
                message: 'Purchase history fetched successfully',
                history: result.recordset
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No purchase history found for this product'
            });
        }
    } catch (error) {
        console.error("❌ Error fetching purchase history:", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};


//Function to get the best supplier
exports.getBestSupplier = async (req, res) => {
    console.log("🔍 Fetching best supplier...");

    try {
        const pool = await poolPromise;
        const request = pool.request();

        const result = await request.execute('Get_Best_Supplier');

        if (result.recordset && result.recordset.length > 0) {
            res.status(200).json({
                success: true,
                message: 'Best supplier fetched successfully',
                supplier: result.recordset[0]
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No supplier data found'
            });
        }
    } catch (error) {
        console.error("❌ Error fetching best supplier:", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
