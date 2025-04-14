const { sql, poolPromise } = require('../config/db');  // Destructure to get both sql and poolPromise

// Function to fetch all users
exports.getAllUsers = async (req, res) => {
    try {
        // Wait for the pool to get a connection
        const pool = await poolPromise;

        // Create the request object using the pool
        const request = pool.request();

        // Execute the stored procedure to fetch all users
        const result = await request.execute('fetch_all_users');

        // Log the result to check if everything is working
        console.log("Database Result:", result);

        // Check if records were returned
        if (result.recordset && result.recordset.length > 0) {
            console.log("Users Found:", result.recordset);  // Log all users found
            res.status(200).json({
                success: true,
                users: result.recordset,  // Send list of users in the response
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No users found',
            });
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: err.message });
    }
};
