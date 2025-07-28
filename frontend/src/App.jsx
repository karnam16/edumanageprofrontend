import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Fees from './components/Fees';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="main-header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-icon">🎓</div>
              <div className="logo-text">
                <h1>EduManage Pro</h1>
                <p>Professional Tuition Management System</p>
              </div>
            </div>
            <div className="header-actions">
              <div className="user-info">
                <span className="user-avatar">👨‍💼</span>
                <span className="user-name">Admin</span>
              </div>
              <div className="system-status">
                <span className="status-dot online"></span>
                <span className="status-text">System Online</span>
              </div>
            </div>
          </div>
        </header>
        
        <div className="main-layout">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/fees" element={<Fees />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
