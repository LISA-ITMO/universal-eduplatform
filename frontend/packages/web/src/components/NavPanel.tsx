import { Button, Tooltip, Box, Stack } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AccountCircle as ProfileIcon,
  Book as BookIcon,
  Edit as EditIcon,
  List as ListIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';

interface NavPanelProps {
  isFullPanel: boolean;
}

export const NavPanel = ({ isFullPanel }: NavPanelProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const navItems = [
    {
      label: 'Профиль',
      path: '/',
      icon: <ProfileIcon sx={{ width: 23, height: 23 }} />,
      disabled: false,
    },
    {
      label: 'Предметы',
      path: '/courses',
      icon: <BookIcon sx={{ width: 23, height: 23 }} />,
      disabled: true,
    },
    {
      label: 'Заявки',
      path: '/requests',
      icon: <PersonAddIcon sx={{ width: 22, height: 22 }} />,
      disabled: true,
    },
    {
      label: 'Составление тестов',
      path: '/creation',
      icon: <EditIcon sx={{ width: 22, height: 22 }} />,
      disabled: false,
    },
    {
      label: 'Решение тестов',
      path: '/solution',
      icon: <ListIcon sx={{ width: 23, height: 23 }} />,
      disabled: false,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.includes(path);
  };

  return (
    <Stack direction="column" spacing={1.25} sx={{ width: '100%', px: 1 }}>
      {navItems.map((item) => (
        <Tooltip key={item.path} title={item.label} placement="right">
          <span>
            <Button
              fullWidth
              disabled={item.disabled}
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                height: '50px',
                justifyContent: 'start',
                bgcolor: isActive(item.path) ? 'grey.300' : 'grey.200',
                fontWeight: isActive(item.path) ? 500 : 400,
                '&:hover': {
                  bgcolor: isActive(item.path) ? 'grey.300' : 'grey.250',
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


