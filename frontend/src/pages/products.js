import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';
import '../styles/products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newProduct, setNewProduct] = useState({
        ProductName: '',
        ProductDescription: '',
        ProductCategoryID: '',
        ProductPrice: '',
        ProductStockQuantity: '',
        ProductReorderThreshold: 5,
        ProductExpiryDate: '',
        ProductOrderId: ''
    });
    const [editingPrice, setEditingPrice] = useState({});
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes, ordersRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/get-all-products'),
                    axios.get('http://localhost:5000/api/categories'),
                    axios.get('http://localhost:5000/api/show-all-orders')
                ]);
                const productsData = productsRes.data?.products || [];
                const categoriesData = categoriesRes.data?.data || [];
                const ordersData = ordersRes.data?.orders || [];

                setProducts(productsData);
                setCategories(categoriesData);
                setOrders(ordersData);
                setFilteredProducts(productsData);
            } catch (error) {
                console.error('Error fetching data:', error);
                showNotification('Failed to load data.', 'error');
            }
        };

        fetchData();
    }, []);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleNavigation = (path) => navigate(path);
    const handleLogout = () => navigate('/login');

    const handleChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/insert-product', newProduct);
            const addedProduct = response.data?.product || response.data?.newProduct;
            if (addedProduct) {
                const updatedList = [...products, addedProduct];
                setProducts(updatedList);
                setFilteredProducts(updatedList);
                setNewProduct({
                    ProductName: '',
                    ProductDescription: '',
                    ProductCategoryID: '',
                    ProductPrice: '',
                    ProductStockQuantity: '',
                    ProductReorderThreshold: 5,
                    ProductExpiryDate: '',
                    ProductOrderId: ''
                });
                showNotification('Product added successfully!', 'success');
            } else {
                showNotification('Product added successfully!', 'success');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            showNotification('Failed to add product.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        const filtered = products.filter(p =>
            p.ProductName?.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handlePriceChange = (ProductID, value) => {
        setEditingPrice(prev => ({ ...prev, [ProductID]: value }));
    };

    const updateProductPrice = async (ProductID) => {
        const newPrice = editingPrice[ProductID];
        if (!newPrice) return;
        try {
            await axios.post('http://localhost:5000/api/update-product-price', {
                ProductID,
                ProductPrice: newPrice
            });
            const updatedList = products.map(p =>
                p.ProductID === ProductID ? { ...p, ProductPrice: newPrice } : p
            );
            setProducts(updatedList);
            setFilteredProducts(updatedList);
            showNotification('Product price updated successfully!', 'success');
        } catch (error) {
            console.error('Error updating price:', error);
            showNotification('Failed to update price.', 'error');
        }
    };

    const deleteProduct = async (ProductID) => {
        try {
            await axios.post('http://localhost:5000/api/delete-product', { ProductID });
            const updatedList = products.filter(p => p.ProductID !== ProductID);
            setProducts(updatedList);
            setFilteredProducts(updatedList);
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
                <h1>Product Management</h1>

                {notification && (
                    <div className={`notification ${notification.type}`}>
                        {notification.message}
                    </div>
                )}

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
                    <select name="ProductOrderId" value={newProduct.ProductOrderId} onChange={handleChange} required>
                        <option value="">Select Order</option>
                        {orders.map(o => (
                            <option key={o.OrderID} value={o.OrderID}>{o.OrderID}</option>
                        ))}
                    </select>
                    <input type="number" name="ProductPrice" placeholder="Price" value={newProduct.ProductPrice} onChange={handleChange} required />
                    <input type="number" name="ProductStockQuantity" placeholder="Stock Quantity" value={newProduct.ProductStockQuantity} onChange={handleChange} required />
                    <input type="number" name="ProductReorderThreshold" placeholder="Reorder Threshold" value={newProduct.ProductReorderThreshold} onChange={handleChange} />
                    <input type="date" name="ProductExpiryDate" value={newProduct.ProductExpiryDate} onChange={handleChange} />
                    <button type="submit" disabled={loading}>
                        {loading ? <span className="loading-spinner"></span> : 'Add Product'}
                    </button>
                </form>

                <div className="search-input">
                    <input type="text" placeholder="Search Products" value={searchTerm} onChange={handleSearchChange} />
                </div>

                <div className="product-table">
                    <h2>Products List</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Reorder</th>
                                <th>Expiry</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(p => (
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
                                ))
                            ) : (
                                <tr><td colSpan="9">No Products Found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Products;
