# 🎓 Tuition Management System

A complete, modern tuition management application built with **React** frontend and **Spring Boot** backend.

## ✨ Features

### 📊 Dashboard

- **Real-time Statistics**: Live student count, due fees, and monthly collections
- **Auto-refresh**: Data updates every 30 seconds
- **API Status Monitoring**: Visual connection status indicator
- **Responsive Design**: Works perfectly on all devices

### 👥 Student Management

- **Complete CRUD Operations**: Add, edit, delete, and view students
- **Advanced Search**: Search by name, email, or phone number
- **Status Filtering**: Filter by active/inactive students
- **Comprehensive Forms**: Capture all student details including parent information
- **Modern UI**: Card-based layout with hover effects

### 💰 Fee Management

- **Fee Tracking**: Complete fee record management
- **Payment Processing**: Record payments with multiple payment methods
- **Status Management**: Track DUE, PAID, and OVERDUE fees
- **Financial Analytics**: Summary cards showing totals by status
- **Student Integration**: Link fees to specific students
- **Search & Filter**: Find fees by student name or amount

## 🚀 Technology Stack

### Frontend

- **React 19.1.0** - Modern React with hooks
- **React Router DOM 7.7.1** - Client-side routing
- **Axios 1.11.0** - HTTP client for API calls
- **CSS3** - Custom styling with modern design patterns

### Backend

- **Spring Boot 3.5.3** - Java-based REST API
- **Spring Data JPA** - Database operations
- **MySQL** - Relational database
- **Lombok** - Reduce boilerplate code
- **Jakarta Validation** - Input validation

## 📁 Project Structure

```
tuition-management/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Dashboard.jsx # Main dashboard
│   │   │   ├── Students.jsx  # Student management
│   │   │   ├── Fees.jsx      # Fee management
│   │   │   └── Navigation.jsx # Navigation bar
│   │   ├── services/         # API services
│   │   │   └── api.js        # HTTP client & API functions
│   │   └── styles/           # CSS stylesheets
│   │       └── App.css       # Main styles
│   └── package.json          # Dependencies
└── tuition/                  # Spring Boot backend
    ├── src/main/java/
    │   └── com/tuitionapp/tuition/
    │       ├── entity/       # JPA entities
    │       ├── repository/   # Data repositories
    │       ├── service/      # Business logic
    │       ├── Controller/   # REST controllers
    │       └── dto/          # Data transfer objects
    └── pom.xml               # Maven dependencies
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- Java 21+
- MySQL 8.0+
- Maven 3.6+

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd tuition/tuition
   ```

2. Configure MySQL database in `application.properties`

3. Run the Spring Boot application:

   ```bash
   mvn spring-boot:run
   ```

4. Backend will be available at `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Frontend will be available at `http://localhost:3000`

## 🎯 Key Features Implementation

### Real-time Dashboard

- **Live Data**: Fetches real-time data from backend APIs
- **Auto-refresh**: Updates every 30 seconds automatically
- **Error Handling**: Graceful error display and recovery
- **Loading States**: Smooth loading indicators

### Student Management

- **Form Validation**: Required field validation
- **Search Functionality**: Real-time search across multiple fields
- **Responsive Grid**: Adaptive card layout
- **Edit/Delete**: Inline editing and confirmation dialogs

### Fee Management

- **Payment Workflow**: Complete payment recording process
- **Status Tracking**: Visual status indicators with colors
- **Financial Summary**: Real-time calculations and totals
- **Student Linking**: Seamless integration with student data

## 🎨 UI/UX Features

### Modern Design

- **Clean Interface**: Minimalist, professional design
- **Color-coded Status**: Visual status indicators
- **Hover Effects**: Interactive elements with smooth transitions
- **Responsive Layout**: Works on desktop, tablet, and mobile

### User Experience

- **Intuitive Navigation**: Clear navigation with active states
- **Form Validation**: Real-time validation with helpful messages
- **Loading States**: Clear feedback during operations
- **Error Handling**: User-friendly error messages

## 🔧 API Endpoints

### Students

- `GET /api/students` - Get all students
- `POST /api/students` - Add new student
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student

### Fees

- `GET /api/fees` - Get all fee records
- `GET /api/fees/due` - Get due fees
- `POST /api/fees` - Add fee record
- `PUT /api/fees/{id}` - Update fee record
- `DELETE /api/fees/{id}` - Delete fee record
- `PUT /api/fees/{id}/pay` - Mark fee as paid

## 📊 Database Schema

### Students Table

- `id` (Primary Key)
- `name`, `email`, `phone`
- `grade`, `parentName`, `parentPhone`
- `address`, `joinDate`

### Fee Records Table

- `id` (Primary Key)
- `studentId` (Foreign Key)
- `amount`, `dueDate`, `paymentDate`
- `paymentMethod`, `status`

## 🚀 Deployment

### Production Build

```bash
# Frontend
npm run build

# Backend
mvn clean package
```

### Environment Variables

- Configure database connection
- Set API base URLs
- Configure CORS settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🎉 Project Status: **COMPLETED** ✅

This tuition management system is now **fully functional** with:

- ✅ **Complete Frontend**: Modern React application with all features
- ✅ **Complete Backend**: Spring Boot REST API with full CRUD operations
- ✅ **Database Integration**: MySQL with proper relationships
- ✅ **Real-time Updates**: Live data synchronization
- ✅ **Responsive Design**: Works on all devices
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Modern UI/UX**: Professional, intuitive interface

The application is ready for production use and can be deployed immediately!
