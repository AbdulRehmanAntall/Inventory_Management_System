const { sql, poolPromise } = require('../config/db');

// Function to insert a new customer
exports.insertCustomer = async (req, res) => {
    const { CustomerName, CustomerEmail, CustomerPhoneNumber, CustomerAddress } = req.body;

    console.log("🧾 Inserting Customer:", {
        CustomerName,
        CustomerEmail,
        CustomerPhoneNumber,
        CustomerAddress
    });

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('CustomerName', sql.VarChar(100), CustomerName);
        request.input('CustomerEmail', sql.VarChar(100), CustomerEmail);
        request.input('CustomerPhoneNumber', sql.VarChar(20), CustomerPhoneNumber);
        request.input('CustomerAddress', sql.VarChar(255), CustomerAddress);
        request.output('Success', sql.Int);

        const result = await request.execute('InsertCustomer');
        const success = result.output.Success;

        console.log("✅ Stored Procedure Output - Success:", success);

        if (success === 1) {
            res.status(201).json({ success: true, message: 'Customer inserted successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Failed to insert customer' });
        }
    } catch (error) {
        console.error("❌ Error inserting customer:", error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};


//function to delete a customer
exports.deleteCustomer = async (req, res) => {
    const { CustomerID } = req.body;

    console.log("🗑️ Deleting customer with ID:", CustomerID);

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('CustomerID', sql.Int, CustomerID);
        request.output('Success', sql.Int);

        const result = await request.execute('Delete_Customer');
        const success = result.output.Success;

        console.log("✅ Stored Procedure Output - Success:", success);

        if (success === 1) {
            res.status(200).json({ success: true, message: 'Customer deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Customer not found or could not be deleted' });
        }
    } catch (error) {
        console.error("❌ Error deleting customer:", error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};


// Function to fetch all customers
exports.showAllCustomers = async (req, res) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        // Add the required output parameter
        request.output('Success', sql.Int);

        const result = await request.execute('Show_All_Customers');

        const success = result.output.Success; // <-- access output param here

        console.log("Database result:", result);

        if (success === 1 && result.recordset && result.recordset.length > 0) {
            console.log("Customers Found:", result.recordset);
            res.status(200).json({
                success: true,
                customers: result.recordset
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No customers found'
            });
        }
    } catch (err) {
        console.error("Error fetching customers:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};
