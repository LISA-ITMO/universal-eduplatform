import React from 'react';
import { Box, Container } from '@mui/material';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>{children}</Box>
    </Container>
  );
};

export default AdminLayout;




