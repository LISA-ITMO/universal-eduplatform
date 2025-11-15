import { Box, Button, Divider, Typography, Tooltip } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@quiz-platform/ui';

interface UserPanelProps {
  isFullPanel: boolean;
  logout: () => void;
}

export const UserPanel = ({ logout, isFullPanel }: UserPanelProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.25,
        width: '100%',
        px: 1,
        pb: 2,
      }}
    >
      {user && isFullPanel && (
        <Tooltip title={user.username}>
          <Typography
            variant="body2"
            sx={{
              maxWidth: '250px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <strong>Пользователь</strong>: {user.username}
          </Typography>
        </Tooltip>
      )}
      <Divider sx={{ width: '100%' }} />
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Button
          onClick={handleLogout}
          size="medium"
          variant="text"
          color="error"
          sx={{ minWidth: '40px' }}
        >
          <LogoutIcon sx={{ width: 25, height: 25 }} />
        </Button>
      </Box>
    </Box>
  );
};




