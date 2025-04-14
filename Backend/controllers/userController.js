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


//Controller to authenticate user login
exports.authenticateUser = async (req, res) => {
    const { username, userpassword } = req.body;

    console.log("🔐 Login attempt received:");
    console.log("📥 Username:", username);
    console.log("📥 Password:", userpassword);

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('username', sql.VarChar(50), username);
        request.input('userpassword', sql.VarChar(255), userpassword);
        request.output('success', sql.Int);

        const result = await request.execute('authenticate_user_login');

        const success = result.output.success; // <-- Correct way to get output

        console.log("✅ Stored Procedure Output - Success:", success);

        if (success === 1) {
            res.status(200).json({ success: true, message: "Authentication successful" });
        } else {
            res.status(401).json({ success: false, message: "Invalid username or password" });
        }

    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ error: err.message });
    }
};
