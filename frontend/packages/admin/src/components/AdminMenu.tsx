import React from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  ListItemIcon,
  Tooltip,
  Avatar,
  IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DownloadIcon from "@mui/icons-material/Download";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@quiz-platform/ui";

type Props = {
  isFull?: boolean;
};

const AdminMenu: React.FC<Props> = ({ isFull = true }) => {
  const navigate = useNavigate();
  const loc = useLocation();
  const { logout, user } = useAuth() as any;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const items = [
    {
      key: "profile",
      label: "Профиль",
      icon: <PersonIcon />,
      path: "/profile",
    },
    {
      key: "users",
      label: "Пользователи",
      icon: <PeopleIcon />,
      path: "/users",
    },
    {
      key: "subjects",
      label: "Предметы",
      icon: <MenuBookIcon />,
      path: "/subjects",
    },
    {
      key: "analytics",
      label: "Аналитика",
      icon: <DownloadIcon />,
      path: "/analytics",
    },
  ];

  return (
    <Box
      sx={{
        width: isFull ? 260 : 60,
        borderRight: "1px solid #ddd",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "width 200ms ease",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <List sx={{ overflowY: "auto", px: 0 }}>
          {items.map((it) => {
            const btn = (
              <ListItemButton
                key={it.key}
                selected={loc.pathname === it.path}
                onClick={() => navigate(it.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: isFull ? 40 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {it.icon}
                </ListItemIcon>
                {isFull && <ListItemText primary={it.label} />}
              </ListItemButton>
            );

            return isFull ? (
              btn
            ) : (
              <Tooltip key={it.key} title={it.label} placement="right">
                {btn}
              </Tooltip>
            );
          })}
        </List>
      </Box>

      <Divider />

      <Box sx={{ p: 1 }}>
        {isFull ? (
          <Box
            sx={{
              px: 2,
              py: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ fontSize: 13 }}>{user?.username}</Box>
            <IconButton size="small" onClick={handleLogout} aria-label="logout">
              <ExitToAppIcon />
            </IconButton>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 1,
            }}
          >
            <Tooltip title={user?.username || "Пользователь"} placement="right">
              <Avatar sx={{ width: 28, height: 28 }}>
                {user?.username?.[0] || "U"}
              </Avatar>
            </Tooltip>
            <IconButton
              size="small"
              onClick={handleLogout}
              aria-label="logout"
              sx={{ mt: 0.5 }}
            >
              <ExitToAppIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminMenu;
