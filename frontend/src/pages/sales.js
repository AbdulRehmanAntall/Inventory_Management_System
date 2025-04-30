import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';
import '../styles/products.css'; // Reuse existing styles

const Sales = () => {
    const [customers, setCustomers] = useState([]);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(false);

    const [newSale, setNewSale] = useState({
        CustomerID: '',
        InvoiceTotalAmount: '',
        InvoiceTax: ''
    });

    const navigate = useNavigate();

    const handleNavigation = (path) => navigate(path);
    const handleLogout = () => navigate('/login');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/show-all-customers');
                setCustomers(res.data?.customers || []);
            } catch (error) {
                console.error('Error loading customers:', error);
                showNotification('Failed to load customers.', 'error');
            }
        };
        fetchCustomers();
    }, []);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleChange = (e) => {
        setNewSale({ ...newSale, [e.target.name]: e.target.value });
    };

    const handleAddSale = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/insert-sale', newSale);
            showNotification('Sale recorded successfully!', 'success');
            setNewSale({
                CustomerID: '',
                InvoiceTotalAmount: '',
                InvoiceTax: ''
            });
        } catch (error) {
            console.error('Error adding sale:', error);
            showNotification('Failed to record sale.', 'error');
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
                        <hr className="menu-separator" />
                        <li onClick={() => handleNavigation('/settings')}>Settings</li>
                    </ul>
                </div>
                <div className="logout-section">
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div className="main-content">
                <h1>Record a New Sale</h1>

                {notification && (
                    <div className={`notification ${notification.type}`}>
                        {notification.message}
                    </div>
                )}

                <form className="add-product-form" onSubmit={handleAddSale}>
                    <h2>New Sale</h2>
                    <select name="CustomerID" value={newSale.CustomerID} onChange={handleChange} required>
                        <option value="">Select Customer</option>
                        {customers.map(c => (
                            <option key={c.CustomerID} value={c.CustomerID}>
                                {c.CustomerName}
                            </option>
                        ))}
                    </select>
                    <input type="number" name="InvoiceTotalAmount" placeholder="Total Amount" value={newSale.InvoiceTotalAmount} onChange={handleChange} required min="0" step="0.01" />
                    <input type="number" name="InvoiceTax" placeholder="Tax" value={newSale.InvoiceTax} onChange={handleChange} required min="0" step="0.01" />
                    <button type="submit" disabled={loading}>
                        {loading ? <span className="loading-spinner"></span> : 'Record Sale'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Sales;
