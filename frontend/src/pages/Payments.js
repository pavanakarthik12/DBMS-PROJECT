import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingPayment, setUpdatingPayment] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPayments();
      
      if (response.data.success) {
        setPayments(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Failed to fetch payments data');
      console.error('Payments error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentId, status) => {
    try {
      setUpdatingPayment(paymentId);
      const response = await adminAPI.updatePayment(paymentId, { status });
      
      if (response.data.success) {
        // Refresh payments data
        await fetchPayments();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Failed to update payment');
      console.error('Update payment error:', error);
    } finally {
      setUpdatingPayment(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not paid';
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const getPaymentStatusColor = (payment) => {
    if (payment.status === 'Paid') return '#28a745';
    if (isOverdue(payment.deadline)) return '#dc3545';
    return '#ffc107';
  };

  if (loading) {
    return <div className="loading">Loading payments...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const totalPayments = payments.length;
  const paidPayments = payments.filter(p => p.status === 'Paid').length;
  const unpaidPayments = payments.filter(p => p.status === 'Unpaid').length;
  const overduePayments = payments.filter(p => p.status === 'Unpaid' && isOverdue(p.deadline)).length;
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="dashboard">
      <h1>Payment Management</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{totalPayments}</div>
          <div className="stat-label">Total Payments</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number" style={{color: '#28a745'}}>{paidPayments}</div>
          <div className="stat-label">Paid</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number" style={{color: '#ffc107'}}>{unpaidPayments}</div>
          <div className="stat-label">Unpaid</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number" style={{color: '#dc3545'}}>{overduePayments}</div>
          <div className="stat-label">Overdue</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">₹{totalAmount.toLocaleString()}</div>
          <div className="stat-label">Total Amount</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number" style={{color: '#28a745'}}>₹{paidAmount.toLocaleString()}</div>
          <div className="stat-label">Amount Collected</div>
        </div>
      </div>

      <div className="data-table">
        <h3>Payment Details</h3>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Room</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Deadline</th>
                <th>Payment Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => {
                const overdue = isOverdue(payment.deadline);
                
                return (
                  <tr key={payment.payment_id} style={{
                    backgroundColor: overdue && payment.status === 'Unpaid' ? '#fff5f5' : 'transparent'
                  }}>
                    <td>
                      <strong>{payment.name}</strong>
                      {overdue && payment.status === 'Unpaid' && (
                        <span style={{color: '#dc3545', fontSize: '12px', display: 'block'}}>
                          OVERDUE
                        </span>
                      )}
                    </td>
                    <td>{payment.email}</td>
                    <td>{payment.room_number || 'No room'}</td>
                    <td>
                      <strong>₹{payment.amount.toLocaleString()}</strong>
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{
                          backgroundColor: getPaymentStatusColor(payment) + '20',
                          color: getPaymentStatusColor(payment),
                          border: `1px solid ${getPaymentStatusColor(payment)}`
                        }}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        color: overdue && payment.status === 'Unpaid' ? '#dc3545' : 'inherit',
                        fontWeight: overdue && payment.status === 'Unpaid' ? 'bold' : 'normal'
                      }}>
                        {formatDate(payment.deadline)}
                      </span>
                    </td>
                    <td>{formatDate(payment.payment_date)}</td>
                    <td>
                      {payment.status === 'Unpaid' ? (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => updatePaymentStatus(payment.payment_id, 'Paid')}
                          disabled={updatingPayment === payment.payment_id}
                        >
                          {updatingPayment === payment.payment_id ? 'Updating...' : 'Mark Paid'}
                        </button>
                      ) : (
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => updatePaymentStatus(payment.payment_id, 'Unpaid')}
                          disabled={updatingPayment === payment.payment_id}
                        >
                          {updatingPayment === payment.payment_id ? 'Updating...' : 'Mark Unpaid'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-grid">
        <div className="card">
          <h3>Payment Summary</h3>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
            <span>Collection Rate:</span>
            <span style={{fontWeight: 'bold'}}>
              {Math.round((paidPayments / totalPayments) * 100)}%
            </span>
          </div>
          
          <div style={{
            width: '100%',
            height: '12px',
            backgroundColor: '#e9ecef',
            borderRadius: '6px',
            overflow: 'hidden',
            marginBottom: '15px'
          }}>
            <div style={{
              width: `${(paidPayments / totalPayments) * 100}%`,
              height: '100%',
              backgroundColor: '#28a745',
              transition: 'width 0.3s ease'
            }} />
          </div>
          
          <div style={{fontSize: '14px', color: '#6c757d'}}>
            <p>Pending Amount: ₹{(totalAmount - paidAmount).toLocaleString()}</p>
            <p>Average Payment: ₹{Math.round(totalAmount / totalPayments).toLocaleString()}</p>
          </div>
        </div>

        <div className="card">
          <h3>Overdue Payments</h3>
          {overduePayments > 0 ? (
            <div>
              <p style={{color: '#dc3545', fontWeight: 'bold', marginBottom: '15px'}}>
                {overduePayments} payments are overdue
              </p>
              {payments
                .filter(p => p.status === 'Unpaid' && isOverdue(p.deadline))
                .slice(0, 3)
                .map(payment => (
                  <div key={payment.payment_id} style={{
                    padding: '10px',
                    backgroundColor: '#fff5f5',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    border: '1px solid #fecaca'
                  }}>
                    <strong>{payment.name}</strong>
                    <div style={{fontSize: '14px', color: '#6c757d'}}>
                      ₹{payment.amount} - Due: {formatDate(payment.deadline)}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p style={{color: '#28a745'}}>No overdue payments! 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;