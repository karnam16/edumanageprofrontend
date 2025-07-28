const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Data storage paths
const DATA_DIR = path.join(__dirname, 'data');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');
const FEES_FILE = path.join(DATA_DIR, 'fees.json');

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize data storage
async function initializeDataStorage() {
  try {
    await fs.ensureDir(DATA_DIR);
    
    // Initialize students file if it doesn't exist
    if (!await fs.pathExists(STUDENTS_FILE)) {
      const initialStudents = [
        {
          id: uuidv4(),
          name: "John Doe",
          email: "john.doe@email.com",
          phone: "123-456-7890",
          grade: "10th Grade",
          parentName: "Jane Doe",
          parentPhone: "123-456-7891",
          address: "123 Main St, City, State",
          joinDate: "2024-01-15",
          status: "ACTIVE"
        },
        {
          id: uuidv4(),
          name: "Alice Smith",
          email: "alice.smith@email.com",
          phone: "234-567-8901",
          grade: "9th Grade",
          parentName: "Bob Smith",
          parentPhone: "234-567-8902",
          address: "456 Oak Ave, City, State",
          joinDate: "2024-02-01",
          status: "ACTIVE"
        }
      ];
      await fs.writeJson(STUDENTS_FILE, initialStudents, { spaces: 2 });
    }
    
    // Initialize fees file if it doesn't exist
    if (!await fs.pathExists(FEES_FILE)) {
      const students = await fs.readJson(STUDENTS_FILE);
      const initialFees = [
        {
          id: uuidv4(),
          studentId: students[0].id,
          amount: 500,
          dueDate: "2024-12-15",
          status: "DUE",
          paymentMethod: "",
          paymentDate: null,
          description: "Monthly Tuition Fee - December 2024"
        },
        {
          id: uuidv4(),
          studentId: students[1].id,
          amount: 450,
          dueDate: "2024-12-15",
          status: "PAID",
          paymentMethod: "Credit Card",
          paymentDate: "2024-12-10",
          description: "Monthly Tuition Fee - December 2024"
        },
        {
          id: uuidv4(),
          studentId: students[0].id,
          amount: 500,
          dueDate: "2024-11-15",
          status: "PAID",
          paymentMethod: "Cash",
          paymentDate: "2024-11-14",
          description: "Monthly Tuition Fee - November 2024"
        }
      ];
      await fs.writeJson(FEES_FILE, initialFees, { spaces: 2 });
    }
    
    console.log('✅ Data storage initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing data storage:', error);
  }
}

// Helper functions to read/write data
async function readStudents() {
  try {
    return await fs.readJson(STUDENTS_FILE);
  } catch (error) {
    console.error('Error reading students:', error);
    return [];
  }
}

async function writeStudents(students) {
  try {
    await fs.writeJson(STUDENTS_FILE, students, { spaces: 2 });
  } catch (error) {
    console.error('Error writing students:', error);
    throw error;
  }
}

async function readFees() {
  try {
    return await fs.readJson(FEES_FILE);
  } catch (error) {
    console.error('Error reading fees:', error);
    return [];
  }
}

async function writeFees(fees) {
  try {
    await fs.writeJson(FEES_FILE, fees, { spaces: 2 });
  } catch (error) {
    console.error('Error writing fees:', error);
    throw error;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'EduManage Pro Backend is running',
    timestamp: new Date().toISOString()
  });
});

// STUDENT ENDPOINTS

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await readStudents();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get student by ID
app.get('/api/students/:id', async (req, res) => {
  try {
    const students = await readStudents();
    const student = students.find(s => s.id === req.params.id);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Add new student
app.post('/api/students', async (req, res) => {
  try {
    const students = await readStudents();
    const newStudent = {
      id: uuidv4(),
      ...req.body,
      status: 'ACTIVE',
      joinDate: req.body.joinDate || new Date().toISOString().split('T')[0]
    };
    
    students.push(newStudent);
    await writeStudents(students);
    
    console.log('✅ Student added:', newStudent.name);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// Update student
app.put('/api/students/:id', async (req, res) => {
  try {
    const students = await readStudents();
    const studentIndex = students.findIndex(s => s.id === req.params.id);
    
    if (studentIndex === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    students[studentIndex] = {
      ...students[studentIndex],
      ...req.body,
      id: req.params.id // Ensure ID doesn't change
    };
    
    await writeStudents(students);
    
    console.log('✅ Student updated:', students[studentIndex].name);
    res.json(students[studentIndex]);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const students = await readStudents();
    const studentIndex = students.findIndex(s => s.id === req.params.id);
    
    if (studentIndex === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const deletedStudent = students[studentIndex];
    students.splice(studentIndex, 1);
    await writeStudents(students);
    
    // Also remove associated fees
    const fees = await readFees();
    const updatedFees = fees.filter(f => f.studentId !== req.params.id);
    await writeFees(updatedFees);
    
    console.log('✅ Student deleted:', deletedStudent.name);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// FEE ENDPOINTS

// Get all fee records
app.get('/api/fees', async (req, res) => {
  try {
    const fees = await readFees();
    const students = await readStudents();
    
    // Enrich fee records with student information
    const enrichedFees = fees.map(fee => {
      const student = students.find(s => s.id === fee.studentId);
      return {
        ...fee,
        studentName: student ? student.name : 'Unknown Student',
        studentGrade: student ? student.grade : 'Unknown Grade'
      };
    });
    
    res.json(enrichedFees);
  } catch (error) {
    console.error('Error fetching fees:', error);
    res.status(500).json({ error: 'Failed to fetch fees' });
  }
});

// Get due fees
app.get('/api/fees/due', async (req, res) => {
  try {
    const fees = await readFees();
    const students = await readStudents();
    
    const dueFees = fees.filter(fee => fee.status === 'DUE' || fee.status === 'OVERDUE');
    
    // Enrich with student information
    const enrichedDueFees = dueFees.map(fee => {
      const student = students.find(s => s.id === fee.studentId);
      return {
        ...fee,
        studentName: student ? student.name : 'Unknown Student',
        studentGrade: student ? student.grade : 'Unknown Grade'
      };
    });
    
    res.json(enrichedDueFees);
  } catch (error) {
    console.error('Error fetching due fees:', error);
    res.status(500).json({ error: 'Failed to fetch due fees' });
  }
});

// Get fees by student ID
app.get('/api/fees/student/:studentId', async (req, res) => {
  try {
    const fees = await readFees();
    const studentFees = fees.filter(f => f.studentId === req.params.studentId);
    res.json(studentFees);
  } catch (error) {
    console.error('Error fetching student fees:', error);
    res.status(500).json({ error: 'Failed to fetch student fees' });
  }
});

// Add new fee record
app.post('/api/fees', async (req, res) => {
  try {
    const fees = await readFees();
    const newFee = {
      id: uuidv4(),
      ...req.body,
      paymentDate: req.body.status === 'PAID' ? (req.body.paymentDate || new Date().toISOString().split('T')[0]) : null
    };
    
    fees.push(newFee);
    await writeFees(fees);
    
    console.log('✅ Fee record added:', newFee.description || 'New fee');
    res.status(201).json(newFee);
  } catch (error) {
    console.error('Error adding fee record:', error);
    res.status(500).json({ error: 'Failed to add fee record' });
  }
});

// Update fee record
app.put('/api/fees/:id', async (req, res) => {
  try {
    const fees = await readFees();
    const feeIndex = fees.findIndex(f => f.id === req.params.id);
    
    if (feeIndex === -1) {
      return res.status(404).json({ error: 'Fee record not found' });
    }
    
    fees[feeIndex] = {
      ...fees[feeIndex],
      ...req.body,
      id: req.params.id // Ensure ID doesn't change
    };
    
    await writeFees(fees);
    
    console.log('✅ Fee record updated:', fees[feeIndex].description || 'Fee record');
    res.json(fees[feeIndex]);
  } catch (error) {
    console.error('Error updating fee record:', error);
    res.status(500).json({ error: 'Failed to update fee record' });
  }
});

// Mark fee as paid
app.put('/api/fees/:id/mark-paid', async (req, res) => {
  try {
    const fees = await readFees();
    const feeIndex = fees.findIndex(f => f.id === req.params.id);
    
    if (feeIndex === -1) {
      return res.status(404).json({ error: 'Fee record not found' });
    }
    
    fees[feeIndex] = {
      ...fees[feeIndex],
      status: 'PAID',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: req.body.paymentMethod || 'Not specified'
    };
    
    await writeFees(fees);
    
    console.log('✅ Fee marked as paid:', fees[feeIndex].description || 'Fee record');
    res.json(fees[feeIndex]);
  } catch (error) {
    console.error('Error marking fee as paid:', error);
    res.status(500).json({ error: 'Failed to mark fee as paid' });
  }
});

// Delete fee record
app.delete('/api/fees/:id', async (req, res) => {
  try {
    const fees = await readFees();
    const feeIndex = fees.findIndex(f => f.id === req.params.id);
    
    if (feeIndex === -1) {
      return res.status(404).json({ error: 'Fee record not found' });
    }
    
    const deletedFee = fees[feeIndex];
    fees.splice(feeIndex, 1);
    await writeFees(fees);
    
    console.log('✅ Fee record deleted:', deletedFee.description || 'Fee record');
    res.json({ message: 'Fee record deleted successfully' });
  } catch (error) {
    console.error('Error deleting fee record:', error);
    res.status(500).json({ error: 'Failed to delete fee record' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
async function startServer() {
  try {
    await initializeDataStorage();
    
    app.listen(PORT, () => {
      console.log(`🚀 EduManage Pro Backend Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`👥 Students API: http://localhost:${PORT}/api/students`);
      console.log(`💰 Fees API: http://localhost:${PORT}/api/fees`);
      console.log(`🌐 CORS enabled for: http://localhost:3000`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();