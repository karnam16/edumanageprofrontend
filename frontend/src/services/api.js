import axios from "axios";

// Base URL for your Spring Boot backend - can be configured via environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

// Create axios instance with proper headers and configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000, // Increased timeout for slower backends
  withCredentials: false, // Set to true if your backend requires credentials
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Add any authentication headers if needed
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("❌ API Response Error:", error.response?.status, error.message);
    
    // Handle specific error cases
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Unable to connect to the backend server. Please ensure the backend is running on port 8080.');
    }
    
    if (error.response?.status === 404) {
      throw new Error('API endpoint not found. Please check if the backend routes are correctly configured.');
    }
    
    if (error.response?.status === 500) {
      throw new Error('Internal server error. Please check the backend logs for more details.');
    }
    
    if (error.response?.status === 400) {
      const message = error.response?.data?.message || 'Bad request. Please check the data being sent.';
      throw new Error(message);
    }
    
    if (error.response?.status === 403) {
      throw new Error('Access forbidden. Please check your authentication.');
    }
    
    throw error;
  }
);

// Utility function to validate student data
const validateStudentData = (studentData) => {
  const errors = [];
  
  if (!studentData.name || studentData.name.trim().length < 2) {
    errors.push('Student name must be at least 2 characters long');
  }
  
  if (!studentData.email || !/\S+@\S+\.\S+/.test(studentData.email)) {
    errors.push('Please provide a valid email address');
  }
  
  if (!studentData.phone || studentData.phone.trim().length < 10) {
    errors.push('Please provide a valid phone number');
  }
  
  if (!studentData.grade || studentData.grade.trim().length === 0) {
    errors.push('Please specify the student grade');
  }
  
  if (errors.length > 0) {
    throw new Error(`Validation errors: ${errors.join(', ')}`);
  }
  
  return true;
};

// Utility function to validate fee data
const validateFeeData = (feeData) => {
  const errors = [];
  
  if (!feeData.studentId) {
    errors.push('Student ID is required');
  }
  
  if (!feeData.amount || feeData.amount <= 0) {
    errors.push('Fee amount must be greater than 0');
  }
  
  if (!feeData.dueDate) {
    errors.push('Due date is required');
  }
  
  if (errors.length > 0) {
    throw new Error(`Validation errors: ${errors.join(', ')}`);
  }
  
  return true;
};

// Student API functions
export const studentAPI = {
  // Get all students
  getAllStudents: async () => {
    try {
      const response = await apiClient.get("/students");
      console.log(`📊 Fetched ${response.data?.length || 0} students`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Failed to fetch students:", error);
      throw new Error(`Failed to fetch students: ${error.message}`);
    }
  },

  // Get student by ID
  getStudentById: async (studentId) => {
    try {
      if (!studentId) {
        throw new Error('Student ID is required');
      }
      
      const response = await apiClient.get(`/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch student:", error);
      throw new Error(`Failed to fetch student: ${error.message}`);
    }
  },

  // Add new student
  addStudent: async (studentData) => {
    try {
      // Validate data before sending
      validateStudentData(studentData);
      
      // Clean and format the data
      const cleanedData = {
        name: studentData.name?.trim(),
        email: studentData.email?.trim().toLowerCase(),
        phone: studentData.phone?.trim(),
        grade: studentData.grade?.trim(),
        parentName: studentData.parentName?.trim() || '',
        parentPhone: studentData.parentPhone?.trim() || '',
        address: studentData.address?.trim() || '',
        joinDate: studentData.joinDate || new Date().toISOString().split('T')[0],
      };
      
      const response = await apiClient.post("/students", cleanedData);
      console.log(`✅ Student added successfully: ${cleanedData.name}`);
      return response.data;
    } catch (error) {
      console.error("Failed to add student:", error);
      throw new Error(`Failed to add student: ${error.message}`);
    }
  },

  // Update student
  updateStudent: async (studentId, studentData) => {
    try {
      if (!studentId) {
        throw new Error('Student ID is required');
      }
      
      // Validate data before sending
      validateStudentData(studentData);
      
      // Clean and format the data
      const cleanedData = {
        name: studentData.name?.trim(),
        email: studentData.email?.trim().toLowerCase(),
        phone: studentData.phone?.trim(),
        grade: studentData.grade?.trim(),
        parentName: studentData.parentName?.trim() || '',
        parentPhone: studentData.parentPhone?.trim() || '',
        address: studentData.address?.trim() || '',
        joinDate: studentData.joinDate,
      };
      
      const response = await apiClient.put(`/students/${studentId}`, cleanedData);
      console.log(`✅ Student updated successfully: ${cleanedData.name}`);
      return response.data;
    } catch (error) {
      console.error("Failed to update student:", error);
      throw new Error(`Failed to update student: ${error.message}`);
    }
  },

  // Delete student
  deleteStudent: async (studentId) => {
    try {
      if (!studentId) {
        throw new Error('Student ID is required');
      }
      
      const response = await apiClient.delete(`/students/${studentId}`);
      console.log(`✅ Student deleted successfully`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete student:", error);
      throw new Error(`Failed to delete student: ${error.message}`);
    }
  },
};

// Fee API functions
export const feeAPI = {
  // Get all fee records
  getAllFeeRecords: async () => {
    try {
      const response = await apiClient.get("/fees");
      console.log(`📊 Fetched ${response.data?.length || 0} fee records`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Failed to fetch fee records:", error);
      throw new Error(`Failed to fetch fee records: ${error.message}`);
    }
  },

  // Get due fees
  getDueFees: async () => {
    try {
      const response = await apiClient.get("/fees/due");
      console.log(`📊 Fetched ${response.data?.length || 0} due fees`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Failed to fetch due fees:", error);
      throw new Error(`Failed to fetch due fees: ${error.message}`);
    }
  },

  // Add fee record
  addFeeRecord: async (feeData) => {
    try {
      // Validate data before sending
      validateFeeData(feeData);
      
      // Clean and format the data
      const cleanedData = {
        studentId: feeData.studentId,
        amount: parseFloat(feeData.amount),
        dueDate: feeData.dueDate,
        status: feeData.status || 'DUE',
        paymentMethod: feeData.paymentMethod?.trim() || '',
        description: feeData.description?.trim() || `Fee for ${new Date().toLocaleDateString()}`,
      };
      
      const response = await apiClient.post("/fees", cleanedData);
      console.log(`✅ Fee record added successfully`);
      return response.data;
    } catch (error) {
      console.error("Failed to add fee record:", error);
      throw new Error(`Failed to add fee record: ${error.message}`);
    }
  },

  // Update fee record
  updateFeeRecord: async (feeId, feeData) => {
    try {
      if (!feeId) {
        throw new Error('Fee ID is required');
      }
      
      // Clean and format the data
      const cleanedData = {
        ...feeData,
        amount: feeData.amount ? parseFloat(feeData.amount) : feeData.amount,
      };
      
      const response = await apiClient.put(`/fees/${feeId}`, cleanedData);
      console.log(`✅ Fee record updated successfully`);
      return response.data;
    } catch (error) {
      console.error("Failed to update fee record:", error);
      throw new Error(`Failed to update fee record: ${error.message}`);
    }
  },

  // Delete fee record
  deleteFeeRecord: async (feeId) => {
    try {
      if (!feeId) {
        throw new Error('Fee ID is required');
      }
      
      const response = await apiClient.delete(`/fees/${feeId}`);
      console.log(`✅ Fee record deleted successfully`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete fee record:", error);
      throw new Error(`Failed to delete fee record: ${error.message}`);
    }
  },

  // Get fees by student ID
  getFeesByStudentId: async (studentId) => {
    try {
      if (!studentId) {
        throw new Error('Student ID is required');
      }
      
      const response = await apiClient.get(`/fees/student/${studentId}`);
      console.log(`📊 Fetched ${response.data?.length || 0} fees for student`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Failed to fetch student fees:", error);
      throw new Error(`Failed to fetch student fees: ${error.message}`);
    }
  },

  // Mark fee as paid - with better error handling
  markFeeAsPaid: async (feeId, paymentData = {}) => {
    try {
      if (!feeId) {
        throw new Error('Fee ID is required');
      }
      
      console.log("🚀 Marking fee as paid:", feeId);
      
      const requestData = {
        paymentMethod: paymentData.paymentMethod || 'Not specified',
        paymentDate: paymentData.paymentDate || new Date().toISOString().split('T')[0],
      };
      
      const response = await apiClient.put(`/fees/${feeId}/mark-paid`, requestData);
      console.log("✅ Fee marked as paid successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to mark fee as paid:", error);
      throw new Error(`Failed to mark fee as paid: ${error.message}`);
    }
  },
};

// Test API connection with better diagnostics
export const testConnection = async () => {
  try {
    console.log("🔍 Testing API connection to:", API_BASE_URL);
    
    // First try a simple health check if available
    let response;
    try {
      response = await apiClient.get("/health");
      return {
        success: true,
        message: "✅ Backend health check passed",
        details: response.data
      };
    } catch (healthError) {
      // If health endpoint doesn't exist, try students endpoint
      console.log("Health endpoint not available, trying students endpoint...");
      response = await apiClient.get("/students");
    }
    
    const studentCount = Array.isArray(response.data) ? response.data.length : 0;
    return {
      success: true,
      message: `✅ Connected! Found ${studentCount} students`,
      details: { studentCount, endpoint: '/students' }
    };
    
  } catch (error) {
    console.error("❌ API Connection Test Failed:", error);
    
    let errorMessage = "❌ Connection failed: ";
    let suggestions = [];
    
    if (error.code === "ECONNREFUSED") {
      errorMessage += "Backend server not running";
      suggestions.push("• Start your Spring Boot backend server");
      suggestions.push("• Verify it's running on port 8080");
      suggestions.push("• Check if another service is using port 8080");
    } else if (error.response?.status === 404) {
      errorMessage += "API endpoints not found";
      suggestions.push("• Verify your backend API routes are correctly configured");
      suggestions.push("• Check if the base path is '/api'");
      suggestions.push("• Ensure your Spring Boot controllers are properly annotated");
    } else if (error.response?.status === 415) {
      errorMessage += "Unsupported Media Type";
      suggestions.push("• Check Content-Type headers in your backend");
      suggestions.push("• Ensure your Spring Boot app accepts application/json");
    } else if (error.response?.status >= 500) {
      errorMessage += "Backend server error";
      suggestions.push("• Check your backend server logs");
      suggestions.push("• Verify database connections");
      suggestions.push("• Check for any startup errors");
    } else {
      errorMessage += error.message;
      suggestions.push("• Check browser console for more details");
      suggestions.push("• Verify CORS configuration in your backend");
    }
    
    return { 
      success: false, 
      message: errorMessage,
      suggestions: suggestions,
      error: error.message
    };
  }
};

// Export the configured axios instance for custom requests
export default apiClient;
