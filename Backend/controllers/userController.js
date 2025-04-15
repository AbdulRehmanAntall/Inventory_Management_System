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


// Function to insert a new user
exports.insertNewUser = async (req, res) => {
    const { userName, userPassword, userEmail, userRole } = req.body;

    // Log the received values for debugging
    console.log("📥 Received Values:", { userName, userPassword, userEmail, userRole });

    try {
        const pool = await poolPromise; // Use the same poolPromise as authenticateUser
        const request = pool.request();

        request.input('userName', sql.VarChar(50), userName);
        request.input('userPassword', sql.VarChar(255), userPassword);
        request.input('UserEmail', sql.VarChar(100), userEmail);
        request.input('UserRole', sql.VarChar(10), userRole);
        request.output('success', sql.Int);

        const result = await request.execute('Insert_New_user');

        const success = result.output.success;

        console.log("✅ Stored Procedure Output - Success:", success);

        if (success === 1) {
            res.status(201).json({ message: 'User inserted successfully' });
        } else {
            res.status(400).json({ message: 'Failed to insert user' });
        }
    } catch (error) {
        console.error("❌ Error inserting user:", error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

