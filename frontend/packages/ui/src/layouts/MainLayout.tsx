import React from 'react';
import { Container, Box } from '@mui/material';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>{children}</Box>
    </Container>
  );
};

export default MainLayout;




