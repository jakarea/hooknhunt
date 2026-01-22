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
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Alert,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MonetizationOn as MonetizationOnIcon,
} from '@mui/icons-material';
import { Currency, CurrencyCreateRequest, CurrencyUpdateRequest } from '@/types/api';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function CurrenciesPage() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Currency | null>(null);
  const [formData, setFormData] = useState<CurrencyCreateRequest | CurrencyUpdateRequest>({
    code: '',
    name: '',
    symbol: '',
    symbol_position: 'left',
    decimal_places: 2,
    exchange_rate: null,
    is_active: true,
    notes: '',
  });

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v2/finance/currencies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch currencies');

      const data = await response.json();
      setCurrencies(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (currency?: Currency) => {
    if (currency) {
      setEditing(currency);
      setFormData({
        name: currency.name,
        symbol: currency.symbol,
        symbol_position: currency.symbol_position,
        decimal_places: currency.decimal_places,
        exchange_rate: currency.exchange_rate || undefined,
        is_active: currency.is_active,
        notes: currency.notes || '',
      });
    } else {
      setEditing(null);
      setFormData({
        code: '',
        name: '',
        symbol: '',
        symbol_position: 'left',
        decimal_places: 2,
        exchange_rate: undefined,
        is_active: true,
        notes: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editing
        ? `${process.env.NEXT_PUBLIC_API_URL}/v2/finance/currencies/${editing.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/v2/finance/currencies`;

      const method = editing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to save currency');
      }

      await fetchCurrencies();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this currency?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v2/finance/currencies/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete currency');

      await fetchCurrencies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <ProtectedRoute>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MonetizationOnIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight="bold">
              Currencies
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{ borderRadius: 2 }}
          >
            Add Currency
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Symbol</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Exchange Rate (to BDT)</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Default</TableCell>
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
                ) : currencies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="textSecondary">No currencies found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  currencies.map((currency) => (
                    <TableRow key={currency.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{currency.code}</TableCell>
                      <TableCell>{currency.name}</TableCell>
                      <TableCell>
                        {currency.symbol_position === 'left'
                          ? `${currency.symbol}100`
                          : `100${currency.symbol}`}
                      </TableCell>
                      <TableCell>
                        {currency.exchange_rate
                          ? currency.exchange_rate.toFixed(6)
                          : 'Not set'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={currency.is_active ? 'Active' : 'Inactive'}
                          color={currency.is_active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {currency.is_default && (
                          <Chip label="Default" color="primary" size="small" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            onClick={() => handleOpen(currency)}
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          {!currency.is_default && (
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(currency.id)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editing ? 'Edit Currency' : 'Add New Currency'}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Stack spacing={3} sx={{ mt: 1 }}>
                {!editing && (
                  <TextField
                    label="Currency Code"
                    fullWidth
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="USD"
                    inputProps={{ maxLength: 3 }}
                  />
                )}

                <TextField
                  label="Currency Name"
                  fullWidth
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="US Dollar"
                />

                <TextField
                  label="Symbol"
                  fullWidth
                  required
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  placeholder="$"
                />

                <FormControl fullWidth>
                  <InputLabel>Symbol Position</InputLabel>
                  <Select
                    value={formData.symbol_position}
                    label="Symbol Position"
                    onChange={(e) => setFormData({ ...formData, symbol_position: e.target.value as 'left' | 'right' })}
                  >
                    <MenuItem value="left">Left (৳100)</MenuItem>
                    <MenuItem value="right">Right (100﷼)</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Decimal Places"
                  type="number"
                  fullWidth
                  required
                  value={formData.decimal_places}
                  onChange={(e) => setFormData({ ...formData, decimal_places: parseInt(e.target.value) || 0 })}
                  inputProps={{ min: 0, max: 6 }}
                />

                <TextField
                  label="Exchange Rate (to BDT)"
                  type="number"
                  fullWidth
                  value={formData.exchange_rate || ''}
                  onChange={(e) => setFormData({ ...formData, exchange_rate: e.target.value ? parseFloat(e.target.value) : null })}
                  placeholder="Enter rate to BDT"
                  inputProps={{ step: '0.000001', min: 0 }}
                  helperText="Leave empty to set later"
                />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <Typography>Active</Typography>
                </Box>

                <TextField
                  label="Notes"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                {editing ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </ProtectedRoute>
  );
}
