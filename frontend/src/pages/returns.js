import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';
import '../styles/returns.css';

const Returns = () => {
    const [sales, setSales] = useState([]); // List of all sales
    const [productsSoldInSale, setProductsSoldInSale] = useState([]); // List of products sold in selected sale
    const [returnItem, setReturnItem] = useState({
        SaleID: '',
        ProductID: '',
        ReturnQuantity: 0,
    });
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch sales and products data
    const fetchData = useCallback(async () => {
        try {
            const [salesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/all-sales'),
            ]);
            setSales(salesRes.data.sales); // ✅ only the array
        } catch (error) {
            console.error('Error fetching data:', error);
            showNotification('Failed to load data.', 'error');
        }
    }, []);

    // Fetch products sold in the selected sale
    const fetchProductsForSale = useCallback(async (SaleID) => {
        try {
            const response = await axios.post('http://localhost:5000/api/get-products-in-sale', {
                SaleID: SaleID,
            });
            setProductsSoldInSale(response.data.products); // Only products related to the selected sale
        } catch (error) {
            console.error('Error fetching products for sale:', error);
            showNotification('Failed to load products for this sale.', 'error');
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handle change in sale selection
    const handleSaleChange = (e) => {
        const selectedSaleID = e.target.value;
        setReturnItem({ ...returnItem, SaleID: selectedSaleID, ProductID: '', ReturnQuantity: 0 });

        if (selectedSaleID) {
            fetchProductsForSale(selectedSaleID); // Fetch products for the selected sale
        } else {
            setProductsSoldInSale([]); // Clear products if no sale is selected
        }
    };

    const handleNavigation = (path) => navigate(path);
    const handleLogout = () => {
        navigate('/login');
    };

    // Handle form input changes
    const handleChange = (e) => {
        setReturnItem({ ...returnItem, [e.target.name]: e.target.value });
    };

    // Show notifications
    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    // Handle return processing
    const handleReturnItem = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { SaleID, ProductID, ReturnQuantity } = returnItem;
            await axios.post('http://localhost:5000/api/return-sale-item', {
                SaleID,
                ProductID,
                ReturnQuantity,
            });
            fetchData(); // Refetch data after return
            setReturnItem({ SaleID: '', ProductID: '', ReturnQuantity: 0 });
            showNotification('Return processed successfully!', 'success');
        } catch (error) {
            console.error('Error processing return:', error);
            showNotification('Failed to process return!', 'error');
        } finally {
            setLoading(false);
        }
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
                <h1 className="page-title">Returns Management</h1>

                <div className="add-return-form">
                    <h2>Return Item</h2>
                    <form onSubmit={handleReturnItem}>
                        <select
                            name="SaleID"
                            value={returnItem.SaleID}
                            onChange={handleSaleChange}
                            required
                        >
                            <option value="">Select Sale</option>
                            {sales.map((sale) => (
                                <option key={sale.SaleID} value={sale.SaleID}>
                                    Sale ID: {sale.SaleID} - {sale.CustomerName}
                                </option>
                            ))}
                        </select>

                        <select
                            name="ProductID"
                            value={returnItem.ProductID}
                            onChange={handleChange}
                            required
                            disabled={!returnItem.SaleID} // Disable if no sale is selected
                        >
                            <option value="">Select Product</option>
                            {productsSoldInSale.map((product) => (
                                <option key={product.ProductID} value={product.ProductID}>
                                    {product.ProductName} - Sold Quantity: {product.SaleItemQuantity}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            name="ReturnQuantity"
                            placeholder="Return Quantity"
                            value={returnItem.ReturnQuantity}
                            onChange={handleChange}
                            min="1"
                            required
                        />

                        <button type="submit">
                            {loading ? <span className="loading-spinner"></span> : 'Process Return'}
                        </button>
                    </form>
                </div>
            </div>

            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
        </div>
    );
};

export default Returns;
