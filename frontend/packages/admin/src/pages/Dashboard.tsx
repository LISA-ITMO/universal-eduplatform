import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@quiz-platform/ui";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Админ-панель</Typography>
        <Button variant="outlined" color="primary" onClick={handleLogout}>
          Выйти
        </Button>
      </Box>
      <Typography sx={{ mt: 2 }}>
        Добро пожаловать в административную панель.
      </Typography>
    </Box>
  );
};

export default Dashboard;
