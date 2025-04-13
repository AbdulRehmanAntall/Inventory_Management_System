const { poolPromise } = require('../config/db');

const testConnection = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT 1 AS connected');
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('❌ DB Query Error:', err);
        res.status(500).send('DB connection failed');
    }
};

module.exports = { testConnection };
