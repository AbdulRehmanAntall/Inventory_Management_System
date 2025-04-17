const { sql, poolPromise } = require('../config/db');

// Function to insert a new order
exports.insertNewOrder = async (req, res) => {
    const { OrderSupplierID, OrderStatus, OrderTotalCost } = req.body;

    console.log("Inserting Order:", { OrderSupplierID, OrderStatus, OrderTotalCost });

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('OrderSupplierID', sql.Int, OrderSupplierID);
        request.input('OrderStatus', sql.VarChar(15), OrderStatus);
        request.input('OrderTotalCost', sql.Decimal(10, 2), OrderTotalCost);
        request.output('Success', sql.Int);

        const result = await request.execute('Insert_New_Order');
        const success = result.output.Success;

        console.log("Stored Procedure Output - Success:", success);

        if (success === 1) {
            res.status(201).json({
                success: true,
                message: 'Order inserted successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Failed to insert order'
            });
        }

    } catch (error) {
        console.error("Error inserting order:", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};


//Function to update the status of an order
exports.updateOrderStatus = async (req, res) => {
    const { OrderID, NewStatus } = req.body;

    console.log("🔄 Updating Order Status:", { OrderID, NewStatus });

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('OrderID', sql.Int, OrderID);
        request.input('NewStatus', sql.VarChar(15), NewStatus);
        request.output('Success', sql.Int);

        const result = await request.execute('Update_Order_Status');
        const success = result.output.Success;

        console.log("Stored Procedure Output - Success:", success);

        if (success === 1) {
            res.status(200).json({ success: true, message: 'Order status updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Order not found' });
        }

    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

//Function to delete an Order
exports.deleteOrder = async (req, res) => {
    const { OrderID } = req.body;

    console.log("🗑️ Deleting Order:", OrderID);

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('OrderID', sql.Int, OrderID);
        request.output('Success', sql.Int);

        const result = await request.execute('DeleteOrder');
        const success = result.output.Success;

        console.log("✅ Stored Procedure Output - Success:", success);

        if (success === 1) {
            res.status(200).json({ success: true, message: 'Order deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Order not found' });
        }

    } catch (error) {
        console.error("❌ Error deleting order:", error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

//Function to see all oders
exports.showAllOrders = async (req, res) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.output('Success', sql.Int);

        const result = await request.execute('Show_All_Orders');
        const success = result.output.Success;

        if (success === 1 && result.recordset.length > 0) {
            res.status(200).json({
                success: true,
                orders: result.recordset
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No orders found'
            });
        }
    } catch (error) {
        console.error("❌ Error fetching orders:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
