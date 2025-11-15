import React from "react";
import { Avatar, Box, TextField } from "@mui/material";
import { useAuth } from "@quiz-platform/ui";

const AdminProfileCard: React.FC = () => {
  const { user } = useAuth() as any;

  return (
    <Box sx={{ my: 5, mx: 3, maxWidth: "900px" }}>
      <Box sx={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 1 }}>
        <Box sx={{ textAlign: "center", pt: 1, pb: 3 }}>
          <Box sx={{ fontSize: 22, fontWeight: 600 }}>Профиль пользователя</Box>
        </Box>
        <Box
          sx={{ display: "flex", alignItems: "center", fontSize: 18, pl: 2 }}
        >
          <Box>
            <Avatar alt={user?.username} sx={{ width: 70, height: 70 }}>
              {user?.username?.[0] || "U"}
            </Avatar>
          </Box>
          <Box sx={{ pl: 3 }}>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ fontWeight: 600 }}>ID пользователя:</Box>
              <Box
                sx={{ whiteSpace: "pre" }}
              >{` ${user?.id || "Нет значения"}`}</Box>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ fontWeight: 600 }}>Роль пользователя:</Box>
              <Box
                sx={{ whiteSpace: "pre" }}
              >{` ${user?.role || "Нет значения"}`}</Box>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ fontWeight: 600 }}>Логин:</Box>
              <Box
                sx={{ whiteSpace: "pre" }}
              >{` ${user?.username || "Нет значения"}`}</Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ pl: 2, py: 3, pr: 10 }}>
          <Box sx={{ py: 0.5 }}>
            <Box sx={{ fontWeight: 600 }}>Фамилия</Box>
            <TextField
              name="lastname"
              value={user?.lastName || ""}
              variant="standard"
              size="small"
              sx={{ width: "50%", minWidth: "200px" }}
              disabled
            />
          </Box>
          <Box sx={{ py: 0.5 }}>
            <Box sx={{ fontWeight: 600 }}>Имя</Box>
            <TextField
              name="firstname"
              value={user?.firstName || ""}
              variant="standard"
              size="small"
              sx={{ width: "50%", minWidth: "200px" }}
              disabled
            />
          </Box>
          <Box sx={{ py: 0.5 }}>
            <Box sx={{ fontWeight: 600 }}>Отчество</Box>
            <TextField
              name="patronymic"
              value={user?.middleName || ""}
              variant="standard"
              size="small"
              sx={{ width: "50%", minWidth: "200px" }}
              disabled
            />
          </Box>
          <Box>
            <Box sx={{ fontWeight: 600 }}>Электронная почта</Box>
            <TextField
              name="email"
              value={user?.email || "Нет значения"}
              variant="standard"
              size="small"
              sx={{ width: "50%", minWidth: "200px" }}
              disabled
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminProfileCard;
