import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box, CircularProgress,
  Grid, TextField, Button, Alert, IconButton,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { studentAPI } from '../services/api.js';

export default function DueFees() {
  const [data, setData] = useState({ students: [], messages: [] });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  const load = async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await studentAPI.getDueFull();
      setData(res.data);
    } catch (e) {
      setMsg('Error loading due fees');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const copy = async (text) => {
    await navigator.clipboard.writeText(text);
    setMsg('Message copied to clipboard!');
    setTimeout(() => setMsg(null), 2000);
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>💰 Fees Due Today</Typography>
          <Button variant="outlined" onClick={load}>Refresh</Button>
        </Box>

        {loading && (
          <Box textAlign="center" my={5}><CircularProgress /></Box>
        )}

        {msg && !loading && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}

        {!loading && data.students.length === 0 && (
          <Alert severity="success">🎉 No fees due today!</Alert>
        )}

        <Grid container spacing={3}>
          {data.students.map((s, i) => (
            <Grid item xs={12} key={s.id}>
              <Paper
                sx={{
                  p: 3,
                  background: 'linear-gradient(135deg,#fff3cd 0%,#ffeaa7 100%)',
                  borderLeft: '6px solid #f39c12',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {s.name} ({s.rollNumber}) – ₹{s.monthlyFee}
                </Typography>
                <Typography sx={{ color: '#555', mb: 1 }}>
                  Parent: {s.parentName || 'N/A'} ({s.parentPhone || 'N/A'})
                </Typography>
                <TextField
                  multiline
                  fullWidth
                  value={data.messages[i]}
                  InputProps={{ readOnly: true }}
                />
                <IconButton
                  color="primary"
                  onClick={() => copy(data.messages[i])}
                  sx={{ mt: 1 }}
                >
                  <ContentCopyIcon /> Copy
                </IconButton>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
}
