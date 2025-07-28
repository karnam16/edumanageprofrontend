import React, { useState, useEffect } from "react";
import { studentAPI, feeAPI, testConnection } from "../services/api";
import ConnectionStatus from "./ConnectionStatus";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState("Testing...");
  const [studentCount, setStudentCount] = useState(0);
  const [dueFees, setDueFees] = useState(0);
  const [thisMonthFees, setThisMonthFees] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [error, setError] = useState(null);

  // Function to fetch all dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Test API connection first
      const connectionTest = await testConnection();
      
      if (connectionTest.success) {
        setApiStatus("✅ Connected");
        
        // Fetch all data in parallel with better error handling
        const [students, feeRecords] = await Promise.all([
          studentAPI.getAllStudents().catch(err => {
            console.warn("Failed to fetch students:", err.message);
            return [];
          }),
          feeAPI.getAllFeeRecords().catch(err => {
            console.warn("Failed to fetch fees:", err.message);
            return [];
          }),
        ]);

        // Ensure we have arrays to work with
        const validStudents = Array.isArray(students) ? students : [];
        const validFeeRecords = Array.isArray(feeRecords) ? feeRecords : [];

        setStudentCount(validStudents.length);

        // Calculate financial metrics with better safety checks
        const dueFeeRecords = validFeeRecords.filter((fee) => fee.status === "DUE");
        const paidFeeRecords = validFeeRecords.filter((fee) => fee.status === "PAID");
        const overdueFeeRecords = validFeeRecords.filter((fee) => fee.status === "OVERDUE");

        const totalDue = dueFeeRecords.reduce((sum, fee) => {
          const amount = parseFloat(fee.amount) || 0;
          return sum + amount;
        }, 0);
        
        const totalPaid = paidFeeRecords.reduce((sum, fee) => {
          const amount = parseFloat(fee.amount) || 0;
          return sum + amount;
        }, 0);

        setDueFees(totalDue);
        setTotalRevenue(totalPaid);

        // Calculate this month's fees with better date handling
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const thisMonthTotal = paidFeeRecords
          .filter((fee) => {
            try {
              const feeDate = new Date(fee.paymentDate || fee.dueDate);
              return (
                !isNaN(feeDate.getTime()) &&
                feeDate.getMonth() === currentMonth &&
                feeDate.getFullYear() === currentYear
              );
            } catch (dateError) {
              console.warn("Invalid date in fee record:", fee);
              return false;
            }
          })
          .reduce((sum, fee) => {
            const amount = parseFloat(fee.amount) || 0;
            return sum + amount;
          }, 0);

        setThisMonthFees(thisMonthTotal);

        // Get recent students (last 5) with better sorting
        const sortedStudents = validStudents
          .filter(student => student.joinDate) // Only students with valid join dates
          .sort((a, b) => {
            const dateA = new Date(a.joinDate);
            const dateB = new Date(b.joinDate);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 5);
        setRecentStudents(sortedStudents);

        // Get recent payments (last 5) with better sorting
        const sortedPayments = paidFeeRecords
          .filter(payment => payment.paymentDate) // Only payments with valid dates
          .sort((a, b) => {
            const dateA = new Date(a.paymentDate);
            const dateB = new Date(b.paymentDate);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 5);
        setRecentPayments(sortedPayments);
        
      } else {
        setApiStatus("❌ Disconnected");
        setError(connectionTest.message);
        
        // Show helpful suggestions if available
        if (connectionTest.suggestions && connectionTest.suggestions.length > 0) {
          const suggestionText = connectionTest.suggestions.join("\n");
          console.log("Connection troubleshooting suggestions:\n" + suggestionText);
        }
      }
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError(err.message || "Failed to load dashboard data");
      setApiStatus("❌ Error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Auto-refresh data every 60 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 60000); // 60 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📊 Dashboard Overview</h2>
        </div>
        <div className="loading">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">📊 Dashboard Overview</h2>
            <p style={{ color: "#6c757d", margin: "0.5rem 0 0 0" }}>
              Welcome to EduManage Pro - Your complete tuition management
              solution
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "25px",
                backgroundColor: apiStatus.includes("✅")
                  ? "#e8f5e8"
                  : "#ffebee",
                color: apiStatus.includes("✅") ? "#2e7d32" : "#d32f2f",
                fontSize: "14px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "12px" }}>●</span>
              {apiStatus}
            </div>
            <button
              className="btn btn-primary"
              onClick={fetchDashboardData}
              style={{ fontSize: "14px", padding: "10px 20px" }}
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <strong>⚠️ Connection Error:</strong> {error}
          </div>
        )}

        {/* Connection Status Component */}
        <ConnectionStatus />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-4" style={{ marginBottom: "2rem" }}>
        <div className="summary-card">
          <h4>👥 Total Students</h4>
          <div className="amount">{studentCount}</div>
          <div className="count">Active students</div>
        </div>

        <div className="summary-card">
          <h4>💰 Due Fees</h4>
          <div className="amount">₹{dueFees.toLocaleString()}</div>
          <div className="count">Pending payments</div>
        </div>

        <div className="summary-card">
          <h4>📈 This Month</h4>
          <div className="amount">₹{thisMonthFees.toLocaleString()}</div>
          <div className="count">Collected fees</div>
        </div>

        <div className="summary-card">
          <h4>💵 Total Revenue</h4>
          <div className="amount">₹{totalRevenue.toLocaleString()}</div>
          <div className="count">All time earnings</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-2">
        {/* Recent Students */}
        <div className="card">
          <div className="card-header">
            <h3>🎓 Recent Students</h3>
            <span style={{ color: "#6c757d", fontSize: "14px" }}>
              {recentStudents.length} students
            </span>
          </div>

          {recentStudents.length === 0 ? (
            <div className="empty-state">
              <h4>No students yet</h4>
              <p>Start by adding your first student to the system</p>
            </div>
          ) : (
            <div>
              {recentStudents.map((student) => (
                <div
                  key={student.id}
                  className="item-card"
                  style={{ marginBottom: "1rem" }}
                >
                  <div className="header">
                    <div className="title">{student.name}</div>
                    <div className="status-badge status-due">New</div>
                  </div>
                  <div className="details">
                    <p>
                      <strong>📧 Email:</strong>{" "}
                      {student.email || "Not provided"}
                    </p>
                    <p>
                      <strong>📞 Phone:</strong>{" "}
                      {student.phone || "Not provided"}
                    </p>
                    <p>
                      <strong>📚 Grade:</strong>{" "}
                      {student.grade || "Not specified"}
                    </p>
                    {student.joinDate && (
                      <p>
                        <strong>📅 Joined:</strong>{" "}
                        {new Date(student.joinDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="card">
          <div className="card-header">
            <h3>💳 Recent Payments</h3>
            <span style={{ color: "#6c757d", fontSize: "14px" }}>
              {recentPayments.length} payments
            </span>
          </div>

          {recentPayments.length === 0 ? (
            <div className="empty-state">
              <h4>No payments yet</h4>
              <p>
                Payment history will appear here once students start paying fees
              </p>
            </div>
          ) : (
            <div>
              {recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="item-card"
                  style={{ marginBottom: "1rem" }}
                >
                  <div className="header">
                    <div className="title">
                      ₹{payment.amount?.toLocaleString()}
                    </div>
                    <div className="status-badge status-paid">Paid</div>
                  </div>
                  <div className="details">
                    <p>
                      <strong>👤 Student ID:</strong> {payment.studentId}
                    </p>
                    <p>
                      <strong>💳 Method:</strong>{" "}
                      {payment.paymentMethod || "Not specified"}
                    </p>
                    {payment.paymentDate && (
                      <p>
                        <strong>📅 Paid On:</strong>{" "}
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3>⚡ Quick Actions</h3>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          <button
            className="btn btn-primary"
            style={{ padding: "1rem", fontSize: "16px" }}
          >
            ➕ Add New Student
          </button>
          <button
            className="btn btn-success"
            style={{ padding: "1rem", fontSize: "16px" }}
          >
            💳 Record Payment
          </button>
          <button
            className="btn btn-secondary"
            style={{ padding: "1rem", fontSize: "16px" }}
          >
            📊 View Reports
          </button>
          <button
            className="btn"
            style={{
              padding: "1rem",
              fontSize: "16px",
              backgroundColor: "#f8f9fa",
              color: "#6c757d",
            }}
          >
            📧 Send Reminders
          </button>
        </div>
      </div>

      {/* System Info */}
      <div
        className="card"
        style={{ backgroundColor: "#f8f9fa", border: "1px solid #e9ecef" }}
      >
        <div style={{ textAlign: "center", color: "#6c757d" }}>
          <h4>🔄 Real-Time System</h4>
          <p>
            ✅ <strong>Auto-refresh:</strong> Data updates every 60 seconds
            <br />✅ <strong>Live connection:</strong> Direct integration with
            your database
            <br />✅ <strong>Professional grade:</strong> Ready for production
            use
          </p>
          <p style={{ fontSize: "14px", marginTop: "1rem" }}>
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
