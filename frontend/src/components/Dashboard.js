import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  History as HistoryIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Icon sx={{ color, mr: 1 }} />
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ textAlign: 'center', my: 2 }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch stats from API
    const fetchStats = async () => {
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats({
          totalSent: 150,
          scheduled: 5,
          pending: 3
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/compose')}
        >
          Compose New Email
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Emails Sent"
            value={stats.totalSent}
            icon={EmailIcon}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Scheduled Emails"
            value={stats.scheduled}
            icon={ScheduleIcon}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Pending Delivery"
            value={stats.pending}
            icon={HistoryIcon}
            color="#ed6c02"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<EmailIcon />}
                  onClick={() => navigate('/compose')}
                >
                  New Email
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ScheduleIcon />}
                  onClick={() => navigate('/scheduled')}
                >
                  View Scheduled
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<HistoryIcon />}
                  onClick={() => navigate('/history')}
                >
                  View History
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography color="text.secondary">
                No recent activity to display.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
