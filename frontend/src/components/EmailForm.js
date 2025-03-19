import React, { useState } from 'react';
import { emails } from '../services/api';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Switch,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Send as SendIcon, Schedule as ScheduleIcon } from '@mui/icons-material';

function EmailForm() {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    body: '',
  });
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleToggle = (e) => {
    setIsScheduled(e.target.checked);
    if (!e.target.checked) {
      setScheduledTime(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const emailData = {
        ...formData,
        scheduledTime: isScheduled ? scheduledTime.toISOString() : undefined
      };

      if (isScheduled) {
        await emails.schedule(emailData);
      } else {
        await emails.send(emailData);
      }

      setSnackbar({
        open: true,
        message: isScheduled ? 'Email scheduled successfully!' : 'Email sent successfully!',
        severity: 'success'
      });

      // Clear form
      setFormData({
        to: '',
        subject: '',
        body: ''
      });
      setScheduledTime(null);
      setIsScheduled(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to send email. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Compose Email
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="To"
            name="to"
            type="email"
            value={formData.to}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Message"
            name="body"
            multiline
            rows={6}
            value={formData.body}
            onChange={handleChange}
            required
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isScheduled}
                  onChange={handleScheduleToggle}
                  name="scheduled"
                />
              }
              label="Schedule for later"
            />

            {isScheduled && (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Schedule Time"
                  value={scheduledTime}
                  onChange={(newValue) => setScheduledTime(newValue)}
                  minDateTime={new Date()}
                  sx={{ flexGrow: 1 }}
                />
              </LocalizationProvider>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || (isScheduled && !scheduledTime)}
              startIcon={isScheduled ? <ScheduleIcon /> : <SendIcon />}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : isScheduled ? (
                'Schedule Email'
              ) : (
                'Send Email'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EmailForm;
