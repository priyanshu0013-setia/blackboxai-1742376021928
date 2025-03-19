import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import {
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  History as HistoryIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    // Navigate to login
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 2 }}>
          Email Automation
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/')}
            sx={{ 
              backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            Dashboard
          </Button>

          <Button
            color="inherit"
            startIcon={<EmailIcon />}
            onClick={() => navigate('/compose')}
            sx={{ 
              backgroundColor: isActive('/compose') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            Compose
          </Button>

          <Button
            color="inherit"
            startIcon={<ScheduleIcon />}
            onClick={() => navigate('/scheduled')}
            sx={{ 
              backgroundColor: isActive('/scheduled') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            Scheduled
          </Button>

          <Button
            color="inherit"
            startIcon={<HistoryIcon />}
            onClick={() => navigate('/history')}
            sx={{ 
              backgroundColor: isActive('/history') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            History
          </Button>
        </Box>

        <IconButton color="inherit" onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
