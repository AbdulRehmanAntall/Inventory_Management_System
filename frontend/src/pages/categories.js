import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import '../styles/Dashboard.css';
import '../styles/categories.css';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ categoryname: '', categorydescription: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);  // Set initial loading state to true

    const navigate = useNavigate();
    const { logout } = useUser();

    // Function to fetch categories from the API
    const fetchCategories = async () => {
        setLoading(true);  // Set loading to true when data is being fetched
        try {
            const res = await axios.get('http://localhost:5000/api/categories');  // Your API endpoint
            console.log('Fetched categories:', res.data.data);  // Debugging log to check the response structure

            if (res.data && res.data.data) {
                setCategories(res.data.data);  // Set the fetched categories data into state
            } else {
                setCategories([]);  // Handle empty or missing data
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);  // Handle error gracefully by setting empty categories
        } finally {
            setLoading(false);  // Set loading to false once data is fetched or an error occurs
        }
    };

    useEffect(() => {
        fetchCategories();  // Call the fetch function when the component mounts
    }, []);

    // Handle input changes for the form fields
    const handleChange = (e) => {
        setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
    };

    // Display notification messages
    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);  // Hide notification after 3 seconds
    };

    // Handle adding a new category
    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/insert-category', newCategory);  // Post the new category to the API
            fetchCategories();  // Fetch the updated categories list
            setNewCategory({ categoryname: '', categorydescription: '' });  // Reset form
            showNotification('Category added successfully!', 'success');
        } catch (error) {
            console.error('Error adding category:', error);
            showNotification('Failed to add category.', 'error');
        }
    };

    // Handle category deletion
    const handleDelete = async (id) => {
        try {
            await axios.post('http://localhost:5000/api/delete-category', { categoryid: id });  // Delete the category via API
            fetchCategories();  // Fetch the updated categories list
            showNotification('Category deleted successfully!', 'success');
        } catch (error) {
            console.error('Error deleting category:', error);
            showNotification('Failed to delete category.', 'error');
        }
    };

    // Filter categories based on search term
    const filteredCategories = categories.filter((cat) =>
        (cat.categoryname || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle navigation between pages
    const handleNavigation = (path) => navigate(path);
    const handleLogout = () => {
        logout();  // Logout user
        navigate('/');  // Redirect to home page
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
                <h1 className="page-title">Category Management</h1>

                <div className="add-category-form">
                    <h2>Add New Category</h2>
                    <form onSubmit={handleAddCategory}>
                        <input
                            type="text"
                            name="categoryname"
                            placeholder="Category Name"
                            value={newCategory.categoryname}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="categorydescription"
                            placeholder="Description"
                            value={newCategory.categorydescription}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">Add Category</button>
                    </form>
                </div>

                <div className="category-table">
                    <h2>Categories</h2>
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />

                    {loading ? (
                        <p style={{ textAlign: 'center' }}>Loading categories...</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.map((cat) => (
                                    <tr key={cat.categoryid}>
                                        <td>{cat.categoryid}</td>
                                        <td>{cat.categoryname}</td>
                                        <td>{cat.categorydescription}</td>
                                        <td>
                                            <button onClick={() => handleDelete(cat.categoryid)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredCategories.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center' }}>No Categories Found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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

export default Category;
