import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';
import '../styles/products.css';

const Products = () => {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productCategory, setProductCategory] = useState('');  // This will store the selected category ID
    const [productSupplier, setProductSupplier] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productStockQuantity, setProductStockQuantity] = useState('');
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleNavigation = (route) => navigate(route);

    useEffect(() => {
        fetchCategories(); // Fetch categories when the component mounts
        fetchSuppliers(); // Fetch suppliers when the component mounts
    }, []);

    const fetchSuppliers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/get-all-supplier');
            setSuppliers(res.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            setErrorMessage('Failed to fetch suppliers.');
        }
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/categories');
            if (res.data && res.data.data) {
                setCategories(res.data.data);  // Set categories to the fetched data
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
            setErrorMessage('Failed to fetch categories.');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const productData = {
            ProductName: productName,
            ProductDescription: productDescription,
            ProductCategoryID: productCategory,  // Pass selected category ID
            ProductSupplierID: productSupplier,
            ProductPrice: parseFloat(productPrice),
            ProductStockQuantity: parseInt(productStockQuantity),
        };

        try {
            setLoading(true);
            const res = await axios.post('http://localhost:5000/api/insert-product', productData);
            if (res.data.success) {
                showNotification('Product added successfully!', 'success');
                // Reset form fields
                setProductName('');
                setProductDescription('');
                setProductCategory('');
                setProductSupplier('');
                setProductPrice('');
                setProductStockQuantity('');
            } else {
                setErrorMessage('Failed to add product.');
                showNotification('Failed to add product!', 'error');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            setErrorMessage('Internal server error.');
            showNotification('Internal server error.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        // Add logout functionality if needed
        navigate('/login');
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
                <h1 className="page-title">Add New Product</h1>

                {notification && (
                    <div className={`notification ${notification.type}`}>
                        {notification.message}
                    </div>
                )}

                <form className="add-product-form" onSubmit={handleAddProduct}>
                    <div className="form-group">
                        <label>Product Name</label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            value={productCategory}
                            onChange={(e) => setProductCategory(e.target.value)}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Supplier</label>
                        <select
                            value={productSupplier}
                            onChange={(e) => setProductSupplier(e.target.value)}
                            required
                        >
                            <option value="">Select a supplier</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Price</label>
                        <input
                            type="number"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Stock Quantity</label>
                        <input
                            type="number"
                            value={productStockQuantity}
                            onChange={(e) => setProductStockQuantity(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Adding Product...' : 'Add Product'}
                    </button>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default Products;
