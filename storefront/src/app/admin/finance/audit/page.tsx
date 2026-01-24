'use client';

import { useState, useEffect } from 'react';
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
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Stack,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  History as HistoryIcon,
  Assessment as AuditIcon,
  AttachFile as AttachmentIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import ProtectedRoute from '@/components/ProtectedRoute';

interface AuditLog {
  id: number;
  entity_type: string;
  entity_id: number;
  entity_identifier: string | null;
  action: string;
  description: string | null;
  performed_by_name: string | null;
  ip_address: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  changed_fields: string[] | null;
  created_at: string;
  documents?: unknown[];
}

interface AuditStats {
  total_logs: number;
  by_action: Record<string, number>;
  by_entity_type: Record<string, number>;
  recent_activity: AuditLog[];
}

export default function AuditTrailPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filters, setFilters] = useState({
    action: '',
    entity_type: '',
    start_date: '',
    end_date: '',
    search: '',
  });

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, []);

  const fetchLogs = async (appliedFilters = filters) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();

      Object.entries(appliedFilters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v2/finance/audit?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch audit logs');

      const data = await response.json();
      setLogs(data.data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v2/finance/audit/statistics`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) return;

      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setDetailsOpen(true);
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      created: 'Created',
      updated: 'Updated',
      deleted: 'Deleted',
      restored: 'Restored',
      approved: 'Approved',
      rejected: 'Rejected',
      reversed: 'Reversed',
    };
    return labels[action] || action;
  };

  const getActionColor = (action: string): 'success' | 'info' | 'error' | 'default' | 'warning' => {
    const colors: Record<string, 'success' | 'info' | 'error' | 'default' | 'warning'> = {
      created: 'success',
      updated: 'info',
      deleted: 'error',
      restored: 'warning',
      approved: 'success',
      rejected: 'error',
      reversed: 'warning',
    };
    return colors[action] || 'default';
  };

  const getEntityLabel = (entityType: string) => {
    return entityType.split('\\').pop() || entityType;
  };

  return (
    <ProtectedRoute>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AuditIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight="bold">
              Audit Trail
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        {stats && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Logs
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {stats.total_logs}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Created
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="success.main">
                    {stats.by_action?.created || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Updated
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="info.main">
                    {stats.by_action?.updated || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Deleted
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="error.main">
                    {stats.by_action?.deleted || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Search"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                InputProps={{
                  endAdornment: <SearchIcon color="action" />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Action</InputLabel>
                <Select
                  value={filters.action}
                  label="Action"
                  onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="created">Created</MenuItem>
                  <MenuItem value="updated">Updated</MenuItem>
                  <MenuItem value="deleted">Deleted</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="reversed">Reversed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="From"
                InputLabelProps={{ shrink: true }}
                value={filters.start_date}
                onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="To"
                InputLabelProps={{ shrink: true }}
                value={filters.end_date}
                onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  startIcon={<FilterIcon />}
                  onClick={() => fetchLogs()}
                  fullWidth
                >
                  Apply Filters
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setFilters({
                      action: '',
                      entity_type: '',
                      start_date: '',
                      end_date: '',
                      search: '',
                    });
                    fetchLogs({});
                  }}
                >
                  Clear
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Audit Logs Table */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Entity</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>IP Address</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography>Loading...</Typography>
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="textSecondary">No audit logs found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(log.created_at).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getActionLabel(log.action)}
                          color={getActionColor(log.action)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {getEntityLabel(log.entity_type)}
                        </Typography>
                        {log.entity_identifier && (
                          <Typography variant="caption" color="textSecondary">
                            {log.entity_identifier}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 300 }}>
                          {log.description || '-'}
                        </Typography>
                        {log.changed_fields && log.changed_fields.length > 0 && (
                          <Typography variant="caption" color="primary">
                            {log.changed_fields.length} fields changed
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {log.performed_by_name || 'System'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="textSecondary">
                          {log.ip_address || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(log)}
                            color="primary"
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Details Dialog */}
        <Dialog
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HistoryIcon />
              Audit Log Details
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedLog && (
              <Stack spacing={2}>
                {/* Basic Info */}
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Action
                  </Typography>
                  <Chip
                    label={getActionLabel(selectedLog.action)}
                    color={getActionColor(selectedLog.action)}
                    sx={{ mt: 0.5 }}
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {selectedLog.description}
                  </Typography>
                </Box>

                <Divider />

                {/* Changed Fields */}
                {selectedLog.changed_fields && selectedLog.changed_fields.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Changed Fields
                    </Typography>
                    <List dense>
                      {selectedLog.changed_fields.map((field) => (
                        <ListItem key={field}>
                          <ListItemText
                            primary={field}
                            secondary={
                              <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                                <Typography variant="caption" color="error">
                                  Old: {String(selectedLog.old_values?.[field] ?? '-')}
                                </Typography>
                                <Typography variant="caption" color="success">
                                  New: {String(selectedLog.new_values?.[field] ?? '-')}
                                </Typography>
                              </Stack>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Metadata */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Performed By
                    </Typography>
                    <Typography variant="body2">
                      {selectedLog.performed_by_name || 'System'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      IP Address
                    </Typography>
                    <Typography variant="body2">
                      {selectedLog.ip_address || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Timestamp
                    </Typography>
                    <Typography variant="body2">
                      {new Date(selectedLog.created_at).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Documents */}
                {selectedLog.documents && selectedLog.documents.length > 0 && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Attached Documents
                      </Typography>
                      {selectedLog.documents.map((doc: any) => (
                        <Chip
                          key={doc.id}
                          icon={<AttachmentIcon />}
                          label={doc.file_name}
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  </>
                )}
              </Stack>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </ProtectedRoute>
  );
}
