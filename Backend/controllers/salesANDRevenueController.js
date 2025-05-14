const { request } = require('express');
const { sql, poolPromise } = require('../config/db');  // Destructure to get both sql and poolPromise


exports.insertNewSale = async (req, res) => {
    const { SaleUserID, CustomerID, InvoiceTotalAmount, InvoiceTax = 0.00, SaleItems } = req.body;

    try {
        const pool = await poolPromise;
        const table = new sql.Table('SaleItemType');
        table.columns.add('ProductID', sql.Int);
        table.columns.add('Quantity', sql.Int);
        table.columns.add('PricePerUnit', sql.Decimal(10, 2));

        SaleItems.forEach(item => {
            table.rows.add(item.ProductID, item.Quantity, item.PricePerUnit);
        });

        const request = pool.request();
        request.input('SaleUserID', sql.Int, SaleUserID);
        request.input('CustomerID', sql.Int, CustomerID);
        request.input('InvoiceTotalAmount', sql.Decimal(10, 2), InvoiceTotalAmount);
        request.input('InvoiceTax', sql.Decimal(10, 2), InvoiceTax);
        request.input('SaleItems', table);
        request.output('SaleID', sql.Int);

        const result = await request.execute('Insert_New_Sale');
        const SaleID = result.output.SaleID;

        if (!SaleID) {
            return res.status(500).json({ message: 'Sale insertion failed.' });
        }

        res.status(200).json({ message: 'Sale inserted successfully', SaleID });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error inserting sale', error: err.message });
    }
};



//this function is used to get sales history
exports.getSalesHistory = async (req, res) => {
    const { StartDate, EndDate } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('StartDate', sql.DateTime, StartDate)
            .input('EndDate', sql.DateTime, EndDate)
            .execute('Get_Sales_History');

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving sales history', error: err.message });
    }
};

// this function is used to get sales revenue between specific period of time
exports.getTotalRevenue = async (req, res) => {
    const { startDate, endDate } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('startDate', sql.Date, startDate)
            .input('endDate', sql.Date, endDate)
            .execute('get_total_revenue');

        const data = result.recordset[0];
        if (!data || data.totalrevenue === null) {
            return res.status(200).json({ totalrevenue: 0 });
        }
        console.log('Query result:', result.recordset);
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error calculating revenue', error: err.message });
    }
};

// this function gets the best selling products
exports.getBestSellingProducts = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().execute('get_best_selling_products');

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving best selling products', error: err.message });
    }
};

//function to get total tax 
exports.getTotalTaxCollected = async (req, res) => {
    const { startDate, endDate } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('startDate', sql.Date, startDate)
            .input('endDate', sql.Date, endDate)
            .execute('get_total_tax_collected');

        const data = result.recordset[0];
        if (!data || data.totaltaxcollected === null) {
            return res.status(200).json({ totaltaxcollected: 0 });
        }
        console.log('Query result:', result.recordset);
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error calculating tax', error: err.message });
    }
};


//function to get all sales
exports.showAllSales = async (req, res) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();


        const result = await request.execute('Get_All_Sales');


        if (result.recordset.length > 0) {
            res.status(200).json({
                success: true,
                sales: result.recordset
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No sales found'
            });
        }
    } catch (error) {

        console.error("❌ Error fetching sales:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


// Function to process the return of a sale item
exports.returnSaleItem = async (req, res) => {
    const { SaleID, ProductID, ReturnQuantity } = req.body;

    try {
        const pool = await poolPromise;

        let pricePerUnit, soldQuantity, saleItemID, newQuantity, newSubtotal, newInvoiceTotal;

        const result = await pool.request()
            .input('SaleID', sql.Int, SaleID)
            .input('ProductID', sql.Int, ProductID)
            .query(`
                SELECT TOP 1 
                    SaleItemID, 
                    SaleItemPricePerUnit, 
                    SaleItemQuantity 
                FROM SaleItems
                WHERE SaleItemSaleID = @SaleID AND SaleItemProductID = @ProductID;
            `);


        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Sale item not found for the given SaleID and ProductID' });
        }

        // Get sale item details
        saleItemID = result.recordset[0].SaleItemID;
        pricePerUnit = result.recordset[0].SaleItemPricePerUnit;
        soldQuantity = result.recordset[0].SaleItemQuantity;


        if (ReturnQuantity > soldQuantity) {
            return res.status(400).json({ message: 'Return quantity exceeds the quantity sold.' });
        }

        // Calculate the new quantity and subtotal
        newQuantity = soldQuantity - ReturnQuantity;
        newSubtotal = newQuantity * pricePerUnit;

        // Update the sale item in the database
        await pool.request()
            .input('SaleItemID', sql.Int, saleItemID)
            .input('NewQuantity', sql.Int, newQuantity)
            .input('NewSubtotal', sql.Decimal(10, 2), newSubtotal)
            .query(`
                UPDATE SaleItems
                SET 
                    SaleItemQuantity = @NewQuantity,
                    SaleItemSubtotal = @NewSubtotal
                WHERE SaleItemID = @SaleItemID;
            `);

        // Restock the product
        await pool.request()
            .input('ProductID', sql.Int, ProductID)
            .input('ReturnQuantity', sql.Int, ReturnQuantity)
            .query(`
                UPDATE Products
                SET ProductStockQuantity = ProductStockQuantity + @ReturnQuantity
                WHERE ProductID = @ProductID;
            `);

        // Recalculate the invoice total
        const totalResult = await pool.request()
            .input('SaleID', sql.Int, SaleID)
            .query(`
                SELECT SUM(SaleItemSubtotal) AS NewInvoiceTotal
                FROM SaleItems
                WHERE SaleItemSaleID = @SaleID;
            `);

        newInvoiceTotal = totalResult.recordset[0].NewInvoiceTotal;

        // Update the invoice total
        await pool.request()
            .input('SaleID', sql.Int, SaleID)
            .input('NewInvoiceTotal', sql.Decimal(10, 2), newInvoiceTotal)
            .query(`
                UPDATE SaleInvoices
                SET InvoiceTotalAmount = @NewInvoiceTotal
                WHERE SaleID = @SaleID;
            `);

        // Fetch products sold in this sale
        const productsResult = await pool.request()
            .input('SaleID', sql.Int, SaleID)
            .query(`
                SELECT 
                    P.ProductID,
                    P.ProductName,
                    SI.SaleItemQuantity,
                    SI.SaleItemPricePerUnit,
                    SI.SaleItemSubtotal
                FROM SaleItems SI
                INNER JOIN Products P ON SI.SaleItemProductID = P.ProductID
                WHERE SI.SaleItemSaleID = @SaleID AND SI.SaleItemQuantity > 0;
            `);

        // Send the response with the products sold in this sale
        res.status(200).json({
            message: 'Return processed successfully',
            newInvoiceTotal,
            products: productsResult.recordset  // This is the list of products sold in the sale
        });

    } catch (err) {
        console.error('Error processing product return:', err);
        res.status(500).json({
            message: 'Error processing return',
            error: err.message
        });
    }
};

// Function to get products in a specific sale
exports.getProductsInSale = async (req, res) => {
    const { SaleID } = req.body;

    try {
        const pool = await poolPromise;

        // Query to get the products sold in the sale
        const result = await pool.request()
            .input('SaleID', sql.Int, SaleID)
            .query(`
                SELECT 
                    P.ProductID,
                    P.ProductName,
                    SI.SaleItemQuantity,
                    SI.SaleItemPricePerUnit,
                    SI.SaleItemSubtotal
                FROM SaleItems SI
                INNER JOIN Products P ON SI.SaleItemProductID = P.ProductID
                WHERE SI.SaleItemSaleID = @SaleID;
            `);

        // Check if products are found for the given sale ID
        if (result.recordset.length > 0) {
            res.status(200).json({
                success: true,
                products: result.recordset
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No products found for this sale.'
            });
        }

    } catch (err) {
        // Log the error and send a 500 response
        console.error('Error retrieving products in sale:', err);
        res.status(500).json({
            success: false,
            message: 'Error retrieving products in sale.',
            error: err.message
        });
    }
};

