import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, Container,
} from '@mui/material';
import {
  Dashboard, PersonAdd, Payment, People, School,
} from '@mui/icons-material';

export default function Navbar() {
  const { pathname } = useLocation();
  const active = (path) => pathname === path;

  const navBtn = (to, Icon, label) => (
    <Button
      component={Link}
      to={to}
      startIcon={<Icon />}
      color="inherit"
      variant={active(to) ? 'outlined' : 'text'}
      sx={{
        borderRadius: '25px',
        textTransform: 'none',
        fontWeight: 500,
        ...(active(to) && {
          backgroundColor: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
        }),
      }}
    >
      {label}
    </Button>
  );

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)',
        borderRadius: 3,
        boxShadow: 3,
        mb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar>
          <School sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Tuition Management System
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navBtn('/',           Dashboard, 'Dashboard')}
            {navBtn('/add-student', PersonAdd, 'Add Student')}
            {navBtn('/due-fees',    Payment,   'Due Fees')}
            {navBtn('/students',    People,    'All Students')}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
