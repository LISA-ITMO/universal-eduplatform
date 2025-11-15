import { Button, Box, Stack } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { NavPanel } from './NavPanel';
import { UserPanel } from './UserPanel';

interface MainPanelProps {
  isFullPanel: boolean;
  setIsFullPanel: (value: boolean) => void;
  logout: () => void;
}

const MainPanel = ({ isFullPanel, setIsFullPanel, logout }: MainPanelProps) => {
  return (
    <Stack
      direction="column"
      sx={{
        zIndex: 110,
        position: 'relative',
        bgcolor: 'grey.100',
        minHeight: '100vh',
        width: '100%',
        maxWidth: isFullPanel ? '260px' : '60px',
      }}
    >
      <Button
        sx={{
          alignSelf: 'end',
          mr: isFullPanel ? 1.5 : 0.75,
          mb: 1.25,
          mt: 2.5,
          minWidth: 'auto',
        }}
        onClick={() => setIsFullPanel(!isFullPanel)}
        size="small"
      >
        <ChevronRightIcon
          sx={{
            width: '25px',
            height: '25px',
            transform: isFullPanel ? 'scale(-1, 1)' : 'none',
          }}
        />
      </Button>
      <NavPanel isFullPanel={isFullPanel} />
      <Box sx={{ flexGrow: 1 }} />
      <UserPanel isFullPanel={isFullPanel} logout={logout} />
    </Stack>
  );
};

export default MainPanel;


