import * as React from 'react';

import { styled, useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import CategoryIcon from '@mui/icons-material/Category';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import image from '../assets/lebede.png';
import smallImage from '../assets/lebede-small.png';

const drawerWidth = 240;
const collapsedDrawerWidth = 65;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: collapsedDrawerWidth,
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: open ? drawerWidth : collapsedDrawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  })
);

export default function SideMenu({ open, handleDrawerToggle, setCurrentView }) {
  const theme = useTheme();
  const logo = open ? image : smallImage;

  const menuItems = [
    {
      text: 'Overview',
      icon: <DashboardIcon />,
      path: '/overview',
    },
    {
      text: 'Categories',
      icon: <CategoryIcon />,
      path: '/categories',
    },
    {
      text: 'Questions',
      icon: <QuestionAnswerIcon />,
      path: '/questions',
    },
  ];

  return (
    <StyledDrawer variant='permanent' open={open}>
      {!open && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, ml: 1 }}>
          <img src={logo} alt='logo' width={30} height={20} />
        </Box>
      )}
      <DrawerHeader>
        <div
          style={{
            padding: '20px',
            flexGrow: 1,
            display: 'flex',
            justifyContent: open ? 'flex-start' : 'center',
          }}
        >
          <img src={logo} alt='logo' width={open ? 110 : 30} height={open ? 25 : 20} />
        </div>

        <IconButton
          onClick={handleDrawerToggle}
          size={open ? 'medium' : 'small'}
          sx={{ ml: open ? '-10px' : 'auto' }}
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <Tooltip title={!open ? item.text : ''} placement='right' key={item.text}>
            <ListItem
              disablePadding
              sx={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
            >
              <Link
                to={item.path}
                style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    width: '100%',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      ml: !open ? 1 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Link>
            </ListItem>
          </Tooltip>
        ))}
        <Divider />
      </List>
    </StyledDrawer>
  );
}
