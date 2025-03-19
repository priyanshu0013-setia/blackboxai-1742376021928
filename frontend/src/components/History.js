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
  TablePagination,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Search as SearchIcon,
  History as HistoryIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

function History() {
  const [emailHistory, setEmailHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchEmailHistory();
  }, []);

  useEffect(() => {
    filterEmails();
  }, [searchTerm, emailHistory]);

  const fetchEmailHistory = async () => {
    try {
      const response = await emails.getHistory();
      setEmailHistory(response.history.map(email => ({
        ...email,
        sentAt: new Date(email.sentAt)
      })));
    } catch (error) {
      console.error('Error fetching email history:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch email history. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterEmails = () => {
    const filtered = emailHistory.filter(email =>
      email.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHistory(filtered);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChipProps = (status) => {
    switch (status) {
      case 'sent':
        return {
          icon: <SuccessIcon />,
          label: 'Sent',
          color: 'success',
        };
      case 'failed':
        return {
          icon: <ErrorIcon />,
          label: 'Failed',
          color: 'error',
        };
      default:
        return {
          label: status,
          color: 'default',
        };
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
        Email History
      </Typography>

      <Paper sx={{ mt: 2, p: 2 }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by recipient or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Recipient</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Sent At</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box sx={{ py: 3 }}>
                      <HistoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography color="text.secondary">
                        No email history found
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredHistory
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((email) => {
                    const statusProps = getStatusChipProps(email.status);
                    return (
                      <TableRow key={email.id}>
                        <TableCell>{email.to}</TableCell>
                        <TableCell>{email.subject}</TableCell>
                        <TableCell>
                          {format(email.sentAt, 'PPpp')}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={statusProps.icon}
                            label={statusProps.label}
                            color={statusProps.color}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {email.error && (
                            <Typography color="error" variant="caption">
                              {email.error}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredHistory.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
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

export default History;
