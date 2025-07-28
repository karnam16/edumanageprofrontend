import axios from "axios";

// Base URL for your Spring Boot backend
const API_BASE_URL = "http://localhost:8080/api";

// Create axios instance with proper headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

// Request interceptor - SIMPLIFIED
apiClient.interceptors.request.use(
  (config) => {
    // Don't manually stringify - let axios handle it
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      "❌ API Response Error:",
      error.response?.status,
      error.message
    );
    return Promise.reject(error);
  }
);

// Student API functions
export const studentAPI = {
  // Get all students
  getAllStudents: async () => {
    try {
      const response = await apiClient.get("/students");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch students:", error);
      throw new Error(`Failed to fetch students: ${error.message}`);
    }
  },

  // Add new student
  addStudent: async (studentData) => {
    try {
      const response = await apiClient.post("/students", studentData);
      return response.data;
    } catch (error) {
      console.error("Failed to add student:", error);
      throw new Error(`Failed to add student: ${error.message}`);
    }
  },

  // Update student
  updateStudent: async (studentId, studentData) => {
    try {
      const response = await apiClient.put(
        `/students/${studentId}`,
        studentData
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update student:", error);
      throw new Error(`Failed to update student: ${error.message}`);
    }
  },

  // Delete student
  deleteStudent: async (studentId) => {
    try {
      const response = await apiClient.delete(`/students/${studentId}`);
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
      return response.data;
    } catch (error) {
      console.error("Failed to fetch fee records:", error);
      throw new Error(`Failed to fetch fee records: ${error.message}`);
    }
  },

  // Get due fees
  getDueFees: async () => {
    try {
      const response = await apiClient.get("/fees/due");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch due fees:", error);
      throw new Error(`Failed to fetch due fees: ${error.message}`);
    }
  },

  // Add fee record
  addFeeRecord: async (feeData) => {
    try {
      const response = await apiClient.post("/fees", feeData);
      return response.data;
    } catch (error) {
      console.error("Failed to add fee record:", error);
      throw new Error(`Failed to add fee record: ${error.message}`);
    }
  },

  // Update fee record
  updateFeeRecord: async (feeId, feeData) => {
    try {
      const response = await apiClient.put(`/fees/${feeId}`, feeData);
      return response.data;
    } catch (error) {
      console.error("Failed to update fee record:", error);
      throw new Error(`Failed to update fee record: ${error.message}`);
    }
  },

  // Delete fee record
  deleteFeeRecord: async (feeId) => {
    try {
      const response = await apiClient.delete(`/fees/${feeId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete fee record:", error);
      throw new Error(`Failed to delete fee record: ${error.message}`);
    }
  },

  // Get fees by student ID
  getFeesByStudentId: async (studentId) => {
    try {
      const response = await apiClient.get(`/fees/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch student fees:", error);
      throw new Error(`Failed to fetch student fees: ${error.message}`);
    }
  },

  // Mark fee as paid - CORRECTED ENDPOINT
  markFeeAsPaid: async (feeId) => {
    try {
      console.log("🚀 Marking fee as paid:", feeId);
      const response = await apiClient.put(`/fees/${feeId}/mark-paid`);
      console.log("✅ Fee marked as paid successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to mark fee as paid:", error);
      throw new Error(`Failed to mark fee as paid: ${error.message}`);
    }
  },
};

// Test API connection
export const testConnection = async () => {
  try {
    console.log("🔍 Testing API connection...");
    const response = await apiClient.get("/students");
    console.log("✅ API Response:", response);

    return {
      success: true,
      message: `Connected! Found ${response.data.length} students`,
    };
  } catch (error) {
    console.error("❌ API Error Details:", error);

    if (error.code === "ECONNREFUSED") {
      return { success: false, message: "Backend not running on port 8080" };
    }
    if (error.response?.status === 404) {
      return { success: false, message: "API endpoint not found" };
    }
    if (error.response?.status === 415) {
      return {
        success: false,
        message: "Unsupported Media Type - Check backend",
      };
    }

    return { success: false, message: `Error: ${error.message}` };
  }
};

export default apiClient;
