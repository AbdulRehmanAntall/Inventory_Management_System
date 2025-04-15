const { sql, poolPromise } = require('../config/db');  // Destructure to get both sql and poolPromise


//-------------------------------------USER FUNCTIONS------------------------
// Function to fetch all users
exports.getAllUsers = async (req, res) => {
    try {
        const pool = await poolPromise;

        const request = pool.request();

        const result = await request.execute('fetch_all_users');

        console.log("Database Result:", result);

        if (result.recordset && result.recordset.length > 0) {
            console.log("Users Found:", result.recordset);
            res.status(200).json({
                success: true,
                users: result.recordset,
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

//this function gets user Details BY Name
exports.getUserDetailsByName = async (req, res) => {
    const { username } = req.body;
    console.log("🔍 Searching user:", username);

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('UserName', sql.VarChar(50), username);
        request.output('Success', sql.Int);

        const result = await request.execute('retrieve_user_details_name');
        const Success = result.output.Success;

        console.log("✅ Stored Procedure Output - Success:", Success);
        console.log(" Retrieved User Details:", result.recordset);
        if (Success === 1) {
            res.status(200).json({
                Success: true,
                message: 'User found',
                data: result.recordset
            });
        } else {
            res.status(404).json({ Success: false, message: 'User not found' });
        }

    } catch (err) {
        console.error("❌ Error in getUserDetailsByName:", err);
        res.status(500).json({ Success: false, message: "Internal server error", error: err.message });
    }
};

//Controller to authenticate user login
exports.authenticateUser = async (req, res) => {
    const { username, userpassword } = req.body;

    console.log("Login attempt received:");
    console.log("Username:", username);
    console.log("Password:", userpassword);

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
    console.log("Received Values:", { userName, userPassword, userEmail, userRole });

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

