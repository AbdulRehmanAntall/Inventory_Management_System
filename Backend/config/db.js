require('dotenv').config();
const sql = require('mssql');

console.log("🔍 ENV CHECK:", {
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: process.env.DB_PORT,
    db: process.env.DB_NAME
});

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT), // 👈 convert port to number
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log("✅ Connected to MSSQL");
        return pool;
    })
    .catch(err => console.error("❌ Database Connection Failed!", err));

module.exports = { sql, poolPromise };
