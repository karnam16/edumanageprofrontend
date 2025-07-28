# EduManage Pro - Frontend-Backend Integration Guide

## Overview
This guide helps you integrate the EduManage Pro React frontend with your Spring Boot backend.

## Quick Start

### 1. Backend Requirements
Your Spring Boot backend should be running on **port 8080** with the following configuration:

#### Required Dependencies (pom.xml)
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<!-- For CORS support -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

#### CORS Configuration
Create a CORS configuration class:

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 2. Required API Endpoints

#### Student Endpoints
- `GET /api/students` - Get all students
- `GET /api/students/{id}` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student

#### Fee Endpoints
- `GET /api/fees` - Get all fee records
- `GET /api/fees/due` - Get due fees
- `GET /api/fees/student/{studentId}` - Get fees for specific student
- `POST /api/fees` - Create new fee record
- `PUT /api/fees/{id}` - Update fee record
- `PUT /api/fees/{id}/mark-paid` - Mark fee as paid
- `DELETE /api/fees/{id}` - Delete fee record

#### Optional Health Check
- `GET /api/health` - Health check endpoint

### 3. Data Models

#### Student Model
```java
@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    private String phone;
    private String grade;
    private String parentName;
    private String parentPhone;
    private String address;
    
    @Column(name = "join_date")
    private LocalDate joinDate;
    
    private String status = "ACTIVE";
    
    // Getters and setters...
}
```

#### Fee Model
```java
@Entity
@Table(name = "fees")
public class Fee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "student_id", nullable = false)
    private Long studentId;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;
    
    @Enumerated(EnumType.STRING)
    private FeeStatus status = FeeStatus.DUE;
    
    @Column(name = "payment_method")
    private String paymentMethod;
    
    @Column(name = "payment_date")
    private LocalDate paymentDate;
    
    private String description;
    
    // Getters and setters...
}

enum FeeStatus {
    DUE, PAID, OVERDUE
}
```

### 4. Frontend Configuration

#### Environment Variables
Create a `.env` file in the frontend directory:
```bash
# Copy from .env.example
cp frontend/.env.example frontend/.env
```

Edit the `.env` file to match your backend URL:
```env
REACT_APP_API_URL=http://localhost:8080/api
```

#### Start the Frontend
```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`

### 5. Testing Integration

1. **Start your Spring Boot backend** on port 8080
2. **Start the React frontend** on port 3000
3. **Open the Dashboard** - you should see a connection status indicator
4. **Check the browser console** for API request/response logs

### 6. Troubleshooting

#### Common Issues

**❌ "Backend not running on port 8080"**
- Ensure your Spring Boot app is running
- Check if another service is using port 8080
- Verify the server starts without errors

**❌ "API endpoint not found"**
- Check your controller mappings use `/api` base path
- Verify `@RestController` and `@RequestMapping("/api")` annotations
- Ensure all required endpoints are implemented

**❌ "CORS policy error"**
- Add CORS configuration (see above)
- Verify allowed origins include `http://localhost:3000`
- Check that all HTTP methods are allowed

**❌ "Unsupported Media Type"**
- Ensure controllers accept `application/json`
- Add `@RequestBody` annotations for POST/PUT endpoints
- Check Content-Type headers

#### Debug Steps

1. **Check Backend Logs**: Look for startup errors or request handling issues
2. **Test Endpoints Directly**: Use Postman or curl to test API endpoints
3. **Browser Developer Tools**: Check Network tab for failed requests
4. **Frontend Console**: Look for detailed error messages

### 7. Sample Controller Implementation

```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {
    
    @Autowired
    private StudentService studentService;
    
    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.findAll();
        return ResponseEntity.ok(students);
    }
    
    @PostMapping("/students")
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        Student savedStudent = studentService.save(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedStudent);
    }
    
    @PutMapping("/students/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student student) {
        student.setId(id);
        Student updatedStudent = studentService.save(student);
        return ResponseEntity.ok(updatedStudent);
    }
    
    @DeleteMapping("/students/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
```

### 8. Database Configuration

#### application.properties
```properties
# Database configuration (adjust for your database)
spring.datasource.url=jdbc:mysql://localhost:3306/edumanage
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Server configuration
server.port=8080
```

### 9. Success Indicators

When everything is working correctly, you should see:

✅ **Dashboard shows**: "✅ Connected! Found X students"  
✅ **Browser console**: API request/response logs  
✅ **Students page**: Loads and displays student data  
✅ **Fee management**: Can add, edit, and mark fees as paid  
✅ **No CORS errors** in browser console  

### 10. Production Deployment

For production deployment:

1. **Update frontend environment**:
   ```env
   REACT_APP_API_URL=https://your-backend-domain.com/api
   ```

2. **Update CORS configuration** to include production domain

3. **Build frontend**:
   ```bash
   npm run build
   ```

4. **Deploy both frontend and backend** to your hosting platform

## Need Help?

If you're still experiencing issues:

1. Check the **Connection Status** component on the Dashboard
2. Review the **browser console** for detailed error messages
3. Verify your **backend endpoints** match the expected format
4. Test **API endpoints directly** with tools like Postman

The frontend includes comprehensive error handling and debugging information to help identify integration issues.