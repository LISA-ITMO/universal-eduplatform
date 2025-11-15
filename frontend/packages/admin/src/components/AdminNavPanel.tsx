import React from "react";
import { Button, Tooltip, Box, Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AccountCircle as ProfileIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  List as AuditIcon,
  School as CoursesIcon,
} from "@mui/icons-material";

interface NavPanelProps {
  isFullPanel: boolean;
}

export const AdminNavPanel = ({ isFullPanel }: NavPanelProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const navItems = [
    {
      label: "Профиль",
      path: "/profile",
      icon: <ProfileIcon sx={{ width: 23, height: 23 }} />,
      disabled: false,
    },
    {
      label: "Пользователи",
      path: "/users",
      icon: <UsersIcon sx={{ width: 23, height: 23 }} />,
      disabled: false,
    },
    {
      label: "Предметы",
      path: "/courses",
      icon: <CoursesIcon sx={{ width: 23, height: 23 }} />,
      disabled: true,
    },
    {
      label: "Аудит",
      path: "/audit",
      icon: <AuditIcon sx={{ width: 23, height: 23 }} />,
      disabled: true,
    },
    {
      label: "Настройки",
      path: "/settings",
      icon: <SettingsIcon sx={{ width: 23, height: 23 }} />,
      disabled: true,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <Stack direction="column" spacing={1.25} sx={{ width: "100%", px: 1 }}>
      {navItems.map((item) => (
        <Tooltip key={item.path} title={item.label} placement="right">
          <span>
            <Button
              fullWidth
              disabled={item.disabled}
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                height: "50px",
                justifyContent: "start",
                bgcolor: isActive(item.path) ? "grey.300" : "grey.200",
                fontWeight: isActive(item.path) ? 500 : 400,
                "&:hover": {
                  bgcolor: isActive(item.path) ? "grey.300" : "grey.250",
                },
              }}
            >
              {isFullPanel && item.label}
            </Button>
          </span>
        </Tooltip>
      ))}
    </Stack>
  );
};

export default AdminNavPanel;
