import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';
import '../styles/products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newProduct, setNewProduct] = useState({
        ProductName: '',
        ProductDescription: '',
        ProductCategoryID: '',
        ProductPrice: '',
        ProductStockQuantity: '',
        ProductReorderThreshold: 5,
        ProductExpiryDate: ''
    });
    const [editingPrice, setEditingPrice] = useState({});
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
   
    const handleNavigation = (path) => navigate(path);
    const handleLogout = () => {
        // Add logout functionality if needed
        navigate('/login');
    };

    // Fetch products and categories
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/get-all-products'),
                    axios.get('http://localhost:5000/api/categories')
                ]);
                const productsData = productsRes.data?.products || [];
                const categoriesData = categoriesRes.data?.data || [];
                setProducts(productsData);
                setCategories(categoriesData);
                setFilteredProducts(productsData);
            } catch (error) {
                console.error('Error fetching data:', error);
                showNotification('Failed to load data.', 'error');
            }
        };

        fetchProducts();
    }, []);  // Empty dependency array ensures this runs only once

    // Notification display
    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Handle form input changes
    const handleChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    // Add new product
    const handleAddProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/insert-product', newProduct);
            const addedProduct = res.data?.product;
            if (addedProduct) {
                const updatedProducts = [...products, addedProduct];
                setProducts(updatedProducts);
                setFilteredProducts(updatedProducts);
                setNewProduct({
                    ProductName: '',
                    ProductDescription: '',
                    ProductCategoryID: '',
                    ProductPrice: '',
                    ProductStockQuantity: '',
                    ProductReorderThreshold: 5,
                    ProductExpiryDate: ''
                });
                showNotification('Product added successfully!', 'success');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            showNotification('Failed to add product.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Search filtering
    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        const filtered = products.filter(p =>
            p.ProductName?.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    // Update product price
    const handlePriceChange = (ProductID, value) => {
        setEditingPrice(prev => ({ ...prev, [ProductID]: value }));
    };

    const updateProductPrice = async (ProductID) => {
        const newPrice = editingPrice[ProductID];
        if (!newPrice) return;
        try {
            await axios.post('http://localhost:5000/api/update-product-price', { ProductID, ProductPrice: newPrice });
            const updatedProducts = products.map(p =>
                p.ProductID === ProductID ? { ...p, ProductPrice: newPrice } : p
            );
            setProducts(updatedProducts);
            setFilteredProducts(updatedProducts);
            showNotification('Product price updated successfully!', 'success');
        } catch (error) {
            console.error('Error updating price:', error);
            showNotification('Failed to update price.', 'error');
        }
    };

    // Delete product
    const deleteProduct = async (ProductID) => {
        try {
            await axios.post('http://localhost:5000/api/delete-product', { ProductID });
            const updatedProducts = products.filter(p => p.ProductID !== ProductID);
            setProducts(updatedProducts);
            setFilteredProducts(updatedProducts);
            showNotification('Product deleted successfully!', 'success');
        } catch (error) {
            console.error('Error deleting product:', error);
            showNotification('Failed to delete product.', 'error');
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
                <h1>Product Management</h1>

                {notification && (
                    <div className={`notification ${notification.type}`}>
                        {notification.message}
                    </div>
                )}

                {/* Add Product Form */}
                <form className="add-product-form" onSubmit={handleAddProduct}>
                    <h2>Add New Product</h2>
                    <input type="text" name="ProductName" placeholder="Product Name" value={newProduct.ProductName} onChange={handleChange} required />
                    <input type="text" name="ProductDescription" placeholder="Description" value={newProduct.ProductDescription} onChange={handleChange} required />
                    <select name="ProductCategoryID" value={newProduct.ProductCategoryID} onChange={handleChange} required>
                        <option value="">Select Category</option>
                        {categories.map(c => (
                            <option key={c.categoryid} value={c.categoryid}>{c.categoryname}</option>
                        ))}
                    </select>
                    <input type="number" name="ProductPrice" placeholder="Price" value={newProduct.ProductPrice} onChange={handleChange} required min="0" step="0.01" />
                    <input type="number" name="ProductStockQuantity" placeholder="Stock Quantity" value={newProduct.ProductStockQuantity} onChange={handleChange} required min="0" />
                    <input type="number" name="ProductReorderThreshold" placeholder="Reorder Threshold" value={newProduct.ProductReorderThreshold} onChange={handleChange} min="0" />
                    <input type="date" name="ProductExpiryDate" value={newProduct.ProductExpiryDate} onChange={handleChange} />
                    <button type="submit" disabled={loading}>{loading ? <span className="loading-spinner"></span> : 'Add Product'}</button>
                </form>

                {/* Search */}
                <div className="search-input">
                    <input type="text" placeholder="Search Products" value={searchTerm} onChange={handleSearchChange} />
                </div>

                {/* Product Table */}
                <div className="product-table">
                    <h2>Products List</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Price ($)</th>
                                <th>Stock</th>
                                <th>Reorder</th>
                                <th>Expiry</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(p => (
                                    p.ProductID ? (  // Check if ProductID exists before rendering
                                        <tr key={p.ProductID}>
                                            <td>{p.ProductID}</td>
                                            <td>{p.ProductName}</td>
                                            <td>{p.ProductDescription}</td>
                                            <td>{p.ProductCategoryID}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={editingPrice[p.ProductID] !== undefined ? editingPrice[p.ProductID] : p.ProductPrice}
                                                    onChange={(e) => handlePriceChange(p.ProductID, e.target.value)}
                                                    style={{ width: '70px' }}
                                                />
                                            </td>
                                            <td>{p.ProductStockQuantity}</td>
                                            <td>{p.ProductReorderThreshold}</td>
                                            <td>{p.ProductExpiryDate ? new Date(p.ProductExpiryDate).toLocaleDateString() : 'N/A'}</td>
                                            <td>
                                                <button onClick={() => updateProductPrice(p.ProductID)}>Update</button>
                                                <button onClick={() => deleteProduct(p.ProductID)}>Delete</button>
                                            </td>
                                        </tr>
                                    ) : null
                                ))
                            ) : (
                                <tr><td colSpan="9" style={{ textAlign: 'center' }}>No Products Found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Products;
