import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';
import '../styles/users.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newUser, setNewUser] = useState({
        userName: '',
        userPassword: '',
        userEmail: '',
        userRole: '',
    });
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();



    const handleNavigation = (path) => navigate(path);
    const handleLogout = () => {
        // Add logout functionality if needed
        navigate('/login');
    };


    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users');
            setUsers(res.data.users);
            setFilteredUsers(res.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/insert-user', newUser);
            fetchUsers();
            setNewUser({
                userName: '',
                userPassword: '',
                userEmail: '',
                userRole: '',
            });
            showNotification('User added successfully!', 'success');
        } catch (error) {
            console.error('Error adding user:', error);
            showNotification('Failed to add user!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.post('http://localhost:5000/api/Delete-User', { userid: id });
            fetchUsers();
            showNotification('User deleted successfully!', 'success');
        } catch (error) {
            console.error('Error deleting user:', error);
            showNotification('Failed to delete user!', 'error');
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        const filtered = users.filter((user) =>
            user.UserName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
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
                <h1>Users Management</h1>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search users by name..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                <form className="add-user-form" onSubmit={handleAddUser}>
                    <input type="text" name="userName" placeholder="Name" value={newUser.userName} onChange={handleChange} required />
                    <input type="email" name="userEmail" placeholder="Email" value={newUser.userEmail} onChange={handleChange} required />
                    <input type="password" name="userPassword" placeholder="Password" value={newUser.userPassword} onChange={handleChange} required />
                    <input type="text" name="userRole" placeholder="Role" value={newUser.userRole} onChange={handleChange} required />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add User'}
                    </button>
                </form>

                {notification && (
                    <div className={`notification ${notification.type}`}>
                        {notification.message}
                    </div>
                )}

                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.UserID}>
                                <td>{user.UserID}</td>
                                <td>{user.UserName}</td>
                                <td>{user.UserEmail}</td>
                                <td>{user.UserRole}</td>
                                <td>
                                    <button className="delete-btn" onClick={() => handleDelete(user.UserID)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    );
};

export default Users;
