import React, { useState, useEffect } from 'react';
import { testConnection } from '../services/api';

const ConnectionStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState({
    testing: true,
    success: false,
    message: 'Testing connection...',
    suggestions: [],
    details: null
  });

  const testBackendConnection = async () => {
    setConnectionStatus(prev => ({ ...prev, testing: true }));
    
    try {
      const result = await testConnection();
      setConnectionStatus({
        testing: false,
        success: result.success,
        message: result.message,
        suggestions: result.suggestions || [],
        details: result.details,
        error: result.error
      });
    } catch (error) {
      setConnectionStatus({
        testing: false,
        success: false,
        message: `Connection test failed: ${error.message}`,
        suggestions: [
          '• Check if your backend server is running',
          '• Verify the backend URL in your configuration',
          '• Check browser console for detailed error messages'
        ],
        details: null,
        error: error.message
      });
    }
  };

  useEffect(() => {
    testBackendConnection();
  }, []);

  const getStatusIcon = () => {
    if (connectionStatus.testing) return '🔄';
    return connectionStatus.success ? '✅' : '❌';
  };

  const getStatusColor = () => {
    if (connectionStatus.testing) return '#1976d2';
    return connectionStatus.success ? '#2e7d32' : '#d32f2f';
  };

  return (
    <div className="connection-status">
      <div className="status-header">
        <span 
          className="status-icon" 
          style={{ color: getStatusColor() }}
        >
          {getStatusIcon()}
        </span>
        <span 
          className="status-message"
          style={{ color: getStatusColor() }}
        >
          {connectionStatus.message}
        </span>
        <button 
          onClick={testBackendConnection}
          disabled={connectionStatus.testing}
          className="retry-button"
        >
          {connectionStatus.testing ? '⟳ Testing...' : '🔄 Retry'}
        </button>
      </div>

      {connectionStatus.details && (
        <div className="connection-details">
          <small>
            Endpoint: {connectionStatus.details.endpoint} | 
            Students found: {connectionStatus.details.studentCount}
          </small>
        </div>
      )}

      {!connectionStatus.success && connectionStatus.suggestions.length > 0 && (
        <div className="troubleshooting-suggestions">
          <h4>Troubleshooting Suggestions:</h4>
          <ul>
            {connectionStatus.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
          
          <div className="backend-info">
            <h5>Expected Backend Configuration:</h5>
            <ul>
              <li>• Spring Boot application running on port 8080</li>
              <li>• Base path: <code>/api</code></li>
              <li>• CORS enabled for <code>http://localhost:3000</code></li>
              <li>• Required endpoints:</li>
              <ul>
                <li><code>GET /api/students</code></li>
                <li><code>POST /api/students</code></li>
                <li><code>PUT /api/students/:id</code></li>
                <li><code>DELETE /api/students/:id</code></li>
                <li><code>GET /api/fees</code></li>
                <li><code>POST /api/fees</code></li>
                <li><code>PUT /api/fees/:id</code></li>
                <li><code>PUT /api/fees/:id/mark-paid</code></li>
                <li><code>DELETE /api/fees/:id</code></li>
              </ul>
            </ul>
          </div>
        </div>
      )}

      <style jsx>{`
        .connection-status {
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .status-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .status-icon {
          font-size: 20px;
        }

        .status-message {
          font-weight: 500;
          flex-grow: 1;
        }

        .retry-button {
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 6px 12px;
          cursor: pointer;
          font-size: 12px;
          transition: background-color 0.2s;
        }

        .retry-button:hover:not(:disabled) {
          background: #1565c0;
        }

        .retry-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .connection-details {
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }

        .troubleshooting-suggestions {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 4px;
          padding: 12px;
          margin-top: 12px;
        }

        .troubleshooting-suggestions h4 {
          margin: 0 0 8px 0;
          color: #856404;
          font-size: 14px;
        }

        .troubleshooting-suggestions ul {
          margin: 8px 0;
          padding-left: 16px;
        }

        .troubleshooting-suggestions li {
          margin: 4px 0;
          font-size: 13px;
          color: #856404;
        }

        .backend-info {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #ffeaa7;
        }

        .backend-info h5 {
          margin: 0 0 8px 0;
          color: #856404;
          font-size: 13px;
        }

        .backend-info code {
          background: #f8f9fa;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 11px;
        }
      `}</style>
    </div>
  );
};

export default ConnectionStatus;