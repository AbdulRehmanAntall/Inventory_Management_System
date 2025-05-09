import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';
import '../styles/orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [newOrder, setNewOrder] = useState({
        OrderSupplierID: '',
        OrderStatus: 'pending',
        OrderTotalCost: '',
    });
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        try {
            const [suppliersRes, ordersRes] = await Promise.all([
                axios.get('http://localhost:5000/api/get-all-supplier'),
                axios.get('http://localhost:5000/api/show-all-orders'),
            ]);
            setSuppliers(suppliersRes.data);
            setOrders(ordersRes.data.orders);
        } catch (error) {
            console.error('Error fetching data:', error);
            showNotification('Failed to load data.', 'error');
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleNavigation = (path) => navigate(path);
    const handleLogout = () => navigate('/login');

    const handleChange = (e) => {
        setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const handleAddOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/insert-order', newOrder);

            // Get supplier details for the selected supplier
            const selectedSupplier = suppliers.find(s => s.SupplierID === parseInt(newOrder.OrderSupplierID));
            if (selectedSupplier) {
                const emailPayload = {
                    supplierEmail: selectedSupplier.SupplierEmail,
                    supplierName: selectedSupplier.SupplierName,
                    Description: `The order total is $${newOrder.OrderTotalCost}. Please ensure all items are packed carefully and delivered as per our agreed terms.`
                };

                await axios.post('http://localhost:5000/api/send-order-email', emailPayload);
            }

            fetchData();
            setNewOrder({ OrderSupplierID: '', OrderStatus: 'pending', OrderTotalCost: '' });
            showNotification('Order added and email sent successfully!', 'success');
        } catch (error) {
            console.error('Error adding order:', error);
            showNotification('Failed to add order or send email!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderID, newStatus) => {
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/update-order-status', {
                OrderID: orderID,
                NewStatus: newStatus,
            });
            fetchData();
            showNotification('Order status updated successfully!', 'success');
        } catch (error) {
            console.error('Error updating order status:', error);
            showNotification('Failed to update order status!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrder = async (orderID) => {
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/delete-order', { OrderID: orderID });
            fetchData();
            showNotification('Order deleted successfully!', 'success');
        } catch (error) {
            console.error('Error deleting order:', error);
            showNotification('Failed to delete order!', 'error');
        } finally {
            setLoading(false);
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
                <h1 className="page-title">Orders Management</h1>

                <div className="add-order-form">
                    <h2>Add New Order</h2>
                    <form onSubmit={handleAddOrder}>
                        <select
                            name="OrderSupplierID"
                            value={newOrder.OrderSupplierID}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Supplier</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier.SupplierID} value={supplier.SupplierID}>
                                    {supplier.SupplierName}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            name="OrderTotalCost"
                            placeholder="Total Cost"
                            value={newOrder.OrderTotalCost}
                            onChange={handleChange}
                            required
                        />
                        <select
                            name="OrderStatus"
                            value={newOrder.OrderStatus}
                            onChange={handleChange}
                            required
                        >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <button type="submit">
                            {loading ? <span className="loading-spinner"></span> : 'Add Order'}
                        </button>
                    </form>
                </div>

                <div className="order-table">
                    <h2>Orders List</h2>

                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Supplier</th>
                                <th>Status</th>
                                <th>Total Cost</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.OrderID}>
                                        <td>{order.OrderID}</td>
                                        <td>{order.OrderSupplierID}</td>
                                        <td>{order.OrderStatus}</td>
                                        <td>{order.OrderTotalCost}</td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    handleUpdateStatus(order.OrderID, 'completed')
                                                }
                                            >
                                                Mark as Completed
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleUpdateStatus(order.OrderID, 'cancelled')
                                                }
                                            >
                                                Cancel Order
                                            </button>
                                            <button onClick={() => handleDeleteOrder(order.OrderID)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center' }}>
                                        No Orders Found
                                    </td>
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

export default Orders;
