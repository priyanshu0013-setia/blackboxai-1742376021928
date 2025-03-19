import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EmailForm from './components/EmailForm';
import ScheduleList from './components/ScheduleList';
import History from './components/History';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {isAuthenticated && <Header />}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route 
            path="/login" 
            element={<Login onLogin={() => setIsAuthenticated(true)} />} 
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/compose"
            element={
              <ProtectedRoute>
                <EmailForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scheduled"
            element={
              <ProtectedRoute>
                <ScheduleList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
