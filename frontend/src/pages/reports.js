import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';
import '../styles/reports.css';

const Reports = () => {
    const [summary, setSummary] = useState({});
    const [frequentProducts, setFrequentProducts] = useState([]);
    const [trends, setTrends] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [period, setPeriod] = useState('7d');
    const [notification, setNotification] = useState(null);

    const navigate = useNavigate();

    const handleNavigation = (path) => navigate(path);
    const handleLogout = () => navigate('/login');

    const showNotification = useCallback((message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    const fetchSummary = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/dashboard-summary');
            setSummary(res.data);
            console.log('Summary:', res.data);
        } catch (error) {
            console.error('Failed to fetch summary:', error);
            showNotification('Failed to fetch summary.', 'error');
        }
    }, [showNotification]);

    const fetchFrequentProducts = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/frequently-sold-products'); 
            setFrequentProducts(res.data || []);
            console.log('Frequent Products:', res.data);
        } catch (error) {
            console.error('Failed to fetch frequent products:', error);
            showNotification('Failed to fetch frequent products.', 'error');
        }
    }, [showNotification]);

    const fetchSalesTrends = useCallback(async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/sales-trends', { period }); 
            setTrends(res.data || []);
            console.log('Sales Trends:', res.data);
        } catch (error) {
            console.error('Failed to fetch sales trends:', error);
            showNotification('Failed to fetch sales trends.', 'error');
        }
    }, [period, showNotification]);

    const fetchSupplierPerformance = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/supplier-performance');
            console.log('Supplier API Response:', res.data);  // 👈 check the structure
            setSuppliers(res.data || []);
        } catch (error) {
            console.error('Failed to fetch supplier performance:', error);
            showNotification('Failed to fetch supplier performance.', 'error');
        }
    }, [showNotification]);
    

    useEffect(() => {
        fetchSummary();
        fetchFrequentProducts();
        fetchSalesTrends();
        fetchSupplierPerformance();
    }, [fetchSummary, fetchFrequentProducts, fetchSalesTrends, fetchSupplierPerformance]);

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
                        <hr className="menu-separator" />
                        <li onClick={() => handleNavigation('/settings')}>Settings</li>
                    </ul>
                </div>
                <div className="logout-section">
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div className="main-content">
    <h1 className="page-title">Reports Dashboard</h1>

    <div className="add-product-form">
        <h2>Select Report Period</h2>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
        </select>
    </div>

    {summary && (
        <div className="add-product-form">
            <h2>Summary</h2>
            <p>Total Stock: {summary.total_stock ?? 0}</p>
            <p>Total Sales: {summary.total_sales ?? 0}</p>
            <p>Total Revenue: ${summary.total_revenue ?? 0}</p>
        </div>
    )}

    <div className="add-product-form">
        <h2>Frequently Sold Products</h2>
        {frequentProducts.length > 0 ? (
            <ul>
                {frequentProducts.map((p, idx) => (
                    <li key={idx}>{p.productname} - Sold: {p.totalsold}</li>
                ))}
            </ul>
        ) : (
            <p>No data available.</p>
        )}
    </div>

    <div className="add-product-form">
        <h2>Sales Trends</h2>
        {trends.length > 0 ? (
            <ul>
                {trends.map((t, idx) => (
                    <li key={idx}>
                        {t.month ? `${t.month}/${t.year}` : t.year} - ${t.total_sales}
                    </li>
                ))}
            </ul>
        ) : (
            <p>No trend data.</p>
        )}
    </div>

    <div className="add-product-form">
        <h2>Top Performing Vendors</h2>
        {suppliers.length > 0 ? (
            <ul>
                {suppliers.map((s, idx) => (
                   <li key={idx}>
                   {s.SupplierName} - Orders: {s.Total_Orders} - Avg Rating: {s.Avg_Rating != null ? Number(s.Avg_Rating).toFixed(2) : 'N/A'}
                 </li>
                 
                  
                ))}
            </ul>
        ) : (
            <p>No supplier performance data.</p>
        )}
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

export default Reports;
