import React, { useState, useEffect } from "react";
import { feeAPI, studentAPI } from "../services/api";

const Fees = () => {
  const [feeRecords, setFeeRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    studentId: "",
    amount: "",
    dueDate: "",
    paymentMethod: "",
    status: "DUE",
  });

  const [paymentData, setPaymentData] = useState({
    paymentMethod: "",
    paymentDate: new Date().toISOString().split("T")[0],
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [feesData, studentsData] = await Promise.all([
        feeAPI.getAllFeeRecords(),
        studentAPI.getAllStudents(),
      ]);
      setFeeRecords(feesData);
      setStudents(studentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      amount: "",
      dueDate: "",
      paymentMethod: "",
      status: "DUE",
    });
    setPaymentData({
      paymentMethod: "",
      paymentDate: new Date().toISOString().split("T")[0],
    });
    setSelectedFee(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await feeAPI.addFeeRecord(formData);
      await fetchData();
      setShowAddForm(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Update the fee record with payment information
      const updatedFee = {
        ...selectedFee,
        status: "PAID",
        paymentMethod: paymentData.paymentMethod,
        paymentDate: paymentData.paymentDate,
      };

      await feeAPI.updateFeeRecord(updatedFee);
      await fetchData();
      setShowPaymentForm(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (fee) => {
    setSelectedFee(fee);
    setPaymentData({
      paymentMethod: "",
      paymentDate: new Date().toISOString().split("T")[0],
    });
    setShowPaymentForm(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "#2e7d32";
      case "DUE":
        return "#ed6c02";
      case "OVERDUE":
        return "#d32f2f";
      default:
        return "#666";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PAID":
        return "✅";
      case "DUE":
        return "⏰";
      case "OVERDUE":
        return "🚨";
      default:
        return "❓";
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student ? student.name : "Unknown Student";
  };

  const filteredFees = feeRecords.filter((fee) => {
    const studentName = getStudentName(fee.studentId).toLowerCase();
    const matchesSearch =
      studentName.includes(searchTerm.toLowerCase()) ||
      fee.amount?.toString().includes(searchTerm);

    if (filterStatus === "all") return matchesSearch;
    return matchesSearch && fee.status === filterStatus.toUpperCase();
  });

  const getTotalAmount = (fees) => {
    return fees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
  };

  const getDueFees = () => feeRecords.filter((fee) => fee.status === "DUE");
  const getPaidFees = () => feeRecords.filter((fee) => fee.status === "PAID");
  const getOverdueFees = () =>
    feeRecords.filter((fee) => fee.status === "OVERDUE");

  if (loading && feeRecords.length === 0) {
    return (
      <div className="card">
        <h2>💰 Fee Management</h2>
        <p>Loading fee records...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">💰 Fee Management</h2>
          <p style={{ color: '#6c757d', margin: '0.5rem 0 0 0' }}>
            Track student fees, process payments, and manage financial records
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowAddForm(!showAddForm);
          }}
        >
          {showAddForm ? '❌ Cancel' : '➕ Add Fee Record'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
        <div className="summary-card">
          <h4>⏰ Due Fees</h4>
          <div className="amount">₹{getTotalAmount(getDueFees()).toLocaleString()}</div>
          <div className="count">{getDueFees().length} records</div>
        </div>
        
        <div className="summary-card">
          <h4>✅ Paid Fees</h4>
          <div className="amount">₹{getTotalAmount(getPaidFees()).toLocaleString()}</div>
          <div className="count">{getPaidFees().length} records</div>
        </div>
        
        <div className="summary-card">
          <h4>🚨 Overdue</h4>
          <div className="amount">₹{getTotalAmount(getOverdueFees()).toLocaleString()}</div>
          <div className="count">{getOverdueFees().length} records</div>
        </div>
      </div>

      {/* Add Fee Form */}
      {showAddForm && (
        <div className="form-section">
          <h3>➕ Add New Fee Record</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label>Student *</label>
                <select 
                  name="studentId" 
                  value={formData.studentId} 
                  onChange={handleInputChange} 
                  required
                  className="form-input"
                >
                  <option value="">Select Student</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} - Grade {student.grade}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Amount (₹) *</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="form-input"
                  placeholder="Enter fee amount"
                />
              </div>
              <div>
                <label>Due Date *</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="form-input">
                  <option value="DUE">Due</option>
                  <option value="PAID">Paid</option>
                  <option value="OVERDUE">Overdue</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Add Fee Record'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => {
                setShowAddForm(false);
                resetForm();
              }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment Form */}
      {showPaymentForm && selectedFee && (
        <div className="form-section" style={{ backgroundColor: '#e8f5e8', borderColor: '#a5d6a7' }}>
          <h3>💳 Record Payment</h3>
          <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'white', borderRadius: '8px' }}>
            <p><strong>Student:</strong> {getStudentName(selectedFee.studentId)}</p>
            <p><strong>Amount:</strong> ₹{selectedFee.amount}</p>
            <p><strong>Due Date:</strong> {new Date(selectedFee.dueDate).toLocaleDateString()}</p>
          </div>
          
          <form onSubmit={handlePaymentSubmit}>
            <div className="form-grid">
              <div>
                <label>Payment Method *</label>
                <select 
                  name="paymentMethod" 
                  value={paymentData.paymentMethod} 
                  onChange={handlePaymentInputChange} 
                  required
                  className="form-input"
                >
                  <option value="">Select Payment Method</option>
                  <option value="CASH">Cash</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="UPI">UPI</option>
                  <option value="CARD">Card</option>
                </select>
              </div>
              <div>
                <label>Payment Date</label>
                <input
                  type="date"
                  name="paymentDate"
                  value={paymentData.paymentDate}
                  onChange={handlePaymentInputChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Processing...' : 'Mark as Paid'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => {
                setShowPaymentForm(false);
                resetForm();
              }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="search-filter-container">
        <div className="search-input">
          <input
            type="text"
            placeholder="Search by student name or amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ width: '100%' }}
          />
        </div>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="form-input filter-select"
        >
          <option value="all">All Fees</option>
          <option value="due">Due</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
        <button className="btn btn-secondary" onClick={fetchData} disabled={loading}>
          🔄 Refresh
        </button>
      </div>

      {/* Fee Records List */}
      <div>
        <div className="card-header">
          <h3>📋 Fee Records ({filteredFees.length})</h3>
        </div>
        
        {filteredFees.length === 0 ? (
          <div className="empty-state">
            <h4>{searchTerm ? 'No fee records found' : 'No fee records yet'}</h4>
            <p>
              {searchTerm 
                ? 'Try adjusting your search terms or filters to find the fee record you\'re looking for.'
                : 'Start managing your finances by adding your first fee record to the system.'
              }
            </p>
            {!searchTerm && (
              <button 
                className="btn btn-primary" 
                onClick={() => setShowAddForm(true)}
                style={{ marginTop: '1rem' }}
              >
                ➕ Add Your First Fee Record
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-2">
            {filteredFees.map(fee => (
              <div key={fee.id} className="item-card">
                <div className="header">
                  <div>
                    <div className="title">{getStudentName(fee.studentId)}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2c3e50', marginTop: '0.5rem' }}>
                      ₹{fee.amount?.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    backgroundColor: getStatusColor(fee.status) + '20',
                    color: getStatusColor(fee.status),
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {getStatusIcon(fee.status)} {fee.status}
                  </div>
                </div>
                
                <div className="details">
                  <p><strong>📅 Due Date:</strong> {new Date(fee.dueDate).toLocaleDateString()}</p>
                  {fee.paymentDate && (
                    <p><strong>💳 Paid On:</strong> {new Date(fee.paymentDate).toLocaleDateString()}</p>
                  )}
                  {fee.paymentMethod && (
                    <p><strong>💳 Method:</strong> {fee.paymentMethod}</p>
                  )}
                </div>

                {fee.status === 'DUE' && (
                  <button 
                    className="btn btn-success"
                    onClick={() => handlePayment(fee)}
                    style={{ width: '100%', marginTop: '1rem' }}
                  >
                    💳 Record Payment
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Fees;
