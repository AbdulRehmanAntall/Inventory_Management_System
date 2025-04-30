import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import '../styles/Dashboard.css';

function Dashboard() {
    const { userName } = useUser();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };
    const handleLogout = () => {
        navigate('/login');
    };
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!userName) {
                setError("No user logged in");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch('http://localhost:5000/api/getUserDetailsByName', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: userName }),
                });

                const data = await response.json();
                console.log("API Response:", data);

                if (response.ok) {
                    if (data.Success) {
                        if (data.data && data.data.length > 0) {
                            setUserDetails(data.data[0]);
                        } else {
                            setError("User data not found in response");
                        }
                    } else {
                        setError(data.message || "User not found");
                    }
                } else {
                    setError(data.message || `Server error: ${response.status}`);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
                setError("Error fetching user details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [userName]);


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
                <h1 className="page-title">Welcome, {userName}</h1>

                {loading ? (
                    <div className="loading-wrapper">
                        <div className="loading-spinner"></div>
                        <div>Loading your account details...</div>
                    </div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : userDetails ? (
                    <div className="user-details-container">
                        <div className="user-details-card">
                            <h2>User Profile</h2>
                            <div className="detail-row">
                                <span className="detail-label">Username:</span>
                                <span className="detail-value">{userDetails.UserName || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">User ID:</span>
                                <span className="detail-value">{userDetails.UserID || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">{userDetails.UserEmail || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Role:</span>
                                <span className="detail-value">{userDetails.UserRole || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="no-data">No user details available</div>
                )}
            </div>
        </div>
    );
}

export default Dashboard; 