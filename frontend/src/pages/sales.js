import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';
import '../styles/sales.css';

const Sales = () => {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [saleItems, setSaleItems] = useState([]);
    const [newSale, setNewSale] = useState({
        SaleUserID: 1,
        CustomerID: '',
        InvoiceTax: 0,
        InvoiceTotalAmount: 0,
        FinalAmount: 0
    });
    const [notification, setNotification] = useState(null);
    const [allSales, setAllSales] = useState([]);

    const navigate = useNavigate();

    const handleNavigation = (path) => navigate(path);
    const handleLogout = () => navigate('/login');

    useEffect(() => {
        axios.get('http://localhost:5000/api/show-all-customers')
            .then(res => setCustomers(res.data.customers));
        axios.get('http://localhost:5000/api/get-all-products')
            .then(res => setProducts(res.data.products));
        axios.get('http://localhost:5000/api/all-sales')
            .then(res => setAllSales(res.data.sales));
    }, []);

    const addItem = () => {
        setSaleItems([...saleItems, { ProductID: '', Quantity: 1, PricePerUnit: 0, Discount: 0 }]);
    };

    const removeItem = (index) => {
        const updatedItems = saleItems.filter((_, idx) => idx !== index);
        setSaleItems(updatedItems);
        calculateTotals(updatedItems, newSale.InvoiceTax);
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...saleItems];

        if (field === 'ProductID') {
            const selectedProduct = products.find(p => p.ProductID === parseInt(value));
            updatedItems[index]['ProductID'] = value;
            updatedItems[index]['PricePerUnit'] = selectedProduct ? selectedProduct.ProductPrice : 0;
            updatedItems[index]['Quantity'] = 1;
        } else if (field === 'Discount') {
            const price = parseFloat(updatedItems[index]['PricePerUnit']) || 0;
            value = Math.min(parseFloat(value), price);
            updatedItems[index][field] = value;
        } else if (field === 'Quantity') {
            const selectedProduct = products.find(p => p.ProductID === parseInt(updatedItems[index]['ProductID']));
            const availableStock = selectedProduct ? selectedProduct.ProductStockQuantity : 0;
            updatedItems[index]['Quantity'] = Math.min(parseFloat(value), availableStock);
        } else {
            updatedItems[index][field] = parseFloat(value);
        }

        setSaleItems(updatedItems);
        calculateTotals(updatedItems, newSale.InvoiceTax);
    };

    const handleSaleChange = (e) => {
        const { name, value } = e.target;
        const numericValue = name === 'InvoiceTax' ? parseFloat(value) : value;
        const updatedSale = { ...newSale, [name]: numericValue };
        setNewSale(updatedSale);
        const taxPercent = name === 'InvoiceTax' ? parseFloat(value) : parseFloat(updatedSale.InvoiceTax);
        calculateTotals(saleItems, taxPercent);
    };

    const calculateTotals = (items, taxPercent) => {
        const total = items.reduce((acc, item) => {
            const qty = parseFloat(item.Quantity) || 0;
            const price = parseFloat(item.PricePerUnit) || 0;
            const discount = parseFloat(item.Discount) || 0;
            return acc + (qty * price - discount);
        }, 0);

        const taxAmount = total * (parseFloat(taxPercent) / 100);
        const finalAmount = total + taxAmount;

        setNewSale(prev => ({
            ...prev,
            InvoiceTotalAmount: total,
            FinalAmount: finalAmount
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/insert-sale', {
            ...newSale,
            SaleItems: saleItems
        })
            .then(() => {
                setNotification('Sale Recorded Successfully!');
                const selectedCustomer = customers.find(c => c.CustomerID === parseInt(newSale.CustomerID));
                const itemsForEmail = saleItems.map(item => {
                    const product = products.find(p => p.ProductID === parseInt(item.ProductID));
                    return {
                        ProductName: product?.ProductName || 'Unknown',
                        Quantity: item.Quantity,
                        PricePerUnit: item.PricePerUnit
                    };
                });

                const emailData = {
                    customerEmail: selectedCustomer.CustomerEmail,
                    customerName: selectedCustomer.CustomerName,
                    finalAmount: newSale.FinalAmount.toFixed(2),
                    items: itemsForEmail
                };

                axios.post('http://localhost:5000/api/send-sale-email', emailData);

                setSaleItems([]);
                setNewSale({ SaleUserID: 1, CustomerID: '', InvoiceTax: 0, InvoiceTotalAmount: 0, FinalAmount: 0 });

                axios.get('http://localhost:5000/api/all-sales')
                    .then(res => setAllSales(res.data.sales));
            })
            .catch(() => setNotification('Error Recording Sale.'));
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="logo">StockSync</div>
                <div className="menu-container">
                    <ul className="menu">
                        <li onClick={() => handleNavigation('/dashboard')}>My Account</li>
                        <hr className="menu-separator" />
                        <li onClick={() => handleNavigation('/categories')}>Categories</li>
                        <hr className="menu-separator" />
                        <li onClick={() => handleNavigation('/suppliers')}>Vendors</li>
                        <hr className="menu-separator" />
                        <li onClick={() => handleNavigation('/customers')}>Customers</li>
                        <hr className="menu-separator" />
                        <li onClick={() => handleNavigation('/orders')}>Orders</li>
                        <hr className="menu-separator" />
                        <li onClick={() => handleNavigation('/products')}>Products</li>
                        <hr className="menu-separator" />
                        <li onClick={() => handleNavigation('/sales')}>Sales</li>
                        <hr className="menu-separator" />
                        <li onClick={() => handleNavigation('/returns')}>Returns</li>
                        <hr className="menu-separator" />
                        <li onClick={() => handleNavigation('/reports')}>Reports</li>
                        <hr className="menu-separator" />
                        <li onClick={() => handleNavigation('/users')}>User Management</li>
                        <hr className="menu-separator" />
                        <li onClick={() => handleNavigation('/chatbot')}>AI ChatBot</li>

                    </ul>
                </div>
                <div className="logout-section">
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div className="main-content">
                <h1 className="page-title">New Sale</h1>
                {notification && <div className={`notification ${notification.includes('Success') ? 'success' : 'error'}`}>{notification}</div>}
                <div className="sale-form">
                    <form onSubmit={handleSubmit}>
                        <select name="CustomerID" value={newSale.CustomerID} onChange={handleSaleChange} required>
                            <option value="">Select Customer</option>
                            {customers.map(c => (
                                <option key={c.CustomerID} value={c.CustomerID}>{c.CustomerName}</option>
                            ))}
                        </select>

                        <input
                            type="number"
                            name="InvoiceTax"
                            value={newSale.InvoiceTax}
                            onChange={handleSaleChange}
                            placeholder="Tax (%)"
                        />

                        <div className="sale-items">
                            <h2>Sale Items</h2>
                            {saleItems.map((item, idx) => (
                                <div className="sale-item" key={idx}>
                                    <label>
                                        Product:
                                        <select value={item.ProductID} onChange={(e) => handleItemChange(idx, 'ProductID', e.target.value)} required>
                                            <option value="">Select Product</option>
                                            {products.map(p => (
                                                <option key={p.ProductID} value={p.ProductID}>{p.ProductName}</option>
                                            ))}
                                        </select>
                                    </label>

                                    <label>
                                        Quantity:
                                        <input
                                            type="number"
                                            value={item.Quantity}
                                            min="1"
                                            max={products.find(p => p.ProductID === parseInt(item.ProductID))?.ProductStockQuantity || 0}
                                            onChange={(e) => handleItemChange(idx, 'Quantity', e.target.value)}
                                            placeholder="Enter Quantity"
                                            required
                                        />
                                    </label>

                                    <label>
                                        Price Per Unit:
                                        <input
                                            type="number"
                                            value={item.PricePerUnit}
                                            min="0"
                                            step="0.01"
                                            readOnly
                                            placeholder="Auto-set"
                                        />
                                    </label>

                                    <label>
                                        Discount:
                                        <input
                                            type="number"
                                            value={item.Discount}
                                            min="0"
                                            max={item.PricePerUnit}
                                            step="0.01"
                                            onChange={(e) => handleItemChange(idx, 'Discount', e.target.value)}
                                            placeholder="Enter Discount"
                                        />
                                    </label>

                                    <button type="button" onClick={() => removeItem(idx)}>Remove Item</button>
                                </div>
                            ))}

                            <button type="button" onClick={addItem}>Add Product</button>
                        </div>

                        <div className="totals">
                            <p>Total: {newSale.InvoiceTotalAmount.toFixed(2)}</p>
                            <p>Final Amount: {newSale.FinalAmount.toFixed(2)}</p>
                        </div>

                        <button type="submit" className="submit-btn">Submit Sale</button>
                    </form>
                </div>

                <h2>All Sales</h2>
                <table className="sales-table">
                    <thead>
                        <tr>
                            <th>Sale ID</th>
                            <th>Total Amount</th>
                            <th>Tax</th>
                            <th>Final Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allSales.map(sale => (
                            <tr key={sale.SaleID}>
                                <td>{sale.SaleID}</td>
                                <td>{sale.InvoiceTotalAmount}</td>
                                <td>{sale.InvoiceTax}%</td>
                                <td>{(sale.InvoiceTotalAmount + (sale.InvoiceTotalAmount * sale.InvoiceTax / 100)).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Sales;
