import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { customersAPI } from '../services/api';

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchCustomerDetails();
  }, [id]);

  const fetchCustomerDetails = async () => {
    try {
      const response = await customersAPI.getCustomerById(id);
      if (response.success) {
        setCustomer(response.data.customer);
        setRentals(response.data.rentals || []);
      }
    } catch (error) {
      console.log('error:', error);
    }
    setLoading(false);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleReturnRental = async (rental) => {
    if (!window.confirm(`Mark "${rental.title}" as returned?`)) {
      return;
    }

    try {
      const response = await customersAPI.returnRental(rental.rental_id);
      if (response.success) {
        showNotification('Movie returned successfully!', 'success');
        fetchCustomerDetails();
      } else {
        showNotification(response.message || 'Failed to return movie', 'error');
      }
    } catch (error) {
      console.log('error:', error);
      const errorMessage = error.response?.data?.message || 'Error processing return';
      showNotification(errorMessage, 'error');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return <div className="loading">Loading customer details...</div>;
  }

  if (!customer) {
    return (
      <div className="header">
        <h1>Customer Not Found</h1>
        <button className="btn" onClick={() => navigate('/customers')}>
          Back to Customers
        </button>
      </div>
    );
  }

  const activeRentals = rentals.filter(r => !r.return_date);
  const pastRentals = rentals.filter(r => r.return_date);

  return (
    <div>
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="header">
        <h1>👤 Customer Details</h1>
        <button className="btn-secondary" onClick={() => navigate('/customers')}>
          ← Back to Customers
        </button>
      </div>

      <div className="card" style={{ marginBottom: '30px' }}>
        <h2>{customer.first_name} {customer.last_name}</h2>
        <div className="customer-details-grid">
          <div className="detail-item">
            <strong>Customer ID:</strong> {customer.customer_id}
          </div>
          <div className="detail-item">
            <strong>Email:</strong> {customer.email}
          </div>
          <div className="detail-item">
            <strong>Status:</strong> 
            <span className={`status-badge ${customer.active ? 'active' : 'inactive'}`} style={{ marginLeft: '10px' }}>
              {customer.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      <div className="rental-section">
        <h2>🎬 Active Rentals ({activeRentals.length})</h2>
        {activeRentals.length === 0 ? (
          <div className="card">
            <p style={{ color: '#858585', textAlign: 'center', padding: '20px' }}>
              No active rentals
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Rental ID</th>
                  <th>Film Title</th>
                  <th>Rental Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeRentals.map(rental => {
                  const rentalDate = new Date(rental.rental_date);
                  const dueDate = new Date(rentalDate);
                  dueDate.setDate(dueDate.getDate() + 7);
                  const isOverdue = new Date() > dueDate;

                  return (
                    <tr key={rental.rental_id}>
                      <td>{rental.rental_id}</td>
                      <td>
                        <Link to={`/films/${rental.film_id}`} style={{ color: '#4a9eff' }}>
                          {rental.title}
                        </Link>
                      </td>
                      <td>{formatDate(rental.rental_date)}</td>
                      <td>{formatDate(dueDate)}</td>
                      <td>
                        <span className={`status-badge ${isOverdue ? 'overdue' : 'active'}`}>
                          {isOverdue ? 'Overdue' : 'Active'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-small btn-return"
                          onClick={() => handleReturnRental(rental)}
                        >
                          Mark as Returned
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rental-section" style={{ marginTop: '30px' }}>
        <h2>📚 Rental History ({pastRentals.length})</h2>
        {pastRentals.length === 0 ? (
          <div className="card">
            <p style={{ color: '#858585', textAlign: 'center', padding: '20px' }}>
              No past rentals
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Rental ID</th>
                  <th>Film Title</th>
                  <th>Rental Date</th>
                  <th>Return Date</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {pastRentals.map(rental => {
                  const rentalDate = new Date(rental.rental_date);
                  const returnDate = new Date(rental.return_date);
                  const durationDays = Math.ceil((returnDate - rentalDate) / (1000 * 60 * 60 * 24));

                  return (
                    <tr key={rental.rental_id}>
                      <td>{rental.rental_id}</td>
                      <td>
                        <Link to={`/films/${rental.film_id}`} style={{ color: '#4a9eff' }}>
                          {rental.title}
                        </Link>
                      </td>
                      <td>{formatDate(rental.rental_date)}</td>
                      <td>{formatDate(rental.return_date)}</td>
                      <td>{durationDays} day{durationDays !== 1 ? 's' : ''}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerDetails;

