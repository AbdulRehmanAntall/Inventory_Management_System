const { sql, poolPromise } = require('../config/db');  // Destructure to get both sql and poolPromise

//Function to insert new category
exports.insertNewCategory = async (req, res) => {
    const { categoryname, categorydescription } = req.body;

    console.log("📦 Inserting new category:", { categoryname, categorydescription });

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('categoryname', sql.VarChar(100), categoryname);
        request.input('categorydescription', sql.VarChar(1000), categorydescription);
        request.output('success', sql.Int);

        const result = await request.execute('insert_new_category');
        const success = result.output.success;

        console.log("✅ Stored Procedure Output - Success:", success);

        if (success === 1) {
            res.status(201).json({ success: true, message: 'Category inserted successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Failed to insert category' });
        }
    } catch (error) {
        console.error("❌ Error inserting category:", error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};
