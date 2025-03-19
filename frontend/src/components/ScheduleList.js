import React, { useState, useEffect } from 'react';
import { emails } from '../services/api';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

function ScheduleList() {
  const [scheduledEmails, setScheduledEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    emailId: null
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchScheduledEmails();
  }, []);

  const fetchScheduledEmails = async () => {
    try {
      const response = await emails.getScheduled();
      setScheduledEmails(response.scheduled.map(email => ({
        ...email,
        scheduledTime: new Date(email.scheduledTime),
        status: 'pending'
      })));
    } catch (error) {
      console.error('Error fetching scheduled emails:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch scheduled emails',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (emailId) => {
    setDeleteDialog({
      open: true,
      emailId
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await emails.cancelScheduled(deleteDialog.emailId);
      setScheduledEmails(prev => 
        prev.filter(email => email.id !== deleteDialog.emailId)
      );

      setSnackbar({
        open: true,
        message: 'Scheduled email cancelled successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to cancel scheduled email',
        severity: 'error'
      });
    } finally {
      setDeleteDialog({
        open: false,
        emailId: null
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Scheduled Emails
      </Typography>

      <Paper sx={{ mt: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Recipient</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Scheduled Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scheduledEmails.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box sx={{ py: 3 }}>
                      <ScheduleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography color="text.secondary">
                        No scheduled emails found
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                scheduledEmails.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell>{email.to}</TableCell>
                    <TableCell>{email.subject}</TableCell>
                    <TableCell>
                      {format(email.scheduledTime, 'PPpp')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={email.status}
                        color={email.status === 'pending' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => console.log('Edit email', email.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(email.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, emailId: null })}
      >
        <DialogTitle>Cancel Scheduled Email</DialogTitle>
        <DialogContent>
          Are you sure you want to cancel this scheduled email?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, emailId: null })}
          >
            No, Keep It
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Yes, Cancel It
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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

export default ScheduleList;
