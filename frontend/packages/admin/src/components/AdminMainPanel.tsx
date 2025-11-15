import React from "react";
import { Box, Button, Stack } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AdminMenu from "./AdminMenu";

const AdminMainPanel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isFull, setIsFull] = React.useState(true);

  return (
    <Stack direction="row" sx={{ minHeight: "100vh" }}>
      <Stack
        direction="column"
        sx={{
          zIndex: 110,
          position: "relative",
          bgcolor: "grey.100",
          minHeight: "100vh",
          width: isFull ? "260px" : "60px",
        }}
      >
        <Button
          sx={{
            alignSelf: "end",
            mr: isFull ? 1.5 : 0.75,
            mb: 1.25,
            mt: 2.5,
            minWidth: "auto",
          }}
          onClick={() => setIsFull(!isFull)}
          size="small"
        >
          <ChevronRightIcon
            sx={{
              width: "25px",
              height: "25px",
              transform: isFull ? "scale(-1, 1)" : "none",
            }}
          />
        </Button>

        <AdminMenu isFull={isFull} />
      </Stack>

      <Box sx={{ flexGrow: 1, p: 3 }}>{children}</Box>
    </Stack>
  );
};

export default AdminMainPanel;
