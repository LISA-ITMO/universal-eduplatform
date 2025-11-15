import React from 'react';
import { Box } from '@mui/material';

interface FormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
}

const Form: React.FC<FormProps> = ({ children, onSubmit }) => {
  return (
    <Box component="form" onSubmit={onSubmit} sx={{ width: '100%' }}>
      {children}
    </Box>
  );
};

export default Form;




