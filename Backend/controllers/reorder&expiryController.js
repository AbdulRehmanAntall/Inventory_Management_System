const { sql, poolPromise } = require('../config/db');

// Function to get products that need reordering
exports.getReorderProducts = async (req, res) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        const result = await request.execute('Get_Reorder_Products');

        if (result.recordset && result.recordset.length > 0) {
            res.status(200).json({
                success: true,
                reorderProducts: result.recordset
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No products need reordering.'
            });
        }
    } catch (error) {
        console.error("❌ Error fetching reorder products:", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Function to get products that are expiring soon
exports.getExpiringProducts = async (req, res) => {
    const { DaysAhead } = req.body;

    console.log("📅 Checking for products expiring within days:", DaysAhead);

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('DaysAhead', sql.Int, DaysAhead);

        const result = await request.execute('Get_Expiring_Products');

        if (result.recordset && result.recordset.length > 0) {
            res.status(200).json({
                success: true,
                message: 'Expiring products fetched successfully',
                products: result.recordset
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No expiring products found in the given time range'
            });
        }
    } catch (error) {
        console.error("❌ Error fetching expiring products:", error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};
