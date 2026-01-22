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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Alert,
  Stack,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow as GenerateIcon,
  Download as ExportIcon,
  Assessment as ReportIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { FinancialReport, ReportTemplate } from '@/types/api';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function FinancialReportsPage() {
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'comparative',
    description: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    export_format: 'pdf',
  });

  useEffect(() => {
    fetchReports();
    fetchTemplates();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v2/finance/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch reports');

      const data = await response.json();
      setReports(data.data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v2/finance/reports/templates`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) return;

      const data = await response.json();
      setTemplates(data.data || []);
    } catch (err) {
      console.error('Failed to fetch templates:', err);
    }
  };

  const handleOpen = (template?: ReportTemplate) => {
    if (template) {
      setFormData({
        name: template.name,
        type: template.type as any,
        description: template.description || '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        export_format: 'pdf',
      });
    } else {
      setFormData({
        name: '',
        type: 'comparative',
        description: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        export_format: 'pdf',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v2/finance/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create report');

      await fetchReports();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleGenerate = async (id: number) => {
    try {
      setGenerating(id);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v2/finance/reports/${id}/generate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to generate report');

      await fetchReports();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setGenerating(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v2/finance/reports/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchReports();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      comparative: 'Comparative',
      ratio: 'Ratio Analysis',
      cash_flow: 'Cash Flow',
      fund_flow: 'Fund Flow',
      custom: 'Custom',
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string): 'default' | 'info' | 'success' | 'error' => {
    const colors: Record<string, 'default' | 'info' | 'success' | 'error'> = {
      pending: 'default',
      generating: 'info',
      completed: 'success',
      failed: 'error',
    };
    return colors[status] || 'default';
  };

  const reportTypes = [
    { value: 'comparative', label: 'Comparative Statement', icon: <TrendingUpIcon /> },
    { value: 'ratio', label: 'Ratio Analysis', icon: <TrendingUpIcon /> },
    { value: 'cash_flow', label: 'Cash Flow Projection', icon: <ReportIcon /> },
    { value: 'fund_flow', label: 'Fund Flow Statement', icon: <ReportIcon /> },
    { value: 'custom', label: 'Custom Report', icon: <ReportIcon /> },
  ];

  return (
    <ProtectedRoute>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ReportIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight="bold">
              Financial Reports
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{ borderRadius: 2 }}
          >
            Create Report
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Report Templates */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quick Start - Use Templates
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {templates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
                onClick={() => handleOpen(template)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ReportIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      {template.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {template.description}
                  </Typography>
                  <Chip label={template.category || template.type} size="small" color="primary" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Reports List */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          My Reports
        </Typography>
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Report Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Scheduled</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography>Loading...</Typography>
                    </TableCell>
                  </TableRow>
                ) : reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="textSecondary">No reports found. Create your first report!</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report.id} hover>
                      <TableCell>
                        <Typography fontWeight="medium">{report.name}</Typography>
                        {report.description && (
                          <Typography variant="body2" color="text.secondary">
                            {report.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip label={getTypeLabel(report.type)} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        {report.start_date && report.end_date ? (
                          <Typography variant="body2">
                            {new Date(report.start_date).toLocaleDateString()} - {new Date(report.end_date).toLocaleDateString()}
                          </Typography>
                        ) : (
                          <Typography color="textSecondary">Not set</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={report.status.toUpperCase()}
                          color={getStatusColor(report.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {report.is_scheduled ? (
                          <Chip label="Yes" color="primary" size="small" />
                        ) : (
                          <Chip label="No" size="small" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {report.status === 'pending' && (
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<GenerateIcon />}
                              onClick={() => handleGenerate(report.id)}
                              disabled={generating === report.id}
                            >
                              {generating === report.id ? 'Generating...' : 'Generate'}
                            </Button>
                          )}
                          {report.status === 'completed' && (
                            <IconButton size="small" color="primary">
                              <ExportIcon fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(report.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
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

        {/* Create Report Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            Create Custom Report
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Stack spacing={3} sx={{ mt: 1 }}>
                <TextField
                  label="Report Name"
                  fullWidth
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Q1 2024 Financial Analysis"
                />

                <FormControl fullWidth required>
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    value={formData.type}
                    label="Report Type"
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  >
                    {reportTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {type.icon}
                          {type.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the report..."
                />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Start Date"
                      type="date"
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="End Date"
                      type="date"
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </Grid>
                </Grid>

                <FormControl fullWidth>
                  <InputLabel>Export Format</InputLabel>
                  <Select
                    value={formData.export_format}
                    label="Export Format"
                    onChange={(e) => setFormData({ ...formData, export_format: e.target.value as any })}
                  >
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="excel">Excel</MenuItem>
                    <MenuItem value="csv">CSV</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                Create Report
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </ProtectedRoute>
  );
}
