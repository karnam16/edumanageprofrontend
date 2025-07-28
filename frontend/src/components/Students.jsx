import React, { useState, useEffect } from "react";
import { studentAPI } from "../services/api";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    grade: "",
    parentName: "",
    parentPhone: "",
    address: "",
    joinDate: "",
  });

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentAPI.getAllStudents();
      setStudents(data);
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

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      grade: "",
      parentName: "",
      parentPhone: "",
      address: "",
      joinDate: "",
    });
    setEditingStudent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingStudent) {
        await studentAPI.updateStudent(editingStudent.id, formData);
      } else {
        await studentAPI.addStudent(formData);
      }

      await fetchStudents();
      setShowAddForm(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      grade: student.grade || "",
      parentName: student.parentName || "",
      parentPhone: student.parentPhone || "",
      address: student.address || "",
      joinDate: student.joinDate || "",
    });
    setShowAddForm(true);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setLoading(true);
      setError(null);
      try {
        await studentAPI.deleteStudent(studentId);
        await fetchStudents();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone?.includes(searchTerm);

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "active")
      return matchesSearch && student.status === "ACTIVE";
    if (filterStatus === "inactive")
      return matchesSearch && student.status === "INACTIVE";

    return matchesSearch;
  });

  if (loading && students.length === 0) {
    return (
      <div className="card">
        <h2>👥 Students Management</h2>
        <p>Loading students...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">👥 Student Management</h2>
          <p style={{ color: "#6c757d", margin: "0.5rem 0 0 0" }}>
            Manage all your students, track their progress, and maintain their
            records
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowAddForm(!showAddForm);
          }}
        >
          {showAddForm ? "❌ Cancel" : "➕ Add New Student"}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="form-section">
          <h3>{editingStudent ? "✏️ Edit Student" : "➕ Add New Student"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Enter student's full name"
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="student@email.com"
                />
              </div>
              <div>
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label>Grade</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select Grade</option>
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                  <option value="4">Grade 4</option>
                  <option value="5">Grade 5</option>
                  <option value="6">Grade 6</option>
                  <option value="7">Grade 7</option>
                  <option value="8">Grade 8</option>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </select>
              </div>
              <div>
                <label>Parent Name</label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Parent's full name"
                />
              </div>
              <div>
                <label>Parent Phone</label>
                <input
                  type="tel"
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-input"
                  rows="3"
                  placeholder="Enter complete address"
                />
              </div>
              <div>
                <label>Join Date</label>
                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingStudent
                  ? "Update Student"
                  : "Add Student"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
              >
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
            placeholder="Search students by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ width: "100%" }}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="form-input filter-select"
        >
          <option value="all">All Students</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          className="btn btn-secondary"
          onClick={fetchStudents}
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Students List */}
      <div>
        <div className="card-header">
          <h3>📋 Students List ({filteredStudents.length})</h3>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="empty-state">
            <h4>
              {searchTerm ? "No students found" : "No students registered yet"}
            </h4>
            <p>
              {searchTerm
                ? "Try adjusting your search terms or filters to find the student you're looking for."
                : "Start building your student database by adding your first student to the system."}
            </p>
            {!searchTerm && (
              <button
                className="btn btn-primary"
                onClick={() => setShowAddForm(true)}
                style={{ marginTop: "1rem" }}
              >
                ➕ Add Your First Student
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-2">
            {filteredStudents.map((student) => (
              <div key={student.id} className="item-card">
                <div className="header">
                  <div className="title">{student.name}</div>
                  <div className="actions">
                    <button
                      className="btn action-btn edit-btn"
                      onClick={() => handleEdit(student)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn action-btn delete-btn"
                      onClick={() => handleDelete(student.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                <div className="details">
                  <p>
                    <strong>📧 Email:</strong> {student.email || "Not provided"}
                  </p>
                  <p>
                    <strong>📞 Phone:</strong> {student.phone || "Not provided"}
                  </p>
                  <p>
                    <strong>📚 Grade:</strong>{" "}
                    {student.grade || "Not specified"}
                  </p>
                  <p>
                    <strong>👨‍👩‍👧‍👦 Parent:</strong>{" "}
                    {student.parentName || "Not provided"}
                  </p>
                  <p>
                    <strong>📱 Parent Phone:</strong>{" "}
                    {student.parentPhone || "Not provided"}
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
    </div>
  );
};

export default Students;
