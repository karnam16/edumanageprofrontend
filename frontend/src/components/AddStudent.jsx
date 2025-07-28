import React, { useState } from 'react';
import {
  Container, Grid, TextField, MenuItem, Button, Paper, Typography, Alert,
} from '@mui/material';
import { studentAPI } from '../services/api.js';

const classes = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);

export default function AddStudent() {
  const [form, setForm] = useState({
    name: '', rollNumber: '', email: '', phone: '',
    parentName: '', parentPhone: '', className: '',
    joiningDate: new Date().toISOString().split('T')[0],
    monthlyFee: 1000, discountPercent: 0,
  });
  const [msg, setMsg] = useState(null);
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await studentAPI.add(form);
      setMsg({ type: 'success', text: 'Student added!' });
      setForm({ ...form, name: '', rollNumber: '' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data || 'Error adding student' });
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          ➕ Add New Student
        </Typography>

        {msg && <Alert severity={msg.type} sx={{ mb: 3 }}>{msg.text}</Alert>}

        <form onSubmit={submit}>
          <Grid container spacing={2}>
            {[
              ['name',          'Student Name',  'text',  true ],
              ['rollNumber',    'Roll Number',   'text',  true ],
              ['email',         'Email',         'email', false],
              ['phone',         'Student Phone', 'tel',   false],
              ['parentName',    'Parent Name',   'text',  false],
              ['parentPhone',   'Parent Phone',  'tel',   true ],
            ].map(([name, label, type, req]) => (
              <Grid item xs={12} md={6} key={name}>
                <TextField
                  name={name}
                  label={label}
                  type={type}
                  required={req}
                  fullWidth
                  value={form[name]}
                  onChange={handle}
                />
              </Grid>
            ))}

            <Grid item xs={12} md={6}>
              <TextField
                select
                name="className"
                label="Class"
                fullWidth
                value={form.className}
                onChange={handle}
              >
                <MenuItem value="">None</MenuItem>
                {classes.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="joiningDate"
                label="Joining Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.joiningDate}
                onChange={handle}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="monthlyFee"
                label="Monthly Fee (₹)"
                type="number"
                fullWidth
                value={form.monthlyFee}
                onChange={handle}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="discountPercent"
                label="Discount %"
                type="number"
                fullWidth
                value={form.discountPercent}
                onChange={handle}
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            type="submit"
            sx={{ mt: 3, px: 4, py: 1.5 }}
          >
            Save Student
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
