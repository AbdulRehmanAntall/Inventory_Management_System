import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../UserContext';
import '../styles/Dashboard.css';
import '../styles/suppliers.css';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newSupplier, setNewSupplier] = useState({
        SupplierName: '',
        SupplierContactPerson: '',
        SupplierEmail: '',
        SupplierPhoneNumber: '',
        SupplierAddress: '',
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

    const fetchSuppliers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/get-all-supplier');
            setSuppliers(res.data);
            setFilteredSuppliers(res.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleChange = (e) => {
        setNewSupplier({ ...newSupplier, [e.target.name]: e.target.value });
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const handleAddSupplier = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/insert-new-supplier', newSupplier);
            fetchSuppliers();
            setNewSupplier({
                SupplierName: '',
                SupplierContactPerson: '',
                SupplierEmail: '',
                SupplierPhoneNumber: '',
                SupplierAddress: '',
            });
            showNotification('Vendor added successfully!', 'success');
        } catch (error) {
            console.error('Error adding supplier:', error);
            showNotification('Failed to add vendor!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.post('http://localhost:5000/api/delete-Supplier', { SupplierID: id });
            fetchSuppliers();
            showNotification('Vendor deleted successfully!', 'success');
        } catch (error) {
            console.error('Error deleting supplier:', error);
            showNotification('Failed to delete vendor!', 'error');
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        const filtered = suppliers.filter((supplier) =>
            supplier.SupplierName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuppliers(filtered);
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
                        <li className="active">Vendors</li>
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
                <h1 className="page-title">Vendors Management</h1>

                <div className="add-supplier-form">
                    <h2>Add New Vendor</h2>
                    <form onSubmit={handleAddSupplier}>
                        <input type="text" name="SupplierName" placeholder="Name" value={newSupplier.SupplierName} onChange={handleChange} required />
                        <input type="text" name="SupplierContactPerson" placeholder="Contact Person" value={newSupplier.SupplierContactPerson} onChange={handleChange} required />
                        <input type="email" name="SupplierEmail" placeholder="Email" value={newSupplier.SupplierEmail} onChange={handleChange} required />
                        <input type="text" name="SupplierPhoneNumber" placeholder="Phone Number" value={newSupplier.SupplierPhoneNumber} onChange={handleChange} required />
                        <textarea name="SupplierAddress" placeholder="Address" value={newSupplier.SupplierAddress} onChange={handleChange} required />
                        <button type="submit">
                            {loading ? <span className="loading-spinner"></span> : 'Add Vendor'}
                        </button>
                    </form>
                </div>

                <div className="supplier-table">
                    <h2>Vendors List</h2>

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
                                <th>Contact Person</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Performance Rating</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSuppliers.map((supplier) => (
                                <tr key={supplier.SupplierID}>
                                    <td>{supplier.SupplierID}</td>
                                    <td>{supplier.SupplierName}</td>
                                    <td>{supplier.SupplierContactPerson}</td>
                                    <td>{supplier.SupplierEmail}</td>
                                    <td>{supplier.SupplierPhoneNumber}</td>
                                    <td>{supplier.SupplierAddress}</td>
                                    <td>{supplier.SupplierPerformanceRating}</td>
                                    <td>
                                        <button onClick={() => handleDelete(supplier.SupplierID)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {filteredSuppliers.length === 0 && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center' }}>No Vendors Found</td>
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

export default Suppliers;
