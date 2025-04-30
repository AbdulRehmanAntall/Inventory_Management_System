import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../UserContext';
import '../styles/Dashboard.css';
import '../styles/customers.css';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newCustomer, setNewCustomer] = useState({
        CustomerName: '',
        CustomerEmail: '',
        CustomerPhoneNumber: '',
        CustomerAddress: '',
    });
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { logout } = useUser();

    const handleNavigation = (path) => navigate(path);
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const fetchCustomers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/show-all-customers');
            setCustomers(res.data.customers);
            setFilteredCustomers(res.data.customers);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleChange = (e) => {
        setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/insert-customer', newCustomer);
            fetchCustomers();
            setNewCustomer({
                CustomerName: '',
                CustomerEmail: '',
                CustomerPhoneNumber: '',
                CustomerAddress: '',
            });
            showNotification('Customer added successfully!', 'success');
        } catch (error) {
            console.error('Error adding customer:', error);
            showNotification('Failed to add customer!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.post('http://localhost:5000/api/delete-customer', { CustomerID: id });
            fetchCustomers();
            showNotification('Customer deleted successfully!', 'success');
        } catch (error) {
            console.error('Error deleting customer:', error);
            showNotification('Failed to delete customer!', 'error');
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        const filtered = customers.filter((customer) =>
            customer.CustomerName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCustomers(filtered);
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
                <h1 className="page-title">Customers Management</h1>

                <div className="add-customer-form">
                    <h2>Add New Customer</h2>
                    <form onSubmit={handleAddCustomer}>
                        <input type="text" name="CustomerName" placeholder="Name" value={newCustomer.CustomerName} onChange={handleChange} required />
                        <input type="email" name="CustomerEmail" placeholder="Email" value={newCustomer.CustomerEmail} onChange={handleChange} required />
                        <input type="text" name="CustomerPhoneNumber" placeholder="Phone Number" value={newCustomer.CustomerPhoneNumber} onChange={handleChange} required />
                        <textarea name="CustomerAddress" placeholder="Address" value={newCustomer.CustomerAddress} onChange={handleChange} required />
                        <button type="submit">
                            {loading ? <span className="loading-spinner"></span> : 'Add Customer'}
                        </button>
                    </form>
                </div>

                <div className="customer-table">
                    <h2>Customers List</h2>

                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />

                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.CustomerID}>
                                    <td>{customer.CustomerID}</td>
                                    <td>{customer.CustomerName}</td>
                                    <td>{customer.CustomerEmail}</td>
                                    <td>{customer.CustomerPhoneNumber}</td>
                                    <td>{customer.CustomerAddress}</td>
                                    <td>
                                        <button onClick={() => handleDelete(customer.CustomerID)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {filteredCustomers.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>No Customers Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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

export default Customers;
