import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customersAPI } from '../services/api';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    active: true
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const customersPerPage = 20;

  useEffect(() => {
    getCustomers();
  }, [currentPage]);

  const getCustomers = async () => {
    setLoading(true);
    try {
      const response = await customersAPI.getAllCustomers(currentPage, customersPerPage);
      if (response.success) {
        setCustomers(response.data);
        setTotalCustomers(response.total || response.data.length);
      }
    } catch (error) {
      console.log('error:', error);
    }
    setLoading(false);
  };

  const searchCustomers = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      const response = await customersAPI.searchCustomers(searchQuery);
      if (response.success) {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.log('error:', error);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      active: true
    });
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      first_name: customer.first_name || '',
      last_name: customer.last_name || '',
      email: customer.email || '',
      active: customer.active !== undefined ? customer.active : true
    });
    setShowEditModal(true);
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name || !formData.email) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    try {
      const response = await customersAPI.addCustomer(formData);
      if (response.success) {
        showNotification('Customer added successfully!', 'success');
        setShowAddModal(false);
        resetForm();
        getCustomers();
      } else {
        showNotification(response.message || 'Failed to add customer', 'error');
      }
    } catch (error) {
      console.log('error:', error);
      showNotification('Error adding customer', 'error');
    }
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name || !formData.email) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    try {
      const response = await customersAPI.updateCustomer(selectedCustomer.customer_id, formData);
      if (response.success) {
        showNotification('Customer updated successfully!', 'success');
        setShowEditModal(false);
        setSelectedCustomer(null);
        resetForm();
        getCustomers();
      } else {
        showNotification(response.message || 'Failed to update customer', 'error');
      }
    } catch (error) {
      console.log('error:', error);
      showNotification('Error updating customer', 'error');
    }
  };

  const handleDeleteCustomer = async (customerId, customerName) => {
    if (!window.confirm(`Are you sure you want to delete ${customerName}?`)) {
      return;
    }

    try {
      const response = await customersAPI.deleteCustomer(customerId);
      if (response.success) {
        showNotification('Customer deleted successfully!', 'success');
        getCustomers();
      } else {
        showNotification(response.message || 'Failed to delete customer', 'error');
      }
    } catch (error) {
      console.log('error:', error);
      showNotification('Error deleting customer', 'error');
    }
  };

  const totalPages = Math.ceil(totalCustomers / customersPerPage);
  const currentCustomers = searchResults.length > 0 ? searchResults : customers;

  if (loading && !customers.length) {
    return <div className="loading">Loading customers...</div>;
  }

  return (
    <div>
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="header">
        <h1>👥 Customer Management</h1>
        <p>Manage customer information and rental history</p>
      </div>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by customer ID, first name, or last name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchCustomers()}
        />
        <button className="btn" onClick={searchCustomers}>Search</button>
                <button className="btn" onClick={openAddModal}>
          Add Customer
        </button>
        {searchResults.length > 0 && (
          <button className="btn-secondary" onClick={() => {
            setSearchResults([]);
            setSearchQuery('');
          }}>
            Clear Search
          </button>
        )}
      </div>

      {searchResults.length > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '20px', color: '#858585' }}>
          Found {searchResults.length} customers matching "{searchQuery}"
        </div>
      )}

      <div className="table-container">
        <table className="customer-table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map(customer => (
              <tr key={customer.customer_id}>
                <td>{customer.customer_id}</td>
                <td>{customer.first_name} {customer.last_name}</td>
                <td>{customer.email}</td>
                <td>
                  <span className={`status-badge ${customer.active ? 'active' : 'inactive'}`}>
                    {customer.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/customers/${customer.customer_id}`}>
                      <button className="btn-small">View Details</button>
                    </Link>
                    <button 
                      className="btn-small btn-edit" 
                      onClick={() => openEditModal(customer)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-small btn-delete" 
                      onClick={() => handleDeleteCustomer(customer.customer_id, `${customer.first_name} ${customer.last_name}`)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentCustomers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#858585' }}>
            No customers found
          </div>
        )}
      </div>

      {searchResults.length === 0 && totalPages > 1 && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button 
            className="btn-secondary" 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{ marginRight: '10px' }}
          >
            Previous
          </button>
          <span style={{ color: '#858585', margin: '0 20px' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="btn-secondary" 
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Customer</h2>
            <form onSubmit={handleAddCustomer}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    style={{ width: 'auto' }}
                  />
                  Active
                </label>
              </div>

              <div className="modal-buttons">
                <button type="submit" className="btn">Add Customer</button>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && selectedCustomer && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Customer</h2>
            <form onSubmit={handleUpdateCustomer}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    style={{ width: 'auto' }}
                  />
                  Active
                </label>
              </div>

              <div className="modal-buttons">
                <button type="submit" className="btn">Update Customer</button>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;

