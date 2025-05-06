import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles/Dashboard.css';
import '../styles/reports.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
        } catch (error) {
            console.error('Failed to fetch summary:', error);
            showNotification('Failed to fetch summary.', 'error');
        }
    }, [showNotification]);

    const fetchFrequentProducts = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/frequently-sold-products');
            setFrequentProducts(res.data || []);
        } catch (error) {
            console.error('Failed to fetch frequent products:', error);
            showNotification('Failed to fetch frequent products.', 'error');
        }
    }, [showNotification]);

    const fetchSalesTrends = useCallback(async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/sales-trends', { period });
            setTrends(res.data || []);
        } catch (error) {
            console.error('Failed to fetch sales trends:', error);
            showNotification('Failed to fetch sales trends.', 'error');
        }
    }, [period, showNotification]);

    const fetchSupplierPerformance = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/supplier-performance');
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

    const formatTrendsForChart = (trends) => {
        if (trends.length === 0) return { labels: [], data: [] };

        if (trends[0].Date) {
            // Daily Data
            return {
                labels: trends.map(t => new Date(t.Date).toLocaleDateString()),
                data: trends.map(t => t.Total_Sales),
            };
        }

        if (trends[0].Month) {
            // Monthly Data
            return {
                labels: trends.map(t => `${t.Month}/${t.Year}`),
                data: trends.map(t => t.Total_Sales),
            };
        }

        // Yearly Data
        return {
            labels: trends.map(t => t.Year),
            data: trends.map(t => t.Total_Sales),
        };
    };

    const chartData = {
        labels: formatTrendsForChart(trends).labels,
        datasets: [{
            label: 'Total Sales',
            data: formatTrendsForChart(trends).data,
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.2)',
            borderWidth: 2,
            fill: true,
        }],
    };

    const renderTrendsTable = () => {
        if (trends.length === 0) return <p>No sales trend data available.</p>;

        if (trends[0].Date) {
            // Daily Data
            return (
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Total Sales</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trends.map((trend, i) => (
                            <tr key={i}>
                                <td>{new Date(trend.Date).toLocaleDateString()}</td>
                                <td>{trend.Total_Sales}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        if (trends[0].Month) {
            // Monthly Data
            return (
                <table>
                    <thead>
                        <tr>
                            <th>Month/Year</th>
                            <th>Total Sales</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trends.map((trend, i) => (
                            <tr key={i}>
                                <td>{`${trend.Month}/${trend.Year}`}</td>
                                <td>{trend.Total_Sales}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        // Yearly Data
        return (
            <table>
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Total Sales</th>
                    </tr>
                </thead>
                <tbody>
                    {trends.map((trend, i) => (
                        <tr key={i}>
                            <td>{trend.Year}</td>
                            <td>{trend.Total_Sales}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
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

                {/* Select Report Period Section */}
                <div className="report-section">
                    <h2>Select Report Period</h2>
                    <div className="report-period-container">
                        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                            <option value="daily">Daily</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        <button onClick={fetchSalesTrends}>Apply</button>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="report-section">
                    <h2>Summary</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Total Stock</th>
                                <th>Total Sales</th>
                                <th>Total Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{summary.total_stock ?? 0}</td>
                                <td>{summary.total_sales ?? 0}</td>
                                <td>${summary.total_revenue ?? 0}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Frequent Products Section */}
                <div className="report-section">
                    <h2>Frequently Sold Products</h2>
                    {frequentProducts.length ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Sold Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {frequentProducts.map((p, i) => (
                                    <tr key={i}>
                                        <td>{p.productname}</td>
                                        <td>{p.totalsold}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <p>No data available.</p>}
                </div>

                {/* Sales Trends Chart Section */}
                <div className="report-section">
                    <h2>Sales Trends (Chart)</h2>
                    <div className="chart-container" style={{ height: '350px' }}>
                        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>

                {/* Sales Trends Table Section */}
                <div className="report-section">
                    <h2>Sales Trends (Table)</h2>
                    {renderTrendsTable()}
                </div>

                {/* Supplier Performance Section */}
                <div className="report-section">
                    <h2>Top Performing Vendors</h2>
                    {suppliers.length ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Vendor Name</th>
                                    <th>Orders</th>
                                    <th>Avg Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers.map((s, i) => (
                                    <tr key={i}>
                                        <td>{s.SupplierName}</td>
                                        <td>{s.Total_Orders}</td>
                                        <td>{s.Avg_Rating != null ? Number(s.Avg_Rating).toFixed(2) : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <p>No supplier data available.</p>}
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
